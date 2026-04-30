'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import { ThemeConfig } from '@/types/theme';

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
    <div ref={ref} className="fixed top-0 right-0 z-[999]">
      <div className="relative flex justify-end">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-b-xl text-sm font-semibold
            backdrop-blur-md border border-t-0 transition-all duration-300 shadow-lg select-none cursor-pointer
            ${theme.mode === 'dark'
              ? 'bg-slate-900/70 border-slate-700 text-slate-200'
              : 'bg-white/80 border-slate-200 text-slate-700'
            }
          `}
          style={{ boxShadow: `0 4px 12px ${theme.accentHex}44` }}
        >
          <span className="text-base leading-none">Theme</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          aria-hidden={!open}
          className={`
            absolute top-[calc(100%+10px)] right-0 
            w-56 rounded-2xl overflow-hidden p-2 grid grid-cols-2 gap-2
            backdrop-blur-xl shadow-2xl border transition-all duration-200 origin-top-right
            ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
            ${theme.mode === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}
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
      className={`
        relative w-full h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer
        ${active ? 'border-current scale-105 shadow-md z-10' : 'border-transparent hover:scale-105 hover:shadow-sm'}
      `}
      style={{
        background: t.bgGradient,
        borderColor: active ? t.accentHex : 'transparent',
        boxShadow: active ? `0 0 12px ${t.accentHex}88` : 'none'
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-90">
        <div
          className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: `rgb(${t.firefly.primary})`, boxShadow: `0 0 6px rgb(${t.firefly.primary})` }}
        />
        <div
          className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: `rgb(${t.firefly.secondary})`, boxShadow: `0 0 4px rgb(${t.firefly.secondary})` }}
        />
      </div>
      {active && (
        <div className="absolute inset-0 border-[2px] border-white/20 rounded-xl pointer-events-none" />
      )}
    </button>
  );
}