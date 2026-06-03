export type GroupTarget = { x: number; y: number; z: number };

export class Firefly {
  x: number;
  y: number;
  z: number;
  s: number;
  ang: number;
  targetAng: number;
  v: number;
  vx: number = 0;
  vy: number = 0;
  vz: number;
  glowColor: string;
  groupId: number;

  isOn: boolean;
  alpha: number;
  timer: number;
  onDuration: number;
  offDuration: number;

  isBeingEaten: boolean = false;
  combinationCount: number;
  basePrimary: string;
  baseSecondary: string;

  // New properties for helical vertical beam behavior
  helixRadius?: number;
  helixTheta?: number;
  helixAngularSpeed?: number;
  spawnDelay?: number;
  isActive: boolean = false;
  t?: number; // Parametric progression down the beam
  beamId?: number;
  localTimer?: number;
  isDetached?: boolean;
  detachTimer?: number;
  detachCoreT?: number;
  coreDriftX?: number;
  coreDriftY?: number;
  size?: number;
  static lastSpawnTime: number = 0;

  constructor(w: number, h: number, primary: string, secondary: string) {
    this.basePrimary = primary;
    this.baseSecondary = secondary;
    this.s = Math.random() * 40 + 20;
    this.v = Math.random() * 2 + 1;
    this.vz = (Math.random() - 0.5) * 2;
    this.ang = Math.random() * Math.PI * 2;
    this.targetAng = this.ang;

    this.glowColor = Math.random() > 0.5 ? this.basePrimary : this.baseSecondary;
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
    this.combinationCount = 0;
    this.isActive = false;
  }

  spawn(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w * 3;
    this.y = (Math.random() - 0.5) * h * 3;
    this.z = 1500;
    this.isOn = false;
    this.alpha = 0;
    this.timer = 0;
    this.isBeingEaten = false;
    this.combinationCount = 0;
  }

  randomize(w: number, h: number) {
    this.x = (Math.random() - 0.5) * w * 3;
    this.y = (Math.random() - 0.5) * h * 3;
    this.z = Math.random() * 800 + 200;
    this.spawnDelay = undefined;
    this.isActive = false;
    this.t = undefined;
  }

  combineWith(other: Firefly, w: number, h: number) {
    if (this.combinationCount >= 5) {
      this.s = Math.random() * 40 + 20;
      this.glowColor = Math.random() > 0.5 ? this.basePrimary : this.baseSecondary;
      this.combinationCount = 0;
      this.isOn = false;
      this.timer = 0;
      
      other.spawn(w, h);
      return;
    }

    this.combinationCount++;

    const [r1, g1, b1] = this.glowColor.split(',').map(n => parseInt(n.trim()));
    const [r2, g2, b2] = other.glowColor.split(',').map(n => parseInt(n.trim()));
    
    const mixR = Math.round((r1 + r2) / 2);
    const mixG = Math.round((g1 + g2) / 2);
    const mixB = Math.round((b1 + b2) / 2);
    this.glowColor = `${mixR}, ${mixG}, ${mixB}`;

    this.s = Math.min(this.s + other.s * 0.4, 150);
    
    this.alpha = 1;
    this.isOn = true;
    this.timer = 0;
    this.onDuration = 300 + Math.random() * 100;

    other.x = (Math.random() - 0.5) * w * 3;
    other.y = (Math.random() - 0.5) * h * 3;
    other.z = Math.random() * 800 + 200;
    other.isOn = false;
    other.alpha = 0;
    other.timer = 0;
    other.combinationCount = 0;
    other.s = Math.random() * 40 + 20;
    other.offDuration = Math.random() * 600 + 400;
  }

