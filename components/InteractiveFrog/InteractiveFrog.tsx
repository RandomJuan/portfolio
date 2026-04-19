'use client';
import { useEffect, useRef, useState } from 'react';
import { Firefly } from '../Fireflies/Firefly';

export default function InteractiveFrog({ isGlobal = false }: { isGlobal?: boolean }) {
  const frogContainerRef = useRef<HTMLDivElement>(null);
  const ecosystemIdRef = useRef<string | null>(null);
  const mouthRef = useRef<SVGCircleElement>(null);
  
  // Decoupled physics tracking timers isolated from React renders
  const isEating = useRef(false);
  const chewTimer = useRef(0);
  
  // Only strictly triggers React updates when CSS transform boolean states change
  const [visualState, setVisualState] = useState({ isEating: false, isChewing: false });

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
      <div 
         className={`${isGlobal ? 'fixed' : 'absolute'} w-full z-[0] pointer-events-none`}
         style={{ 
             left: 0,
             bottom: 'calc(2% + 36px)', 
             height: '40px',
             backgroundImage: "url('/branch.png')",
             backgroundRepeat: "repeat-x",
             backgroundSize: "auto 40px", 
             backgroundPosition: "right bottom",
             mixBlendMode: 'screen', 
         }}
      />

      {/* REALISTIC FROG IMAGE RENDERER */}
      <div ref={frogContainerRef} className={`${isGlobal ? 'fixed' : 'absolute'} bottom-[2%] right-[2%] z-[50] w-[180px] h-[180px] pointer-events-none`}>
        <div className={`relative w-full h-full transition-transform duration-300 ${visualState.isChewing ? 'scale-[1.03] translate-y-1' : 'scale-100 translate-y-0'}`}>
          <img 
            src="/frog-closed.png" 
            alt="Closed Frog Mouth" 
            className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-opacity duration-75 ${visualState.isEating ? 'opacity-0' : 'opacity-100'}`} 
            style={{ mixBlendMode: 'screen' }}
            onError={(e) => e.currentTarget.style.display = 'none'} 
          />
          <img 
            src="/frog-open.png" 
            alt="Open Frog Mouth" 
            className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-opacity duration-75 ${visualState.isEating ? 'opacity-100' : 'opacity-0'}`} 
            style={{ mixBlendMode: 'screen' }}
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
