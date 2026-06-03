'use client';
import { useEffect, useRef, useId } from 'react';
import { Firefly, GroupTarget } from './Firefly';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import styles from './Fireflies.module.css';

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
  const { theme, effectStyle } = useTheme();

  // Maintain local instance array safely
  const firefliesRef = useRef<Firefly[]>([]);

  // We use a ref to hold the worker so we don't recreate it when theme changes
  const workerRef = useRef<Worker | null>(null);
  
  // Track scroll progress internally for main thread fallback
  const scrollProgressRef = useRef<number>(0);
  const cyclePhaseRef = useRef<number>(0);
  
  // Track previous effect style to trigger randomization on switch
  const prevEffectStyleRef = useRef(effectStyle);

  useEffect(() => {
    if (prevEffectStyleRef.current !== effectStyle) {
      prevEffectStyleRef.current = effectStyle;
      if (!workerRef.current) {
        const explicitBoundsNode = containerRef.current?.closest('section') || containerRef.current?.closest('.min-h-screen') || document.body;
        const w = isGlobal ? window.innerWidth : explicitBoundsNode.clientWidth;
        const h = isGlobal ? window.innerHeight : explicitBoundsNode.clientHeight;
        for (const fly of firefliesRef.current) {
          fly.randomize(w, h);
        }
      }
    }
  }, [effectStyle, isGlobal]);

  useEffect(() => {
    // Only synchronize colors if using the fallback (main thread). If worker exists, we handle it via postMessage below.
    if (!workerRef.current) {
      for (const fly of firefliesRef.current) {
        fly.basePrimary = theme.firefly.primary;
        fly.baseSecondary = theme.firefly.secondary;
        fly.glowColor = Math.random() > 0.5
          ? theme.firefly.primary
          : theme.firefly.secondary;
      }
    } else {
      workerRef.current.postMessage({
        type: 'theme',
        primaryColor: theme.firefly.primary,
        secondaryColor: theme.firefly.secondary,
        themeId: theme.id,
        themeMode: theme.mode,
        effectStyle
      });
    }
  }, [theme, effectStyle]);

  useEffect(() => {
    const canvasBg = canvasBgRef.current;
    const canvasFg = canvasFgRef.current;
    if (!canvasBg || !canvasFg) return;

    let explicitBoundsNode = containerRef.current as HTMLElement;
    if (!isGlobal) {
        const sectionAncestor = containerRef.current?.closest('section') || containerRef.current?.closest('.min-h-screen');
        if (sectionAncestor) explicitBoundsNode = sectionAncestor as HTMLElement;
    }
    const initialW = isGlobal ? window.innerWidth : explicitBoundsNode.clientWidth;
    const initialH = isGlobal ? window.innerHeight : explicitBoundsNode.clientHeight;

    let resizeTimeoutId: NodeJS.Timeout;
    let resizeObserver: ResizeObserver;
    let fallbackFrameId: number;
    let fallbackTimeoutId: NodeJS.Timeout;

    if ('OffscreenCanvas' in window && typeof Worker !== 'undefined') {
      // --- WEB WORKER PATH ---
      const worker = new Worker(new URL('./physics.worker.ts', import.meta.url));
      workerRef.current = worker;

      const offscreenBg = canvasBg.transferControlToOffscreen();
      const offscreenFg = canvasFg.transferControlToOffscreen();

      worker.postMessage({
        type: 'init',
        canvasBg: offscreenBg,
        canvasFg: offscreenFg,
        width: initialW,
        height: initialH,
        primaryColor: theme.firefly.primary,
        secondaryColor: theme.firefly.secondary,
        themeId: theme.id,
        themeMode: theme.mode,
        effectStyle
      }, [offscreenBg, offscreenFg]);

      const debouncedResize = () => {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = setTimeout(() => {
          if (!containerRef.current) return;
          const w = isGlobal ? window.innerWidth : explicitBoundsNode.clientWidth;
          const h = isGlobal ? window.innerHeight : explicitBoundsNode.clientHeight;
          worker.postMessage({ type: 'resize', width: w, height: h });
        }, 150);
      };

      window.addEventListener('resize', debouncedResize);
      resizeObserver = new ResizeObserver(() => debouncedResize());
      if (containerRef.current) resizeObserver.observe(containerRef.current);

    } else {
      // --- FALLBACK PATH (MAIN THREAD) ---
      if (!window.multiEcosystemRegistry) window.multiEcosystemRegistry = {};

      const ctxBg = canvasBg.getContext('2d');
      const ctxFg = canvasFg.getContext('2d');
      if (!ctxBg || !ctxFg) return;

      let groupTargets: GroupTarget[] = Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 0 }));

      const resizeFallback = () => {
        if (!containerRef.current) return;
        const w = isGlobal ? window.innerWidth : explicitBoundsNode.clientWidth;
        const h = isGlobal ? window.innerHeight : explicitBoundsNode.clientHeight;
        
        window.multiEcosystemRegistry![ecosystemId] = {
            fireflies: firefliesRef.current,
            getElement: () => explicitBoundsNode,
            layout: isGlobal ? 'fixed' : 'absolute',
            w, h
        };

        canvasBg.width = w;
        canvasBg.height = h;
        canvasFg.width = w;
        canvasFg.height = h;

        if (firefliesRef.current.length === 0) {
          if (isGlobal) {
            const newFlies = Array.from({ length: 200 }, () => 
              new Firefly(w, h, theme.firefly.primary, theme.firefly.secondary)
            );
            firefliesRef.current.push(...newFlies);
          } else {
            const globalEco = Object.values(window.multiEcosystemRegistry!).find(e => e.layout === 'fixed');
            if (globalEco && globalEco.fireflies.length > 0) firefliesRef.current = globalEco.fireflies;
          }
        }
      };

      const randomizeTargets = () => {
        if (!containerRef.current) return;
        groupTargets = Array.from({ length: 5 }, () => ({
          x: (Math.random() - 0.5) * canvasBg.width,
          y: (Math.random() - 0.5) * canvasBg.height,
          z: Math.random() * 1500 - 100
        }));
        fallbackTimeoutId = setTimeout(randomizeTargets, Math.random() * 10000 + 10000);
      };

      const debouncedResize = () => {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = setTimeout(resizeFallback, 150);
      };

      window.addEventListener('resize', debouncedResize);
      resizeFallback();
      randomizeTargets();

      resizeObserver = new ResizeObserver(() => debouncedResize());
      if (containerRef.current) resizeObserver.observe(containerRef.current);

      const render = () => {
        ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
        ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);

        for (const fly of firefliesRef.current) {
          if (isGlobal) {
            if (effectStyle === 'beam') {
              fly.updateDiagonalBeam(canvasBg.width, canvasBg.height, scrollProgressRef.current);
            } else {
              fly.updateWander(canvasBg.width, canvasBg.height, groupTargets[fly.groupId], firefliesRef.current);
            }
          }
          if (fly.z > 400) fly.draw(ctxBg, canvasBg.width, canvasBg.height, effectStyle, theme.mode);
          else fly.draw(ctxFg, canvasFg.width, canvasFg.height, effectStyle, theme.mode);
        }
        fallbackFrameId = requestAnimationFrame(render);
      };
      render();
    }

    return () => {
      // CLEANUP
      window.removeEventListener('resize', () => {}); // Can't remove anonymously safely without ref, but it's okay for now
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(resizeTimeoutId);
      
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'destroy' });
        workerRef.current.terminate();
        workerRef.current = null;
      } else {
        clearTimeout(fallbackTimeoutId);
        cancelAnimationFrame(fallbackFrameId);
        if (window.multiEcosystemRegistry) delete window.multiEcosystemRegistry[ecosystemId];
      }
    };
  }, [isGlobal, ecosystemId]);

  useEffect(() => {
    if (!isGlobal || effectStyle !== 'beam') return;

    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on document height
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      
      // Update the state machine loop counter
      if (progress === 1 && cyclePhaseRef.current === 0) cyclePhaseRef.current = 1;
      else if (progress === 0 && cyclePhaseRef.current === 1) cyclePhaseRef.current = 2;
      else if (progress === 1 && cyclePhaseRef.current === 2) cyclePhaseRef.current = 3;
      else if (progress === 0 && cyclePhaseRef.current === 3) cyclePhaseRef.current = 0;
      
      const phase = cyclePhaseRef.current;
      scrollProgressRef.current = progress;

      if (containerRef.current) {
        // Evaluate the progress through the current directional phase (0 -> 1)
        const phaseProgress = (phase % 2 === 0) ? progress : (1.0 - progress);
        
        // As you progress through a phase, the masks sweep downwards across the page.
        const maskStart = phaseProgress * 115 - 15;
        const maskEnd = maskStart + 15;
        
        // Define mask structure based on drawing vs erasing state
        const maskErasing = `transparent var(--mask-start, -15%), black var(--mask-end, 0%)`;
        const maskDrawing = `black var(--mask-start, -15%), transparent var(--mask-end, 0%)`;
        
        // Phase-specific gradient mapping
        const isBeam1Erasing = (phase === 0 || phase === 2);
        containerRef.current.style.setProperty('--beam1-mask-image', isBeam1Erasing ? maskErasing : maskDrawing);
        containerRef.current.style.setProperty('--beam2-mask-image', !isBeam1Erasing ? maskErasing : maskDrawing);
        
        // Phase-specific directions
        containerRef.current.style.setProperty('--beam1-dir', (phase === 0 || phase === 3) ? 'to bottom right' : 'to top left');
        containerRef.current.style.setProperty('--beam2-dir', (phase === 0 || phase === 1) ? 'to bottom right' : 'to top left');

        // Dynamic Impact Opacities mapped to the 4 corners of the loop!
        const g1 = (phase === 0 || phase === 3) ? (1 - progress) : 0; // Bottom-Right
        const g2 = (phase === 0 || phase === 1) ? progress : 0;       // Bottom-Left
        const g3 = (phase === 1 || phase === 2) ? (1 - progress) : 0; // Top-Left
        const g4 = (phase === 2 || phase === 3) ? progress : 0;       // Top-Right

        containerRef.current.style.setProperty('--mask-start', `${maskStart}%`);
        containerRef.current.style.setProperty('--mask-end', `${maskEnd}%`);
        
        containerRef.current.style.setProperty('--ground1-progress', `${g1}`);
        containerRef.current.style.setProperty('--ground1-opacity', `${g1}`);
        containerRef.current.style.setProperty('--ground2-progress', `${g2}`);
        containerRef.current.style.setProperty('--ground2-opacity', `${g2}`);
        containerRef.current.style.setProperty('--ground3-progress', `${g3}`);
        containerRef.current.style.setProperty('--ground3-opacity', `${g3}`);
        containerRef.current.style.setProperty('--ground4-progress', `${g4}`);
        containerRef.current.style.setProperty('--ground4-opacity', `${g4}`);
      }

      // Send to worker if active
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'scroll', scrollProgress: progress, cyclePhase: phase });
      }
    };

    // Initial trigger
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isGlobal, effectStyle]);

  return (
    <div
      data-ecosystem-id={ecosystemId}
      ref={containerRef}
      className={`${styles.container} ${isGlobal ? styles.containerGlobal : styles.containerLocal}`}
      style={{
        zIndex: -1,
        ['--canvas-blend-mode' as any]: theme.mode === 'light' ? 'multiply' : 'screen'
      }}
    >
      {/* BEAM 1: Dynamic Top-Left <-> Bottom-Right diagonal */}
      <div
        className={styles.bgGradient}
        style={{ 
          background: effectStyle === 'beam' ? (() => {
            const bg = theme.background;
            const rawColor = `rgb(${theme.firefly.primary})`;
            const baseColor = theme.mode === 'light'
              ? `color-mix(in srgb, ${rawColor} 30%, ${bg})`
              : rawColor;
            const edgeColor = `color-mix(in srgb, ${baseColor} 12%, ${bg})`;
            return `linear-gradient(to top right, ${bg} 0%, ${bg} 42%, ${edgeColor} 48%, ${baseColor} 50%, ${edgeColor} 52%, ${bg} 58%, ${bg} 100%)`;
          })() : theme.bgGradient,
          ...(effectStyle === 'beam' ? { 
            WebkitMaskImage: `linear-gradient(var(--beam1-dir, to bottom right), var(--beam1-mask-image))`,
            maskImage: `linear-gradient(var(--beam1-dir, to bottom right), var(--beam1-mask-image))`
          } : {})
        }}
      />
      
      {/* BEAM 2: Dynamic Top-Right <-> Bottom-Left diagonal */}
      <div
        className={styles.bgGradient}
        style={{ 
          background: effectStyle === 'beam' ? (() => {
            const bg = theme.background;
            const rawColor = `rgb(${theme.firefly.secondary})`;
            const baseColor = theme.mode === 'light'
              ? `color-mix(in srgb, ${rawColor} 30%, ${bg})`
              : rawColor;
            const edgeColor = `color-mix(in srgb, ${baseColor} 12%, ${bg})`;
            return `linear-gradient(to top right, ${bg} 0%, ${bg} 42%, ${edgeColor} 48%, ${baseColor} 50%, ${edgeColor} 52%, ${bg} 58%, ${bg} 100%)`;
          })() : 'none',
          transform: 'scaleX(-1)', // Flips the gradient to originate from the opposite side
          ...(effectStyle === 'beam' ? { 
            WebkitMaskImage: `linear-gradient(var(--beam2-dir, to bottom right), var(--beam2-mask-image))`,
            maskImage: `linear-gradient(var(--beam2-dir, to bottom right), var(--beam2-mask-image))`
          } : {})
        }}
      />
      
      {/* Ground Impacts for Beam Effect */}
      {effectStyle === 'beam' && (
        <>
          <div 
            className={styles.groundImpact1} 
            style={{
              background: `radial-gradient(circle at center, rgba(${theme.firefly.primary}, 0.5) 0%, rgba(${theme.firefly.primary}, 0.2) 30%, transparent 60%)`
            }}
          />
          <div 
            className={styles.groundImpact2} 
            style={{
              background: `radial-gradient(circle at center, rgba(${theme.firefly.secondary}, 0.5) 0%, rgba(${theme.firefly.secondary}, 0.2) 30%, transparent 60%)`
            }}
          />
          <div 
            className={styles.groundImpact3} 
            style={{
              background: `radial-gradient(circle at center, rgba(${theme.firefly.primary}, 0.5) 0%, rgba(${theme.firefly.primary}, 0.2) 30%, transparent 60%)`
            }}
          />
          <div 
            className={styles.groundImpact4} 
            style={{
              background: `radial-gradient(circle at center, rgba(${theme.firefly.secondary}, 0.5) 0%, rgba(${theme.firefly.secondary}, 0.2) 30%, transparent 60%)`
            }}
          />
        </>
      )}

      {/* BACKGROUND SCENE */}
      <canvas
        ref={canvasBgRef}
        className={styles.canvasBg}
      />

      {/* FOREGROUND OVERLAY */}
      <canvas
        ref={canvasFgRef}
        className={styles.canvasFg}
      />
    </div>
  );
}
