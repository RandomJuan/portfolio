'use client';
import { useEffect, useRef, useState } from 'react';

const FIREFLY_SVG = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="35" rx="4" ry="8" fill="#1a202c" />
  <ellipse cx="50" cy="50" rx="3.5" ry="10" fill="#d4ff00" />
  <path d="M 46 35 Q 20 15, 10 40 Q 25 50, 46 45 Z" fill="rgba(200, 255, 255, 0.4)" />
  <path d="M 54 35 Q 80 15, 90 40 Q 75 50, 54 45 Z" fill="rgba(200, 255, 255, 0.4)" />
  <circle cx="50" cy="24" r="3" fill="#0f172a" />
</svg>
`;

type GroupTarget = { x: number; y: number; z: number };

// Global Frog Engine State to allow Fireflies to interact with it directly
type FrogEngineState = {
  isEating: boolean;
  chewingTimer: number;
  mouthX: number;
  mouthY: number;
  dispatchUpdate: () => void;
};

class Firefly {
  x: number;
  y: number;
  z: number;
  s: number;
  ang: number;
  targetAng: number;
  v: number;
  vz: number;
  glowColor: string;
  groupId: number;

  isOn: boolean;
  alpha: number;
  timer: number;
  onDuration: number;
  offDuration: number;

  isBeingEaten: boolean;

  constructor(w: number, h: number) {
    this.s = Math.random() * 40 + 20;
    this.v = Math.random() * 2 + 1;
    this.vz = (Math.random() - 0.5) * 2;
    this.ang = Math.random() * Math.PI * 2;
    this.targetAng = this.ang;
    this.glowColor = Math.random() > 0.5 ? '212, 255, 0' : '238, 255, 0';

    this.groupId = Math.floor(Math.random() * 5);

    this.x = (Math.random() - 0.5) * w * 3;
    this.y = (Math.random() - 0.5) * h * 3;
    this.z = Math.random() * 800 + 200;

    this.isOn = Math.random() > 0.5;
    this.alpha = this.isOn ? Math.random() : 0;
    this.timer = Math.random() * 300;
    this.onDuration = Math.random() * 100 + 50;
    this.offDuration = Math.random() * 400 + 100;

    this.isBeingEaten = false;
  }

  spawn(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w * 3;
    this.y = (Math.random() - 0.5) * h * 3;
    this.z = 1500;
    this.isOn = false;
    this.alpha = 0;
    this.timer = 0;
    this.isBeingEaten = false;
  }

  update(w: number, h: number, swarmTarget: GroupTarget, allFireflies: Firefly[], frogState: FrogEngineState) {
    // --- VACUUM CONSUMPTION PHYSICS ---
    // If caught, ignore all other physical laws and accelerate directly into the frog's mouth 
    if (this.isBeingEaten) {
      const focus = 400;
      const safeZ = Math.max(-150, this.z);
      const scale = focus / (focus + safeZ);

      // Convert visual screen mouth coordinates back into logical mapping for the bug
      const targetLogicalX = (frogState.mouthX - w / 2) / scale;
      const targetLogicalY = (frogState.mouthY - h / 2) / scale;

      this.x += (targetLogicalX - this.x) * 0.15; // Aggressively swoop to mouth
      this.y += (targetLogicalY - this.y) * 0.15;
      this.z += (0 - this.z) * 0.15; // Snap cleanly to the exact Z plane of the frog (Z=0)

      // Reconfigure visual angle to face the maw directly as it's swallowed
      const angToMaw = Math.atan2(targetLogicalY - this.y, targetLogicalX - this.x);
      this.ang = angToMaw;

      const distSq = Math.pow(targetLogicalX - this.x, 2) + Math.pow(targetLogicalY - this.y, 2);
      if (distSq < 150) { // Deep inside the mouth
        this.spawn(w, h);
        frogState.isEating = false; // Snap Jaw Closed
        frogState.chewingTimer = 90; // 1.5 second chew cooldown
        frogState.dispatchUpdate();
      }
      return; // Stop processing normal physics!
    }

    // 1. Blinking Logic
    this.timer++;
    if (this.isOn && this.timer > this.onDuration) {
      this.isOn = false;
      this.timer = 0;
      this.offDuration = Math.random() * 500 + 200;
    } else if (!this.isOn && this.timer > this.offDuration) {
      this.isOn = true;
      this.timer = 0;
      this.onDuration = Math.random() * 150 + 50;
    }

    if (this.isOn) {
      this.alpha += 0.05;
      if (this.alpha > 1) this.alpha = 1;
    } else {
      this.alpha -= 0.03;
      if (this.alpha < 0) this.alpha = 0;
    }

    // 2. Boids Separation Rule (Collison Repulsion so bugs steer away from each other)
    let tooClose = false;
    for (let i = 0; i < allFireflies.length; i++) {
      const other = allFireflies[i];
      if (other === this) continue;

      const dx = this.x - other.x;
      const dy = this.y - other.y;

      if (Math.abs(dx) > 100 || Math.abs(dy) > 100) continue;
      const dz = this.z - other.z;
      if (Math.abs(dz) > 100) continue;

      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < 6400) {
        tooClose = true;
        const angleAway = Math.atan2(dy, dx);
        let diffToAway = angleAway - this.targetAng;
        while (diffToAway > Math.PI) diffToAway -= Math.PI * 2;
        while (diffToAway < -Math.PI) diffToAway += Math.PI * 2;
        this.targetAng += diffToAway * 0.15;
      }
    }
    if (tooClose) {
      this.vz += (Math.random() - 0.5) * 2;
    }

    // 3. Swarm Behavior
    const angleToTarget = Math.atan2(swarmTarget.y - this.y, swarmTarget.x - this.x);
    let diffToTarget = angleToTarget - this.targetAng;
    while (diffToTarget > Math.PI) diffToTarget -= Math.PI * 2;
    while (diffToTarget < -Math.PI) diffToTarget += Math.PI * 2;

    this.targetAng += diffToTarget * 0.015;
    this.targetAng += (Math.random() - 0.5) * 0.25;

    const zDiff = swarmTarget.z - this.z;
    this.vz += zDiff * 0.0005;

    // Soft Bounded Curves
    const worldLimitW = w * 1.5;
    const worldLimitH = h * 1.5;
    if (this.x < -worldLimitW) this.targetAng = 0;
    if (this.x > worldLimitW) this.targetAng = Math.PI;
    if (this.y < -worldLimitH) this.targetAng = Math.PI / 2;
    if (this.y > worldLimitH) this.targetAng = -Math.PI / 2;

    let diff = this.targetAng - this.ang;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.ang += diff * 0.04;

    if (this.vz > 3) this.vz = 3;
    if (this.vz < -3) this.vz = -3;

    this.x += Math.cos(this.ang) * this.v;
    this.y += Math.sin(this.ang) * this.v;
    this.z += this.vz;

    // --- PREDATOR DETECTION ---
    // If a bug strays too close to the frog's mouth while flying in the foreground!
    if (this.z <= 400 && this.alpha > 0.5 && !frogState.isEating && frogState.mouthX > 0 && frogState.chewingTimer <= 0) {
      const focus = 400;
      const safeZ = Math.max(-150, this.z);
      const scale = focus / (focus + safeZ);
      const screenX = w / 2 + this.x * scale;
      const screenY = h / 2 + this.y * scale;

      const dx = screenX - frogState.mouthX;
      const dy = screenY - frogState.mouthY;

      if (dx * dx + dy * dy < 40000) { // 200px visual radius kill-zone
        this.isBeingEaten = true;
        frogState.isEating = true; // Frog Jaw Opens!
        frogState.dispatchUpdate();
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
    if (this.alpha <= 0.01) return;

    const focus = 400;
    const safeZ = Math.max(-150, this.z);
    const scale = focus / (focus + safeZ);

    const screenX = w / 2 + this.x * scale;
    const screenY = h / 2 + this.y * scale;
    const screenS = this.s * scale;

    ctx.save();
    ctx.translate(screenX, screenY);

    const dynamicRadius = screenS * (0.8 + this.alpha * 1.5);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, dynamicRadius);
    grad.addColorStop(0, `rgba(${this.glowColor}, ${this.alpha * 0.7})`);
    grad.addColorStop(1, `rgba(${this.glowColor}, 0)`);

    ctx.beginPath();
    ctx.arc(0, 0, dynamicRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.rotate(this.ang + Math.PI / 2);
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(img, -screenS / 2, -screenS / 2, screenS, screenS);

    ctx.restore();
  }
}

export default function StarsBackground() {
  const canvasBgRef = useRef<HTMLCanvasElement>(null);
  const canvasFgRef = useRef<HTMLCanvasElement>(null);
  const mouthRef = useRef<SVGCircleElement>(null);

  // React state purely for rendering the correct Real Frog Image frames
  const [eatingState, setEatingState] = useState<{ isEating: boolean; isChewing: boolean }>({ isEating: false, isChewing: false });

  // Expose hunting API to physics engine
  const frogEngine = useRef<FrogEngineState>({
    isEating: false,
    chewingTimer: 0,
    mouthX: 0,
    mouthY: 0,
    dispatchUpdate: () => {
      setEatingState({
        isEating: frogEngine.current.isEating,
        isChewing: frogEngine.current.chewingTimer > 0
      });
    }
  });

  useEffect(() => {
    const canvasBg = canvasBgRef.current;
    const canvasFg = canvasFgRef.current;
    if (!canvasBg || !canvasFg) return;

    const ctxBg = canvasBg.getContext('2d');
    const ctxFg = canvasFg.getContext('2d');
    if (!ctxBg || !ctxFg) return;

    const sprite = new Image();
    sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(FIREFLY_SVG);

    let fireflies: Firefly[] = [];
    let animationFrameId: number;
    let groupTargets: GroupTarget[] = Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 0 }));

    const resize = () => {
      canvasBg.width = window.innerWidth;
      canvasBg.height = window.innerHeight;
      canvasFg.width = window.innerWidth;
      canvasFg.height = window.innerHeight;

      if (fireflies.length === 0) {
        // Create massive ecosystem
        fireflies = Array.from({ length: 200 }, () => new Firefly(canvasBg.width, canvasBg.height));
      }
    };

    let timeoutId: NodeJS.Timeout;

    const randomizeTargets = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      groupTargets = Array.from({ length: 5 }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * 1500 - 100
      }));

      const nextInterval = Math.random() * 10000 + 10000;
      timeoutId = setTimeout(randomizeTargets, nextInterval);
    };

    window.addEventListener('resize', resize);
    resize();
    randomizeTargets();

    const render = () => {
      ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
      ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);

      // Lock global jaw coordinates via React DOM reference
      if (mouthRef.current) {
        const rect = mouthRef.current.getBoundingClientRect();
        frogEngine.current.mouthX = rect.left + rect.width / 2;
        frogEngine.current.mouthY = rect.top + rect.height / 2;
      }

      // Decrease chews organically independent of rendering loops
      if (frogEngine.current.chewingTimer > 0) {
        frogEngine.current.chewingTimer--;
        if (frogEngine.current.chewingTimer === 0 && eatingState.isChewing) {
          frogEngine.current.dispatchUpdate();
        }
      }

      for (const fly of fireflies) {
        fly.update(canvasBg.width, canvasBg.height, groupTargets[fly.groupId], fireflies, frogEngine.current);

        if (sprite.complete) {
          if (fly.z > 400) {
            fly.draw(ctxBg, sprite, canvasBg.width, canvasBg.height);
          } else {
            fly.draw(ctxFg, sprite, canvasFg.width, canvasFg.height);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-[#020617] to-[#01020a] pointer-events-none" />

      {/* BACKGROUND SCENE */}
      <canvas
        ref={canvasBgRef}
        className="fixed inset-0 z-[-1] w-full h-full block pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* FOREGROUND OVERLAY */}
      <canvas
        ref={canvasFgRef}
        className="fixed inset-0 z-[50] w-full h-full block pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* REALISTIC FROG IMAGE RENDERER 
          Requires placing 'frog-open.png' and 'frog-closed.png' transparent images inside /public folder. 
          Fallbacks intelligently to a hand-drawn SVG profile if they don't explicitly exist yet. */}
      <div className="fixed bottom-[2%] right-[2%] z-[60] w-[180px] h-[180px] pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
        <div className={`relative w-full h-full transition-transform duration-300 ${eatingState.isChewing ? 'scale-[1.03] translate-y-1' : 'scale-100 translate-y-0'}`}>

          {/* The absolute ideal way to provide realistic photographic animations in Nextjs is native Image tags */}
          {eatingState.isEating ? (
            <img src="/frog-open.png" alt="Open Frog Mouth" className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] opacity-0" onError={(e) => e.currentTarget.style.display = 'none'} />
          ) : (
            <img src="/frog-closed.png" alt="Closed Frog Mouth" className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] opacity-0" onError={(e) => e.currentTarget.style.display = 'none'} />
          )}

          {/* Hand-drawn SVG Fallback Tree Frog Profile (Visually active if the physical PNG files aren't in /public yet) */}
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="frogSkin" cx="60%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#14532d" />
              </radialGradient>
            </defs>

            {/* Body humped Profile (Facing Left) */}
            <path d="M 180 140 C 160 60, 80 80, 50 100 C 30 115, 20 135, 50 155 C 90 175, 150 180, 180 140 Z" fill="url(#frogSkin)" />
            <circle cx="75" cy="100" r="15" fill="#14532d" />
            <circle cx="73" cy="98" r="10" fill="#eab308" />
            <ellipse cx="73" cy="98" rx="2" ry="8" fill="#020617" transform="rotate(15 73 98)" />
            <circle cx="71" cy="95" r="2" fill="#fff" />

            {/* Front & Back biological leg outlines */}
            <path d="M 60 145 C 50 170, 70 180, 80 185" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
            <path d="M 160 135 C 180 160, 150 180, 130 180" fill="none" stroke="#166534" strokeWidth="12" strokeLinecap="round" />

            {/* Crucial coordinate map that the Canvas Engine tracks identically to screen scaling */}
            <circle cx="30" cy="130" r="2" fill="transparent" ref={mouthRef} />

            {/* Simulated Jaw Hinge matching genuine Amphibian bone structure */}
            <path d="M 30 130 C 45 145, 80 155, 90 140 Z" fill="#14532d" className={`origin-top-left transition-transform duration-75 ${eatingState.isEating ? 'translate-y-4 rotate-12' : 'translate-y-0 rotate-0'}`} />
          </svg>
        </div>
      </div>
    </>
  );
}
