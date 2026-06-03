'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import { ThemeConfig } from '@/types/theme';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setThemeById, themes, effectStyle, setEffectStyle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutoHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 2000);
  };

  const currentThemeIdRef = useRef(theme.id);
  useEffect(() => {
    currentThemeIdRef.current = theme.id;
  }, [theme.id]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const currentIndex = themes.findIndex(t => t.id === currentThemeIdRef.current);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      const key = e.key.toLowerCase();
      const length = themes.length;
      if (key === 'w' || key === 'a') {
        nextIndex = (currentIndex - 1 + length) % length;
      } else if (key === 's' || key === 'd') {
        nextIndex = (currentIndex + 1) % length;
      } else if (key === 'enter' || key === 'escape') {
        setOpen(false);
        return;
      }

      if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < themes.length) {
        e.preventDefault();
        const nextId = themes[nextIndex].id;
        currentThemeIdRef.current = nextId;
        setThemeById(nextId);
        setOpen(true);
        triggerAutoHide();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [themes, setThemeById]);

  return (
    <div ref={ref} className={styles.container}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.triggerButton}
        title="Change Theme"
        aria-label="Change Theme"
      >
        {effectStyle === 'beam' ? (
          <svg className={styles.beamIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="beamIconGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(var(--accent-primary-rgb))" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="rgb(var(--accent-secondary-rgb))" />
              </linearGradient>
            </defs>
            <line x1="4" y1="20" x2="20" y2="4" stroke="url(#beamIconGrad)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        ) : (
          <div 
            className={styles.triggerIcon} 
            style={{ background: `radial-gradient(circle at 30% 30%, rgb(var(--accent-primary-rgb)), rgb(var(--accent-secondary-rgb)))` }} 
          />
        )}
        <svg 
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div
        aria-hidden={!open}
        className={`${styles.dropdown} ${open ? styles.dropdownOpen : styles.dropdownClosed}`}
      >
        <div className={styles.dropdownHeader}>
          <span>THEME</span>
          <div className={styles.effectToggle}>
            <button 
              className={`${styles.effectBtn} ${effectStyle === 'fireflies' ? styles.effectBtnActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setEffectStyle('fireflies'); }}
            >
              FIREFLIES
            </button>
            <button 
              className={`${styles.effectBtn} ${effectStyle === 'beam' ? styles.effectBtnActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setEffectStyle('beam'); }}
            >
              BEAM
            </button>
          </div>
        </div>
        <div className={styles.dropdownList}>
          {themes.map((t) => (
            <ThemePreviewCard
              key={t.id}
              t={t}
              active={theme.id === t.id}
              effectStyle={effectStyle}
              onSelect={() => { setThemeById(t.id); setOpen(false); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemePreviewCard({ t, active, effectStyle, onSelect }: { t: ThemeConfig; active: boolean; effectStyle: 'fireflies' | 'beam'; onSelect: () => void }) {
  // Create a richer gradient orb using the theme's firefly colors
  const gradient = `radial-gradient(circle at 30% 30%, rgb(${t.firefly.primary}), rgb(${t.firefly.secondary}))`;
  
  return (
    <button
      onClick={onSelect}
      className={`${styles.previewCard} ${active ? styles.previewActive : ''}`}
    >
      {effectStyle === 'beam' ? (
        <svg 
          className={styles.previewColor} 
          style={{ background: 'transparent', border: 'none', borderRadius: '0', boxShadow: 'none', display: 'block' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`beamIconGrad-${t.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`rgb(${t.firefly.primary})`} />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={`rgb(${t.firefly.secondary})`} />
            </linearGradient>
          </defs>
          <line x1="3" y1="21" x2="21" y2="3" stroke={`url(#beamIconGrad-${t.id})`} strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      ) : (
        <div className={styles.previewColor} style={{ background: gradient }} />
      )}
      <span className={styles.previewName}>{t.displayName}</span>
      {active && (
        <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </button>
  );
}