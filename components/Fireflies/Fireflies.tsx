'use client';
import { useRef, useId } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import { Firefly } from './Firefly';
import { useFireflyEngine } from './hooks/useFireflyEngine';
import { useBeamScrollProgress } from './hooks/useBeamScrollProgress';
import { DiagonalBeams } from './components/DiagonalBeams';
import { GroundImpacts } from './components/GroundImpacts';
import { EffectStyle } from '@/types/theme';
import styles from './Fireflies.module.css';

export default function Fireflies({ isGlobal = false }: { isGlobal?: boolean }) {
  const ecosystemId = useId();
  const { theme, effectStyle } = useTheme();

  // Core DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBgRef = useRef<HTMLCanvasElement>(null);
  const canvasFgRef = useRef<HTMLCanvasElement>(null);

  // Core Engine Refs
  const firefliesRef = useRef<Firefly[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const cyclePhaseRef = useRef<number>(0);

  // Hook 1: Manages Web Worker, Canvas Fallback, and Resizing
  useFireflyEngine({
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
  });

  // Hook 2: Manages Scroll Math and Phase CSS Variable Updates
  useBeamScrollProgress({
    containerRef,
    workerRef,
    scrollProgressRef,
    cyclePhaseRef,
    isGlobal,
    effectStyle
  });

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
      {/* BASE BACKGROUND FOR NON-BEAM MODES */}
      {effectStyle === EffectStyle.FIREFLIES && (
        <div className={styles.bgGradient} style={{ background: theme.bgGradient }} />
      )}

      {/* SPECIALIZED BEAM EFFECTS */}
      {effectStyle === EffectStyle.BEAM && (
        <>
          <DiagonalBeams theme={theme} />
          <GroundImpacts theme={theme} />
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
