'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import { ThemeConfig, EffectStyle } from '@/types/theme';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setThemeById, themes, effectStyle, setEffectStyle, themeMode, setThemeMode } = useTheme();
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
        {effectStyle === EffectStyle.BEAM ? (
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
          <span>MODE</span>
          <div className={styles.effectToggle}>
            <button 
              className={`${styles.effectBtn} ${themeMode === 'dark' ? styles.effectBtnActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setThemeMode('dark'); }}
              title="Dark Mode"
              style={{ padding: '4px 10px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <button 
              className={`${styles.effectBtn} ${themeMode === 'light' ? styles.effectBtnActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setThemeMode('light'); }}
              title="Light Mode"
              style={{ padding: '4px 10px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
          </div>
        </div>
        <div className={styles.dropdownHeader} style={{ marginTop: '8px', marginBottom: '4px' }}>
          <span>EFFECT</span>
          <div className={styles.effectToggle}>
            <button 
              className={`${styles.effectBtn} ${effectStyle === EffectStyle.FIREFLIES ? styles.effectBtnActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setEffectStyle(EffectStyle.FIREFLIES); }}
            >
              FIREFLIES
            </button>
            <button 
              className={`${styles.effectBtn} ${effectStyle === EffectStyle.BEAM ? styles.effectBtnActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setEffectStyle(EffectStyle.BEAM); }}
            >
              BEAM
            </button>
          </div>
        </div>
        <div className={styles.dropdownHeader} style={{ marginTop: '12px' }}>
          <span>THEME</span>
        </div>
        <div className={styles.dropdownList}>
          {themes.map((t) => (
            <ThemePreviewCard
              key={t.id}
              t={t}
              active={theme.id === t.id}
              effectStyle={effectStyle}
              themeMode={themeMode}
              onSelect={() => { setThemeById(t.id); setOpen(false); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemePreviewCard({ t, active, effectStyle, themeMode, onSelect }: { t: ThemeConfig; active: boolean; effectStyle: EffectStyle; themeMode: 'light' | 'dark'; onSelect: () => void }) {
  // Create a richer gradient orb using the theme's firefly colors
  const firefly = t[themeMode].firefly;
  const gradient = `radial-gradient(circle at 30% 30%, rgb(${firefly.primary}), rgb(${firefly.secondary}))`;
  
  return (
    <button
      onClick={onSelect}
      className={`${styles.previewCard} ${active ? styles.previewActive : ''}`}
    >
      {effectStyle === EffectStyle.BEAM ? (
        <svg 
          className={styles.previewColor} 
          style={{ background: 'transparent', border: 'none', borderRadius: '0', boxShadow: 'none', display: 'block' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`beamIconGrad-${t.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`rgb(${firefly.primary})`} />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={`rgb(${firefly.secondary})`} />
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