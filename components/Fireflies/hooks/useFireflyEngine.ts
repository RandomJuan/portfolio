import { useEffect, useRef, MutableRefObject } from 'react';
import { Firefly, GroupTarget } from '../Firefly';
import { EffectStyle } from '@/types/theme';
import { ResolvedThemeConfig } from '@/components/ThemeProvider/ThemeContext';

declare global {
  interface Window {
    multiEcosystemRegistry?: Record<string, {
      fireflies: Firefly[];
      getElement: () => HTMLElement;
      layout: 'fixed' | 'absolute';
      w: number;
      h: number;
    }>;
  }
}

interface UseFireflyEngineProps {
  containerRef: React.RefObject<HTMLElement | null>;
  canvasBgRef: React.RefObject<HTMLCanvasElement | null>;
  canvasFgRef: React.RefObject<HTMLCanvasElement | null>;
  firefliesRef: MutableRefObject<Firefly[]>;
  workerRef: MutableRefObject<Worker | null>;
  scrollProgressRef: MutableRefObject<number>;
  cyclePhaseRef: MutableRefObject<number>;
  ecosystemId: string;
  theme: ResolvedThemeConfig;
  effectStyle: EffectStyle;
  isGlobal: boolean;
}

export function useFireflyEngine({
  containerRef,
  canvasBgRef,
  canvasFgRef,
  firefliesRef,
  workerRef,
  scrollProgressRef,
  cyclePhaseRef,
  ecosystemId,
  theme,
  effectStyle,
  isGlobal
}: UseFireflyEngineProps) {
  
  const prevEffectStyleRef = useRef(effectStyle);
  const latestThemeRef = useRef(theme);
  const latestEffectStyleRef = useRef(effectStyle);

  useEffect(() => {
    latestThemeRef.current = theme;
    latestEffectStyleRef.current = effectStyle;
  }, [theme, effectStyle]);

  // 1. Randomize fireflies on effect style switch (Main Thread Fallback only)
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
  }, [effectStyle, isGlobal, containerRef, firefliesRef, workerRef]);

  // 2. Synchronize themes
  useEffect(() => {
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
  }, [theme, effectStyle, firefliesRef, workerRef]);

  // 3. Core Engine Lifecycle (Worker vs Main Thread initialization)
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
      const worker = new Worker(new URL('../physics.worker.ts', import.meta.url));
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
            if (latestEffectStyleRef.current === EffectStyle.BEAM) {
              fly.updateDiagonalBeam(canvasBg.width, canvasBg.height, scrollProgressRef.current, cyclePhaseRef.current);
            } else {
              fly.updateWander(canvasBg.width, canvasBg.height, groupTargets[fly.groupId], firefliesRef.current);
            }
          }
          if (fly.z > 400) fly.draw(ctxBg, canvasBg.width, canvasBg.height, latestEffectStyleRef.current, latestThemeRef.current.mode);
          else fly.draw(ctxFg, canvasFg.width, canvasFg.height, latestEffectStyleRef.current, latestThemeRef.current.mode);
        }
        fallbackFrameId = requestAnimationFrame(render);
      };
      render();
    }

    return () => {
      // CLEANUP
      window.removeEventListener('resize', () => { }); 
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

}
