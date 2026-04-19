'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Firefly } from '../Fireflies/Firefly';

export default function InteractiveFrog({ isGlobal = false }: { isGlobal?: boolean }) {
  const frogContainerRef = useRef<HTMLDivElement>(null);
  const branchCanvasRef = useRef<HTMLCanvasElement>(null);
  const ecosystemIdRef = useRef<string | null>(null);
  const mouthRef = useRef<SVGCircleElement>(null);
  
  // Decoupled physics tracking timers isolated from React renders
  const isEating = useRef(false);
  const chewTimer = useRef(0);
  
  // Only strictly triggers React updates when CSS transform boolean states change
  const [visualState, setVisualState] = useState({ isEating: false, isChewing: false });

  // Draw the natural branch texture (sampled from the frog image itself) across the full screen width
  const drawBranch = useCallback(() => {
    const canvas = branchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cssW = window.innerWidth;
    const cssH = canvas.offsetHeight || 50;
    canvas.width = cssW;
    canvas.height = cssH;

    const img = new Image();
    img.src = '/frog-closed-trans.png';
    img.onload = () => {
      // Source slice: left portion of the image at branch height.
      // The 640×640 image has the branch in the lower section (~y 360-480).
      // We take x: 0-220 (pure bark, frog body is further right) as the repeating tile.
      const srcX = 0;
      const srcY = 360;
      const srcW = 220;
      const srcH = 120;

      // Draw the slice into a small offscreen tile, scaled to canvas height
      const tile = document.createElement('canvas');
      tile.width = srcW;
      tile.height = cssH;
      const tCtx = tile.getContext('2d')!;
      tCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, cssH);

      // Tile the branch strip across the full width
      const pattern = ctx.createPattern(tile, 'repeat-x');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, cssW, cssH);
      }
    };
  }, []);

  useEffect(() => {
    drawBranch();
    window.addEventListener('resize', drawBranch);
    return () => window.removeEventListener('resize', drawBranch);
  }, [drawBranch]);

  useEffect(() => {
    let raf: number;

    const huntLoop = () => {
      // Magically map to peer structurally identically
      if (frogContainerRef.current) {
         
         // If we haven't bound to an explicit Ecosystem sibling yet, trace structurally upwards uniquely
         if (!ecosystemIdRef.current) {
            let current = frogContainerRef.current as HTMLElement | null;
            let foundId: string | null = null;
            while (current && !foundId && current.tagName !== 'HTML') {
               const p = current.parentElement;
               if (!p) break;
               // Search entirely only immediate peer children natively correlating structurally identical layers
               for (let i = 0; i < p.children.length; i++) {
                   const child = p.children[i];
                   if (child.hasAttribute('data-ecosystem-id')) {
                       foundId = child.getAttribute('data-ecosystem-id');
                       break;
                   }
               }
               current = p;
            }
            ecosystemIdRef.current = foundId;
         }
      }

      // 1. Progress organic chewing visually mapped on local ref
      if (chewTimer.current > 0) {
         chewTimer.current--;
         if (chewTimer.current === 0) {
            setVisualState(prev => ({ ...prev, isChewing: false }));
         }
      }

      // 2. Extrapolate physics constraints natively structurally linked purely dynamically natively natively securely natively smartly properly uniquely flawlessly seamlessly
      if (!ecosystemIdRef.current) return;
      const ecoRegistry = window.multiEcosystemRegistry;
      if (!ecoRegistry) return;
      const ecosystemInfo = ecoRegistry[ecosystemIdRef.current];
      if (!ecosystemInfo) return;
      
      const ecosystem = ecosystemInfo.fireflies as Firefly[] | undefined;
      
      if (mouthRef.current && ecosystem && ecosystem.length > 0) {
        const frogRect = mouthRef.current.getBoundingClientRect();
        const containerNode = ecosystemInfo.getElement();
        
        if (!containerNode) return;
        const containerRect = containerNode.getBoundingClientRect();

        // Dynamically compute exact DOM alignment relative specifically to the canvas coordinate origin
        const mouthX = frogRect.left + frogRect.width / 2 - containerRect.left;
        const mouthY = frogRect.top + frogRect.height / 2 - containerRect.top;
        const w = ecosystemInfo.w;
        const h = ecosystemInfo.h;

        for (let i = 0; i < ecosystem.length; i++) {
          const fly = ecosystem[i];

          // A. Process Swallowing Math (Accelerating towards the core of the jaw node linearly)
          if (fly.isBeingEaten) {
            const focus = 400;
            const safeZ = Math.max(-150, fly.z);
            const scale = focus / (focus + safeZ);
      
            // Convert exact physical node positions into arbitrary logical canvas coordinates
            const targetLogicalX = (mouthX - w / 2) / scale;
            const targetLogicalY = (mouthY - h / 2) / scale;
      
            fly.x += (targetLogicalX - fly.x) * 0.15; 
            fly.y += (targetLogicalY - fly.y) * 0.15;
            fly.z += (0 - fly.z) * 0.15; 
      
            fly.ang = Math.atan2(targetLogicalY - fly.y, targetLogicalX - fly.x);
      
            const distSq = Math.pow(targetLogicalX - fly.x, 2) + Math.pow(targetLogicalY - fly.y, 2);
            if (distSq < 150) { 
              fly.spawn(w, h);
              isEating.current = false;
              chewTimer.current = 90;
              setVisualState({ isEating: false, isChewing: true });
            }
          } 
          // B. Process Hunting Math (Check if wandering fireflies casually stumble near the mouth collision box)
          else if (fly.z <= 400 && fly.alpha > 0.5 && !isEating.current && chewTimer.current <= 0) {
            const focus = 400;
            const safeZ = Math.max(-150, fly.z);
            const scale = focus / (focus + safeZ);
            const screenX = w / 2 + fly.x * scale;
            const screenY = h / 2 + fly.y * scale;
      
            const dx = screenX - mouthX;
            const dy = screenY - mouthY;
      
            // Expansive 350px visual radius kill-zone triggers predator reflex
            if (dx * dx + dy * dy < 122500) { 
              fly.isBeingEaten = true;
              isEating.current = true;
              setVisualState(prev => ({ ...prev, isEating: true }));
            }
          }
        }
      }

      raf = requestAnimationFrame(huntLoop);
    };

    raf = requestAnimationFrame(huntLoop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* EXTENDED BACKGROUND BRANCH (Unified Physical Node)
          Encapsulating the organic physical geometry of the entity explicitly into its own layout tier */}
      {/* Branch canvas: tiles the real bark texture from the frog image across the full screen width */}
      {/* <canvas
        ref={branchCanvasRef}
        height={50}
        className={`${isGlobal ? 'fixed' : 'absolute'} pointer-events-none`}
        style={{
          left: 0,
          bottom: 'calc(2% + 36px)',
          width: '100%',
          zIndex: 0,
        }}
      /> */}

      {/* REALISTIC FROG IMAGE RENDERER */}
      <div ref={frogContainerRef} className={`${isGlobal ? 'fixed' : 'absolute'} bottom-[2%] right-[2%] z-[50] w-[180px] h-[180px] pointer-events-none`}>
        <div className={`relative w-full h-full transition-transform duration-300`}>
          <img 
            src="/frog-closed-trans.png" 
            alt="Closed Frog Mouth" 
            className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-opacity duration-75 ${visualState.isEating ? 'opacity-0' : 'opacity-100'}`} 
            onError={(e) => e.currentTarget.style.display = 'none'} 
          />
          <img 
            src="/frog-open-trans.png" 
            alt="Open Frog Mouth" 
            className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-opacity duration-75 ${visualState.isEating ? 'opacity-100' : 'opacity-0'}`} 
            onError={(e) => e.currentTarget.style.display = 'none'} 
          />
          
          {/* Tracking node rigidly bound to jaw transforms implicitly captured over getBoundingClientRect by component engine locally */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
             <circle cx="30" cy="130" r="2" fill="transparent" ref={mouthRef} />
          </svg>
        </div>
      </div>
    </>
  );
}
