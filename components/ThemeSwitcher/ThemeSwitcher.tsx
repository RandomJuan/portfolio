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
      <div className={styles.wrapper}>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`${styles.triggerButton} ${theme.mode === 'dark' ? styles.triggerDark : styles.triggerLight}`}
          style={{ boxShadow: `0 4px 12px ${theme.accentHex}44` }}
        >
          <span className={styles.triggerLabel}>Theme</span>
          <svg
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          aria-hidden={!open}
          className={`
            ${styles.dropdown}
            ${open ? styles.dropdownOpen : styles.dropdownClosed}
            ${theme.mode === 'dark' ? styles.dropdownDark : styles.dropdownLight}
          `}
          style={{ boxShadow: `0 20px 40px ${theme.accentHex}22` }}
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
    </div>
  );
}

function ThemePreviewCard({ t, active, onSelect }: { t: ThemeConfig; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      title={t.id}
      className={`${styles.previewCard} ${active ? styles.previewActive : styles.previewInactive}`}
      style={{
        background: t.bgGradient,
        borderColor: active ? t.accentHex : 'transparent',
        boxShadow: active ? `0 0 12px ${t.accentHex}88` : 'none'
      }}
    >
      <div className={styles.cardInner}>
        <div
          className={styles.firefly1}
          style={{ backgroundColor: `rgb(${t.firefly.primary})`, boxShadow: `0 0 6px rgb(${t.firefly.primary})` }}
        />
        <div
          className={styles.firefly2}
          style={{ backgroundColor: `rgb(${t.firefly.secondary})`, boxShadow: `0 0 4px rgb(${t.firefly.secondary})` }}
        />
      </div>
      {active && (
        <div className={styles.activeRing} />
      )}
    </button>
  );
}