  updateWander(w: number, h: number, swarmTarget: GroupTarget, allFireflies: Firefly[]) {
    if (this.isBeingEaten) return;

    this.timer++;
    if (this.isOn && this.timer > this.onDuration) {
      this.isOn = false;
      this.timer = 0;
      this.offDuration = Math.random() * 500 + 200;
      
      if (this.combinationCount > 0) {
          this.s = Math.random() * 40 + 20;
          this.glowColor = Math.random() > 0.5 ? this.basePrimary : this.baseSecondary;
          this.combinationCount = 0;
      }
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

        const matchX = Math.round(this.x) === Math.round(other.x);
        const matchY = Math.round(this.y) === Math.round(other.y);
        const matchZ = Math.round(this.z) === Math.round(other.z);

        if (matchX && matchY && matchZ) {
            this.combineWith(other, w, h);
        } else if (distSq < 6400) {
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

    const angleToTarget = Math.atan2(swarmTarget.y - this.y, swarmTarget.x - this.x);
    let diffToTarget = angleToTarget - this.targetAng;
    while (diffToTarget > Math.PI) diffToTarget -= Math.PI * 2;
    while (diffToTarget < -Math.PI) diffToTarget += Math.PI * 2;

    this.targetAng += diffToTarget * 0.015;
    this.targetAng += (Math.random() - 0.5) * 0.25;

    const zDiff = swarmTarget.z - this.z;
    this.vz += zDiff * 0.0005;

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
  }

  spawnDiagonal(w: number, h: number, scrollProgress: number, cyclePhase: number) {
      const isB1Erasing = (cyclePhase === 0 || cyclePhase === 2);
      const phaseProgress = (cyclePhase % 2 === 0) ? scrollProgress : (1.0 - scrollProgress);
      
      this.beamId = Math.random() < phaseProgress ? (isB1Erasing ? 2 : 1) : (isB1Erasing ? 1 : 2);
      this.glowColor = this.beamId === 1 ? this.basePrimary : this.baseSecondary;
      
      const isB1 = this.beamId === 1;
      const isErasing = isB1 ? isB1Erasing : !isB1Erasing;
      
      this.t = isErasing ? phaseProgress : 0; 
      
      const minRadius = Math.min(w, h) * 0.10; 
      const maxRadius = Math.min(w, h) * 0.18;
      this.helixRadius = Math.random() * (maxRadius - minRadius) + minRadius;
      this.helixTheta = Math.random() * Math.PI * 2;
      (this as any).helixAngularSpeed = 0.04 + Math.random() * 0.02; 
      (this as any).size = 1.2 + Math.random() * 0.4; 
      
      (this as any).localTimer = 0;
      (this as any).isDetached = false;
      (this as any).detachTimer = 0;
      (this as any).coreDriftX = 0;
      (this as any).coreDriftY = 0;
      this.isActive = true;
  }

  updateDiagonalBeam(w: number, h: number, scrollProgress: number, cyclePhase: number = 0) {
    if (!this.isActive) {
        const now = Date.now();
        // Metered respawn to maintain PERFECT 2-second spacing, zero overlap!
        if (now - Firefly.lastSpawnTime > 2000) {
            Firefly.lastSpawnTime = now;
            this.spawnDiagonal(w, h, scrollProgress, cyclePhase);
        } else {
            return;
        }
    }

    const isBeam1 = (this as any).beamId === 1;
    const isB1Erasing = (cyclePhase === 0 || cyclePhase === 2);
    const isBeam1Forward = (cyclePhase === 0 || cyclePhase === 3);
    const isBeam2Forward = (cyclePhase === 0 || cyclePhase === 1);
    const isErasing = isBeam1 ? isB1Erasing : !isB1Erasing;
    const phaseProgress = (cyclePhase % 2 === 0) ? scrollProgress : (1.0 - scrollProgress);

    const activeLength = isBeam1 ? (1.0 - scrollProgress) : scrollProgress;
    const speed = 0.0016 * Math.max(0.15, activeLength);

    const diagLen = Math.sqrt(w * w + h * h);
    let Vx, Vy, startX, startY;
    
    if (isBeam1) {
        if (isBeam1Forward) {
            startX = -w * 0.5; startY = -h * 0.5;
            Vx = w / diagLen; Vy = h / diagLen;
        } else {
            startX = w * 0.5; startY = h * 0.5;
            Vx = -w / diagLen; Vy = -h / diagLen;
        }
    } else {
        if (isBeam2Forward) {
            startX = w * 0.5; startY = -h * 0.5;
            Vx = -w / diagLen; Vy = h / diagLen;
        } else {
            startX = -w * 0.5; startY = h * 0.5;
            Vx = w / diagLen; Vy = -h / diagLen;
        }
    }

    if (!(this as any).isDetached) {
        if (isErasing) {
            if (this.t! >= 0.99) {
                (this as any).isDetached = true;
                (this as any).detachTimer = 0;
                (this as any).detachCoreT = this.t;
            } else if (this.t! < phaseProgress - 0.01) {
                this.isActive = false;
                return;
            }
        } else {
            if (this.t! >= phaseProgress) {
                (this as any).isDetached = true;
                (this as any).detachTimer = 0;
                (this as any).detachCoreT = this.t;
            }
        }
    }

    if ((this as any).isDetached) {
        (this as any).detachTimer++;
        if (isErasing && phaseProgress >= 0.99) {
            this.isActive = false; return;
        }
        if (!isErasing && (this as any).detachCoreT > phaseProgress + 0.05) {
            this.isActive = false; return;
        }
    } else {
        this.t! += speed;
    }

    this.helixTheta! += (this as any).helixAngularSpeed!;
    (this as any).localTimer! += 1;

    const ageGrowth = Math.min(1, (this as any).localTimer! / 60);
    const currentRadius = this.helixRadius! * ageGrowth; 
    
    this.x = currentRadius * Math.cos(this.helixTheta!);
    this.z = currentRadius * Math.sin(this.helixTheta!);
    
    const currentT = (this as any).isDetached ? (this as any).detachCoreT : this.t!;
    const screenCoreX = startX + currentT * Vx * diagLen;
    const screenCoreY = startY + currentT * Vy * diagLen;
    
    // Calculate orthogonal tilt for 3D projection
    const Ux = -Vy;
    const Uy = Vx;
    const tilt = 0.35; 
    const offsetPerp = currentRadius * Math.cos(this.helixTheta!);
    const offsetParallel = currentRadius * Math.sin(this.helixTheta!) * tilt;

    const targetScreenX = screenCoreX + offsetPerp * Ux + offsetParallel * Vx;
    const targetScreenY = screenCoreY + offsetPerp * Uy + offsetParallel * Vy;

    const focus = 400; 
    const safeZ = Math.max(-150, this.z);
    const scale = focus / (focus + safeZ);

    // Reverse project so draw() handles it correctly
    this.x = targetScreenX / scale;
    this.y = targetScreenY / scale;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, effectStyle: string = 'fireflies', themeMode: string = 'dark') {
    if (this.isBeingEaten) return;

    if (effectStyle !== 'beam') {
      // --- ORIGINAL FIREFLIES RENDERING ---
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

      ctx.restore();
      return;
    }

    // --- BEAM 3D PHYSICAL SHADING RENDERING ---
    if (!this.isActive) return;

    let alpha = 1.0;
    if ((this as any).isDetached) {
        // Quick 15-frame fade out when they reach the end so they cleanly vanish
        alpha = Math.max(0, 1.0 - (this as any).detachTimer / 15);
        if (alpha === 0) {
            this.isActive = false;
            return;
        }
    } else {
        const isFront = Math.sin(this.helixTheta!) < 0;
        const brightnessBoost = isFront ? 1.2 : 0.8; // Stronger contrast based on front/back
        alpha = alpha * brightnessBoost;
        if (alpha > 1) alpha = 1;
    }

    const focus = 400;
    const safeZ = Math.max(-150, this.z);
    const scale = focus / (focus + safeZ);

    const screenX = this.x * scale + w / 2;
    const screenY = this.y * scale + h / 2;
    const size = Math.max(0.1, this.size! * (1 + this.z / 100));
    const screenS = size * scale;

    if (screenX < -50 || screenX > w + 50 || screenY < -50 || screenY > h + 50) return;

    ctx.save();
    ctx.translate(screenX, screenY);

    // 1. The Physical Core (gives the particle "mass" and 3D volume)
    const coreRadius = screenS * 2.0;
    
    // Offset the highlight to simulate a light source coming from top-left
    const highlightX = -coreRadius * 0.3;
    const highlightY = -coreRadius * 0.3;
    
    const isLight = themeMode === 'light';
    const highlightStop = isLight ? 0.12 : 0.4;

    const coreGrad = ctx.createRadialGradient(
      highlightX, highlightY, 0, 
      0, 0, coreRadius
    );
    // Hot white specular highlight
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`); 
    // Solid physical body color
    coreGrad.addColorStop(highlightStop, `rgba(${this.glowColor}, ${alpha * 0.95})`); 
    // Darker, richer edge to create 3D spherical shading (ambient occlusion)
    coreGrad.addColorStop(0.85, `rgba(${this.glowColor}, ${alpha * 0.45})`); 
    // Crisp physical boundary
    coreGrad.addColorStop(1, `rgba(${this.glowColor}, 0)`); 

    // 2. The Outer Bloom (emissive light bleed)
    const glowRadius = coreRadius * 3.5;
    const bloomGrad = ctx.createRadialGradient(0, 0, coreRadius, 0, 0, glowRadius);
    bloomGrad.addColorStop(0, `rgba(${this.glowColor}, ${alpha * 0.6})`);
    bloomGrad.addColorStop(1, `rgba(${this.glowColor}, 0)`);

    // Draw Bloom Layer
    ctx.shadowColor = `rgba(${this.glowColor}, ${alpha})`;
    ctx.shadowBlur = 15 + Math.abs(this.z / 4);
    ctx.fillStyle = bloomGrad;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Physical Core Layer
    ctx.shadowBlur = 0; // Turn off shadow so the physical core remains sharp and solid
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

