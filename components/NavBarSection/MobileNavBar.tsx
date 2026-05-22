'use client';

import { useEffect, useRef, useState } from "react";
import { NavBarData } from "@/types/navbar";
import { useTheme } from "@/components/ThemeProvider/ThemeContext";
import styles from "./MobileNavBar.module.css";

type Props = {
  navBarData: NavBarData;
  activeIndex: number;
  onNavigate: (index: number) => void;
  orbOpen: boolean;
  setOrbOpen: (open: boolean) => void;
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'charge' | 'trail' | 'spark' | 'aura' | 'impact';
  angle?: number;
  speed?: number;
  radius?: number;
}

interface LightningSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function MobileNavBar({ navBarData, activeIndex, onNavigate, orbOpen, setOrbOpen }: Props) {
  const { theme, setThemeById, themes } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [coords, setCoords] = useState<number[]>([]);
  
  // Keep animation variables in a ref for zero-latency 60fps canvas updates
  const animState = useRef({
    prevIndex: 0,
    activeIndex: 0,
    phase: 'idle' as 'idle' | 'charging' | 'traveling' | 'impact',
    progress: 0,
    currentX: 0,
    prevX: 0,
    targetX: 0,
    chargeTimer: 0,
    impactTimer: 0,
  });

  const particles = useRef<Particle[]>([]);
  const activeIndexRef = useRef(activeIndex);

  // Sync activeIndex updates
  useEffect(() => {
    if (coords.length === 0) return;

    const prev = activeIndexRef.current;
    if (prev !== activeIndex) {
      animState.current.prevIndex = prev;
      animState.current.activeIndex = activeIndex;
      animState.current.prevX = coords[prev] ?? coords[0] ?? 0;
      animState.current.targetX = coords[activeIndex] ?? coords[0] ?? 0;
      animState.current.currentX = animState.current.prevX;
      animState.current.progress = 0;
      animState.current.chargeTimer = 15; // 15 frames of charging
      animState.current.phase = 'charging';
      activeIndexRef.current = activeIndex;
    } else {
      if (animState.current.phase === 'idle') {
        const activeX = coords[activeIndex] ?? 0;
        animState.current.currentX = activeX;
        animState.current.targetX = activeX;
        animState.current.prevX = activeX;
      }
    }
  }, [activeIndex, coords]);


  // Update button coordinates on mount and resize (measuring horizontal center X)
  const updateCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords = buttonRefs.current.map((btn) => {
      if (!btn) return 0;
      const rect = btn.getBoundingClientRect();
      return rect.left - containerRect.left + rect.width / 2;
    });
    setCoords(newCoords);
    
