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
  const { theme } = useTheme();

  // Maintain local instance array safely
  const firefliesRef = useRef<Firefly[]>([]);

  // We use a ref to hold the worker so we don't recreate it when theme changes
  const workerRef = useRef<Worker | null>(null);

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
        secondaryColor: theme.firefly.secondary
      });
    }
  }, [theme]);

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
      const worker = new Worker(new URL('./fireflies.worker.ts', import.meta.url));
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
        secondaryColor: theme.firefly.secondary
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
          if (isGlobal) fly.updateWander(canvasBg.width, canvasBg.height, groupTargets[fly.groupId], firefliesRef.current);
          if (fly.z > 400) fly.draw(ctxBg, canvasBg.width, canvasBg.height);
          else fly.draw(ctxFg, canvasFg.width, canvasFg.height);
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


  return (
    <div
      data-ecosystem-id={ecosystemId}
      ref={containerRef}
      className={`${styles.container} ${isGlobal ? styles.containerGlobal : styles.containerLocal}`}
    >
      {/* Dynamic background driven by active theme */}
      <div
        className={styles.bgGradient}
        style={{ background: theme.bgGradient }}
      />

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
