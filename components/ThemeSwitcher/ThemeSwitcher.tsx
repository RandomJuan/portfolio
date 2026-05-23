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
    timeoutRef.current = setTimeout(() => setOpen(false), 500);
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
      if (key === 'w') {
        nextIndex = (currentIndex - 2 + length) % length;
      } else if (key === 's') {
        nextIndex = (currentIndex + 2) % length;
      } else if (key === 'a') {
        nextIndex = (currentIndex - 1 + length) % length;
      } else if (key === 'd') {
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
        style={{ background: theme.bgGradient, boxShadow: `0 0 10px ${theme.accentHex}66` }}
        title="Change Theme"
        aria-label="Change Theme"
      >
        <div className={styles.orbInner}>
          <div className={styles.particle1} style={{ backgroundColor: `rgb(${theme.firefly.primary})` }} />
          <div className={styles.particle2} style={{ backgroundColor: `rgb(${theme.firefly.secondary})` }} />
        </div>
        <div className={styles.orbShadow} />
        <div className={styles.orbHighlight} />
      </button>

      <div
        aria-hidden={!open}
        className={`${styles.dropdown} ${open ? styles.dropdownOpen : styles.dropdownClosed}`}
      >
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
  );
}

function ThemePreviewCard({ t, active, onSelect }: { t: ThemeConfig; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      title={t.id}
      aria-label={`Select ${t.id} theme`}
      className={`${styles.previewCard} ${active ? styles.previewActive : styles.previewInactive}`}
      style={{
        background: t.bgGradient,
        borderColor: active ? t.accentHex : 'transparent',
      }}
    >
      <div className={styles.orbInner}>
        <div className={styles.particle1} style={{ backgroundColor: `rgb(${t.firefly.primary})` }} />
        <div className={styles.particle2} style={{ backgroundColor: `rgb(${t.firefly.secondary})` }} />
      </div>
      <div className={styles.orbShadow} />
    </button>
  );
}