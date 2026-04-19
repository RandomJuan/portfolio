'use client';
import { useEffect, useRef, useId } from 'react';
import { Firefly, GroupTarget } from './Firefly';

declare global {
  interface Window {
    multiEcosystemRegistry?: Record<string, {
      fireflies: Firefly[];
      getElement: () => HTMLElement | null;
      layout: 'fixed' | 'absolute';
      w: number;
      h: number;
    }>;
  }
}

export default function Fireflies({ isGlobal = false }: { isGlobal?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBgRef = useRef<HTMLCanvasElement>(null);
  const canvasFgRef = useRef<HTMLCanvasElement>(null);
  
  const ecosystemId = useId();

  // Maintain local instance array safely
  const firefliesRef = useRef<Firefly[]>([]);

  useEffect(() => {
    // Register global registry map securely for multi-instance support elegantly
    if (!window.multiEcosystemRegistry) {
       window.multiEcosystemRegistry = {};
    }

    const canvasBg = canvasBgRef.current;
    const canvasFg = canvasFgRef.current;
    if (!canvasBg || !canvasFg) return;

    const ctxBg = canvasBg.getContext('2d');
    const ctxFg = canvasFg.getContext('2d');
    if (!ctxBg || !ctxFg) return;

    const sprite = new Image();
    sprite.src = '/firefly.svg';

    let animationFrameId: number;
    let groupTargets: GroupTarget[] = Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 0 }));

    const resize = () => {
      if (!containerRef.current) return;

      const currentLayout = isGlobal ? 'fixed' : 'absolute';

      let explicitBoundsNode = containerRef.current as HTMLElement;
      if (currentLayout === 'absolute') {
         const sectionAncestor = containerRef.current.closest('section') || containerRef.current.closest('.min-h-screen');
         if (sectionAncestor) explicitBoundsNode = sectionAncestor as HTMLElement;
      }

      const clientWidth = currentLayout === 'fixed' ? window.innerWidth : explicitBoundsNode.clientWidth;
      const clientHeight = currentLayout === 'fixed' ? window.innerHeight : explicitBoundsNode.clientHeight;
      
      // Update specific local ecosystem uniquely natively indexed into global map cleanly
      window.multiEcosystemRegistry![ecosystemId] = {
          fireflies: firefliesRef.current,
          getElement: () => explicitBoundsNode,
          layout: currentLayout,
          w: clientWidth,
          h: clientHeight
      };

      const canvasBg = canvasBgRef.current;
      const canvasFg = canvasFgRef.current;
      if (!canvasBg || !canvasFg) return;

      canvasBg.width = clientWidth;
      canvasBg.height = clientHeight;
      canvasFg.width = clientWidth;
      canvasFg.height = clientHeight;

      // Populate ecosystem lazily only if not already spawned
      if (firefliesRef.current.length === 0) {
        const ecosystemSize = 200;
        const newFlies = Array.from({ length: ecosystemSize }, () => new Firefly(canvasBg.width, canvasBg.height));
        firefliesRef.current.push(...newFlies);
      }
    };

    let timeoutId: NodeJS.Timeout;

    const randomizeTargets = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
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

    // Use ResizeObserver to explicitly track local structural parent dimension reflows natively decoupled from literal window sizes.
    const resizeObserver = new ResizeObserver(() => resize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const render = () => {
      const canvasBg = canvasBgRef.current;
      const canvasFg = canvasFgRef.current;
      if (!canvasBg || !canvasFg) return;
      
      ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
      ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);

      for (const fly of firefliesRef.current) {
        // Core wandering algorithm completely agnostic of any predators 
        fly.updateWander(canvasBg.width, canvasBg.height, groupTargets[fly.groupId], firefliesRef.current);

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
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      
      if (window.multiEcosystemRegistry) {
         const currentId = ecosystemId;
         delete window.multiEcosystemRegistry[currentId];
      }
    };
  }, [isGlobal, ecosystemId]);

  return (
    <div data-ecosystem-id={ecosystemId} ref={containerRef} className={`${isGlobal ? 'fixed' : 'absolute'} inset-0 w-full h-full pointer-events-none z-[0] overflow-hidden`}>
      <div className="absolute inset-0 z-0 bg-[#020617] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-[#020617] to-[#01020a] pointer-events-none" />

      {/* BACKGROUND SCENE */}
      <canvas
        ref={canvasBgRef}
        className="absolute inset-0 z-[1] w-full h-full block pointer-events-none"
        style={{
          mixBlendMode: 'screen',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
        }}
      />

      {/* FOREGROUND OVERLAY */}
      <canvas
        ref={canvasFgRef}
        className="absolute inset-0 z-[50] w-full h-full block pointer-events-none"
        style={{ 
          mixBlendMode: 'screen',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
        }}
      />
    </div>
  );
}
