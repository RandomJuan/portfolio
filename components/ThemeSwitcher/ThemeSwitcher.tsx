'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeContext';
import { ThemeConfig } from '@/types/theme';

export default function ThemeSwitcher() {
  const { theme, setThemeById, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Solo temas oscuros
  const darkThemes = themes.filter((t) => t.mode === 'dark');

  return (
    <div ref={ref} className="fixed top-20 right-5 z-[999]">
      {/* Botón Principal */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
          backdrop-blur-md border transition-all duration-300 shadow-lg select-none cursor-pointer
          ${theme.mode === 'dark'
            ? 'bg-slate-900/70 border-slate-700 text-slate-200'
            : 'bg-white/80 border-slate-200 text-slate-700'
          }
          ring-2 ${theme.accentRing} ring-offset-2 ring-offset-transparent
        `}
        style={{ boxShadow: `0 0 12px 2px ${theme.accentHex}44` }}
      >
        <span className="text-base leading-none">Theme</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel de Temas Oscuros */}
      <div
        aria-hidden={!open}
        className={`
          absolute top-[calc(100%+10px)] right-0 
          w-16 rounded-3xl overflow-hidden py-3 flex flex-col items-center gap-1
          backdrop-blur-xl shadow-2xl border transition-all duration-200 origin-top-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
          ${theme.mode === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}
        `}
        style={{ boxShadow: `0 20px 40px ${theme.accentHex}22` }}
      >
        {darkThemes.map((t) => (
          <ThemeIcon 
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

function ThemeIcon({ t, active, onSelect }: { t: ThemeConfig; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      title={t.id}
      className={`
        relative w-12 h-12 flex items-center justify-center transition-all duration-200
        cursor-pointer rounded-full hover:bg-white/5
        ${active ? 'scale-110' : 'opacity-50 hover:opacity-100'}
      `}
    >
      {/* Indicador de selección lateral minimalista */}
      {active && (
        <span 
          className="absolute left-1 w-1 h-3 rounded-full" 
          style={{ backgroundColor: `rgb(${t.firefly.primary})` }} 
        />
      )}
      
      {/* El icono circular (Swatch) */}
      <span
        className="w-7 h-7 rounded-full border border-white/20 shadow-lg"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(${t.firefly.primary},1) 0%, ${t.background} 100%)`,
          boxShadow: active ? `0 0 15px rgba(${t.firefly.primary},0.6)` : 'none'
        }}
      />
    </button>
  );
}