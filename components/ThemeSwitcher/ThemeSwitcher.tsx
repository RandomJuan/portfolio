'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import { ThemeConfig } from '@/types/theme';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setThemeById, themes } = useTheme();
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
        <div className={styles.triggerIcon} style={{ background: theme.accentHex }} />
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
        <div className={styles.dropdownHeader}>Select Theme</div>
        <div className={styles.dropdownList}>
          {themes.map((t) => (
            <ThemePreviewCard
              key={t.id}
              t={t}
              active={theme.id === t.id}
              onSelect={() => { setThemeById(t.id); setOpen(false); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemePreviewCard({ t, active, onSelect }: { t: ThemeConfig; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`${styles.previewCard} ${active ? styles.previewActive : styles.previewInactive}`}
    >
      <div className={styles.previewColor} style={{ background: t.accentHex }} />
      <span className={styles.previewName}>{t.id.charAt(0).toUpperCase() + t.id.slice(1)}</span>
      {active && (
        <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </button>
  );
}