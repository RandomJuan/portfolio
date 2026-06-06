import { useEffect, MutableRefObject } from 'react';
import { EffectStyle } from '@/types/theme';

interface UseBeamScrollProgressProps {
  containerRef: React.RefObject<HTMLElement | null>;
  workerRef: MutableRefObject<Worker | null>;
  scrollProgressRef: MutableRefObject<number>;
  cyclePhaseRef: MutableRefObject<number>;
  isGlobal: boolean;
  effectStyle: EffectStyle;
}

export function useBeamScrollProgress({
  containerRef,
  workerRef,
  scrollProgressRef,
  cyclePhaseRef,
  isGlobal,
  effectStyle
}: UseBeamScrollProgressProps) {
  useEffect(() => {
    if (!isGlobal || effectStyle !== EffectStyle.BEAM) return;

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

        // Dynamic Impact Opacities mapped to the 4 corners of the loop
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
  }, [isGlobal, effectStyle, containerRef, workerRef, scrollProgressRef, cyclePhaseRef]);
}