    // Update current positions in animation state
    if (newCoords[activeIndex] !== undefined) {
      animState.current.currentX = newCoords[activeIndex];
      animState.current.targetX = newCoords[activeIndex];
      animState.current.prevX = newCoords[activeIndex];
    }
  };

  useEffect(() => {
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    const timer = setTimeout(updateCoordinates, 250);
    return () => {
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer);
    };
  }, []);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const spawnParticle = (p: Particle) => {
      particles.current.push(p);
    };

    const generateLightning = (x1: number, y1: number, x2: number, y2: number, segments: number, maxOffset: number): LightningSegment[] => {
      const path: LightningSegment[] = [];
      let prevX = x1;
      let prevY = y1;

      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const targetX = x1 + (x2 - x1) * t;
        const targetY = y1 + (y2 - y1) * t;

        let nextX = targetX;
        let nextY = targetY;

        if (i < segments) {
          const offset = (Math.random() - 0.5) * maxOffset;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            nextX += (-dy / len) * offset;
            nextY += (dx / len) * offset;
          }
        }

        path.push({ x1: prevX, y1: prevY, x2: nextX, y2: nextY });
        prevX = nextX;
        prevY = nextY;
      }

      return path;
    };

    const drawLightningPath = (path: LightningSegment[], color: string, thickness: number, blurColor: string, blurSize: number) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (blurSize > 0) {
        ctx.shadowColor = blurColor;
        ctx.shadowBlur = blurSize;
      }

      ctx.beginPath();
      if (path.length > 0) {
        ctx.moveTo(path[0].x1, path[0].y1);
        path.forEach(seg => ctx.lineTo(seg.x2, seg.y2));
      }
      ctx.stroke();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      const state = animState.current;
      const centerY = height / 2;

      // A. Idle state aura (continuous humming energy around the active item)
      if (coords.length > 0) {
        const activeX = coords[activeIndexRef.current] ?? 0;
        
        if (Math.random() < 0.15) {
          spawnParticle({
            x: activeX + (Math.random() - 0.5) * 15,
            y: centerY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.4 - Math.random() * 0.6,
            size: 1.5 + Math.random() * 2,
            color: Math.random() < 0.3 ? '#ffffff' : '#00f0ff',
            alpha: 0.8,
            decay: 0.02 + Math.random() * 0.02,
            type: 'aura'
          });
        }
      }

      // B. Multi-phase Kamehameha state machine
      if (state.phase === 'charging') {
        state.chargeTimer -= 1;
        
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 28 + Math.random() * 12;
          const px = state.prevX + Math.cos(angle) * radius;
          const py = centerY + Math.sin(angle) * radius;
          
          spawnParticle({
            x: px,
            y: py,
            vx: -Math.cos(angle) * (radius / 10),
            vy: -Math.sin(angle) * (radius / 10),
            size: 1.8 + Math.random() * 2,
            color: Math.random() < 0.4 ? '#ffffff' : '#22d3ee',
            alpha: 0.9,
            decay: 0.08,
            type: 'charge'
          });
        }

        if (Math.random() < 0.3) {
          const sparkAngle = Math.random() * Math.PI * 2;
          spawnParticle({
            x: state.prevX,
            y: centerY,
            vx: Math.cos(sparkAngle) * (1.5 + Math.random() * 2.5),
            vy: Math.sin(sparkAngle) * (1.5 + Math.random() * 2.5),
            size: 1.2,
            color: '#00ffff',
            alpha: 1.0,
            decay: 0.08,
            type: 'spark'
          });
        }

        if (state.chargeTimer <= 0) {
          state.phase = 'traveling';
        }

      } else if (state.phase === 'traveling') {
        state.progress += 0.07; 
        if (state.progress >= 1) {
          state.progress = 1;
          state.currentX = state.targetX;
          state.phase = 'impact';
          state.impactTimer = 16; 
          
          for (let i = 0; i < 32; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.8 + Math.random() * 4.5;
            spawnParticle({
              x: state.targetX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 2.0 + Math.random() * 2.5,
              color: Math.random() < 0.3 ? '#ffffff' : '#00ffff',
              alpha: 1.0,
              decay: 0.04 + Math.random() * 0.04,
              type: 'impact'
            });
          }
        } else {
          // Quartic Ease-Out
          const ease = 1 - Math.pow(1 - state.progress, 4);

          state.currentX = state.prevX + (state.targetX - state.prevX) * ease;

          const travelDirection = state.targetX > state.prevX ? 1 : -1;
          for (let i = 0; i < 2; i++) {
            spawnParticle({
              x: state.currentX - travelDirection * (6 + Math.random() * 6),
              y: centerY + (Math.random() - 0.5) * 8,
              vx: -travelDirection * (1.2 + Math.random() * 1.5),
              vy: (Math.random() - 0.5) * 1.0,
              size: 4.5 + Math.random() * 4.5,
              color: '#00d2ff',
              alpha: 0.85,
              decay: 0.04 + Math.random() * 0.03,
              type: 'trail'
            });
          }

          if (Math.random() < 0.5) {
            spawnParticle({
              x: state.currentX,
              y: centerY,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              size: 1.5,
              color: '#ffffff',
              alpha: 1.0,
              decay: 0.08,
              type: 'spark'
            });
          }
        }

      } else if (state.phase === 'impact') {
        state.impactTimer -= 1;
        if (state.impactTimer <= 0) {
          state.phase = 'idle';
        }
      }

      // ────────────────────────────────────────────────────────────────
      // 2. RENDER GRAPHICS
      // ────────────────────────────────────────────────────────────────
      
      // Render continuous ambient connection track line
      ctx.save();
      const trackGradient = ctx.createLinearGradient(0, centerY, width, centerY);
      trackGradient.addColorStop(0, 'rgba(0, 240, 255, 0.02)');
      trackGradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
      trackGradient.addColorStop(1, 'rgba(0, 240, 255, 0.02)');
      ctx.strokeStyle = trackGradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(15, centerY);
      ctx.lineTo(width - 15, centerY);
      ctx.stroke();
      ctx.restore();

      // Render traveling Kamehameha energy beam
      if (state.phase === 'traveling' || state.phase === 'impact') {
        ctx.save();
        
        let beamOpacity = 1.0;
        if (state.phase === 'impact') {
          beamOpacity = Math.max(0, state.impactTimer / 16);
        }
        
        ctx.strokeStyle = `rgba(0, 90, 255, ${0.35 * beamOpacity})`;
        ctx.lineWidth = 24;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(state.prevX, centerY);
        ctx.lineTo(state.currentX, centerY);
        ctx.stroke();

        ctx.strokeStyle = `rgba(0, 240, 255, ${0.7 * beamOpacity})`;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(state.prevX, centerY);
        ctx.lineTo(state.currentX, centerY);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${beamOpacity})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(state.prevX, centerY);
        ctx.lineTo(state.currentX, centerY);
        ctx.stroke();

        ctx.restore();

        if (Math.abs(state.currentX - state.prevX) > 10 && beamOpacity > 0.1) {
          const numBolts = Math.random() < 0.4 ? 2 : 1;
          for (let b = 0; b < numBolts; b++) {
            const x1 = state.prevX + Math.random() * (state.currentX - state.prevX) * 0.8;
            const len = (25 + Math.random() * 45) * (state.currentX > state.prevX ? 1 : -1);
            const x2 = x1 + len;
            
            const side = Math.random() < 0.5 ? -1 : 1;
            const y1 = centerY;
            const y2 = centerY + side * (8 + Math.random() * 14);

            const path = generateLightning(x1, y1, x2, y2, 4, 6);
            drawLightningPath(path, `rgba(255, 255, 255, ${beamOpacity})`, 1.2, '#00f0ff', 6 * beamOpacity);
          }
        }
      }

      // Render traveling / active Kamehameha ball core
      if (state.phase === 'charging') {
        const pulse = 1.0 + Math.sin(Date.now() / 40) * 0.15;
        const radius = 10 * pulse;
        
        ctx.save();
        const g1 = ctx.createRadialGradient(state.prevX, centerY, 0, state.prevX, centerY, radius * 2.2);
        g1.addColorStop(0, '#ffffff');
        g1.addColorStop(0.3, 'rgba(0, 240, 255, 0.9)');
        g1.addColorStop(0.65, 'rgba(0, 80, 255, 0.55)');
        g1.addColorStop(1, 'rgba(0, 40, 255, 0)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(state.prevX, centerY, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        for (let i = 0; i < 3; i++) {
          const r = radius * (0.8 + Math.random() * 0.6);
          const a = Math.random() * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(state.prevX, centerY, r, a, a + 1.2);
          ctx.stroke();
        }
        ctx.restore();

      } else if (state.phase === 'traveling') {
        ctx.save();
        const radius = 11;
        const g2 = ctx.createRadialGradient(state.currentX, centerY, 0, state.currentX, centerY, radius * 2.5);
        g2.addColorStop(0, '#ffffff');
        g2.addColorStop(0.3, 'rgba(0, 255, 255, 0.95)');
        g2.addColorStop(0.6, 'rgba(0, 100, 255, 0.6)');
        g2.addColorStop(1, 'rgba(0, 50, 255, 0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(state.currentX, centerY, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (state.phase === 'impact') {
        const radius = 14 * (1.0 + (16 - state.impactTimer) * 0.1);
        const flashOpacity = Math.max(0, state.impactTimer / 16);
        ctx.save();
        const g3 = ctx.createRadialGradient(state.targetX, centerY, 0, state.targetX, centerY, radius * 1.8);
        g3.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity})`);
        g3.addColorStop(0.2, `rgba(0, 255, 255, ${0.9 * flashOpacity})`);
        g3.addColorStop(0.75, `rgba(0, 100, 255, ${0.4 * flashOpacity})`);
        g3.addColorStop(1, 'rgba(0, 50, 255, 0)');
        ctx.fillStyle = g3;
        ctx.beginPath();
        ctx.arc(state.targetX, centerY, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (state.phase === 'idle' && coords.length > 0) {
        const activeX = coords[activeIndexRef.current] ?? 0;
        const pulse = 1.0 + Math.sin(Date.now() / 250) * 0.08;
        
        ctx.save();
        const g4 = ctx.createRadialGradient(activeX, centerY, 0, activeX, centerY, 20 * pulse);
        g4.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
        g4.addColorStop(0.4, 'rgba(0, 150, 255, 0.25)');
        g4.addColorStop(0.85, 'rgba(0, 100, 255, 0.05)');
        g4.addColorStop(1, 'rgba(0, 50, 255, 0)');
        ctx.fillStyle = g4;
        ctx.beginPath();
        ctx.arc(activeX, centerY, 20 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ────────────────────────────────────────────────────────────────
      // 3. DRAW AND UPDATE INDIVIDUAL PARTICLES
      // ────────────────────────────────────────────────────────────────
      particles.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        if (p.type === 'trail') {
          const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          pGrad.addColorStop(0, '#ffffff');
          pGrad.addColorStop(0.25, '#00ffff');
          pGrad.addColorStop(0.65, 'rgba(0, 100, 255, 0.6)');
          pGrad.addColorStop(1, 'rgba(122, 0, 255, 0)');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.size += 0.15;
          p.vx *= 0.95;
          p.vy *= 0.95;

        } else if (p.type === 'charge') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'impact') {
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 4;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.size = Math.max(0.1, p.size - 0.05);
          p.vx *= 0.93;
          p.vy *= 0.93;

        } else if (p.type === 'aura') {
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 3;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vx = Math.max(-0.4, Math.min(0.4, p.vx));

        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [coords]);

  // Section SVGs Mapper
  const renderIcon = (label: string, isActive: boolean) => {
    const strokeColor = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.4)";
    const fillColor = isActive ? "rgba(0, 255, 255, 0.25)" : "none";

    switch (label.toLowerCase()) {
      case "home":
        return (
          <svg className={styles.iconSvg} fill={fillColor} stroke={strokeColor} viewBox="0 0 24 24" strokeWidth="2.0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        );
      case "about":
        return (
          <svg className={styles.iconSvg} fill={fillColor} stroke={strokeColor} viewBox="0 0 24 24" strokeWidth="2.0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        );
      case "experience":
        return (
          <svg className={styles.iconSvg} fill={fillColor} stroke={strokeColor} viewBox="0 0 24 24" strokeWidth="2.0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.25 2.25 0 00-1.883-2.212c-1.385-.233-2.807-.348-4.242-.348s-2.857.115-4.242.348A2.25 2.25 0 003.75 14.15m16.5 0v1.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-1.5m8.25-11.25h.008v.008H12V3.75z" />
          </svg>
        );
      case "contact":
        return (
          <svg className={styles.iconSvg} fill={fillColor} stroke={strokeColor} viewBox="0 0 24 24" strokeWidth="2.0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        );
      default:
        return (
          <svg className={styles.iconSvg} fill={fillColor} stroke={strokeColor} viewBox="0 0 24 24" strokeWidth="2.0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-8.979M15 15h.008v.008H15V15z" />
          </svg>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={styles.mobileNavContainer}
      style={{
        background: "rgba(10, 15, 30, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(16px)",
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 255, 0.03) inset`
      }}
    >
      {/* Kamehameha horizontal particle rendering canvas */}
      <canvas 
        ref={canvasRef}
        className={styles.canvas}
        style={{ zIndex: 1 }}
      />

      {/* Navigation Buttons Stack */}
      {navBarData.items.map((item, idx) => {
        const isActive = activeIndex === idx;
        return (
          <button
            key={item.label}
            ref={(el) => { buttonRefs.current[idx] = el; }}
            onClick={() => {
              onNavigate(idx);
              setOrbOpen(false);
            }}
            className={styles.navButton}
            style={{ 
              zIndex: 10,
              background: isActive ? "rgba(0, 240, 255, 0.12)" : "rgba(255, 255, 255, 0.02)",
              border: isActive 
                ? "1px solid rgba(0, 240, 255, 0.4)" 
                : "1px solid rgba(255, 255, 255, 0.04)",
              boxShadow: isActive 
                ? "0 0 16px rgba(0, 240, 255, 0.25), 0 0 4px rgba(0, 240, 255, 0.15) inset" 
                : "none"
            }}
            aria-label={`Navigate to ${item.label}`}
          >
            {isActive && (
              <span className={styles.navButtonPing} />
            )}

            <div className={`${styles.iconWrapper} ${isActive ? styles.iconWrapperActive : styles.iconWrapperInactive}`}>
              {renderIcon(item.label, isActive)}
            </div>

            <span 
              className={`
                ${styles.tooltip}
                ${isActive ? styles.tooltipActive : styles.tooltipInactive}
                ${theme.mode === 'dark' ? styles.tooltipDark : styles.tooltipLight}
              `}
              style={{
                boxShadow: isActive ? `0 4px 14px rgba(0, 240, 255, 0.12)` : ''
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Visual Glowing Divider to separate navigation links from the settings orb */}
      <div 
        className={styles.divider}
        style={{
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.01) 100%)`,
          boxShadow: `0 0 8px rgba(255,255,255,0.05)`
        }}
      />

      {/* Astral Orb Theme Switcher: Styled as a concentrated mini Kamehameha energy ball */}
      <button
        onClick={() => setOrbOpen(!orbOpen)}
        className={styles.orbButton}
        style={{
          background: theme.bgGradient,
          border: `1.5px solid rgba(255, 255, 255, 0.25)`,
          boxShadow: `0 0 14px ${theme.accentHex}33`
        }}
        aria-label="Toggle Theme Menu"
        title="Toggle Theme Menu"
      >
        {/* GlossySpecular volume borders */}
        <div className={styles.orbInner1} />
        <div className={styles.orbInner2} />
        <div className={styles.orbInner3} />

        {/* Swirling active core ping */}
        <span 
          className={styles.orbCorePing} 
          style={{ backgroundColor: theme.accentHex }} 
        />
        
        {/* Core sphere */}
        <span 
          className={styles.orbCore} 
          style={{ 
            backgroundColor: theme.accentHex, 
            boxShadow: `0 0 10px ${theme.accentHex}, 0 0 3px #ffffff inset` 
          }} 
        />

        {/* Tooltip for the theme orb */}
        <span 
          className={`
            ${styles.tooltip}
            ${styles.tooltipInactive}
            ${theme.mode === 'dark' ? styles.tooltipDark : styles.tooltipLight}
          `}
        >
          Theme
        </span>
      </button>
    </div>
  );
}
