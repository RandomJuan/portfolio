import { ThemeConfig } from '@/types/theme';

export const themes: ThemeConfig[] = [
  // ─────────────────────────── DARK THEMES ──────────────────────────────
  {
    id: 'abyss',
    mode: 'dark',
    background: '#000000',
    bgGradient:
      'radial-gradient(ellipse at center, #0f172a 0%, #020617 55%, #01020a 100%)',
    firefly: {
      primary: '0, 120, 255',
      secondary: '0, 160, 255',
    },
    accentRing: 'ring-blue-500',
    accentHex: '#60a5fa',
    textColor: 'text-white',
  },
  {
    id: 'neon-forest',
    mode: 'dark',
    background: '#000000',
    bgGradient:
      'radial-gradient(ellipse at center, #052e16 0%, #011007 55%, #000000 100%)',
    firefly: {
      primary: '57, 255, 20',
      secondary: '120, 255, 80',
    },
    accentRing: 'ring-green-400',
    accentHex: '#4ade80',
    textColor: 'text-white',
  },
  {
    id: 'cyber-reef',
    mode: 'dark',
    background: '#000000',
    bgGradient:
      'radial-gradient(ellipse at center, #0c1a2e 0%, #030c14 55%, #000000 100%)',
    firefly: {
      primary: '0, 200, 255',
      secondary: '57, 255, 20',
    },
    accentRing: 'ring-cyan-400',
    accentHex: '#22d3ee',
    textColor: 'text-white',
  },

  // ─────────────────────────── LIGHT THEMES ─────────────────────────────
  {
    id: 'light-black',
    mode: 'light',
    background: '#ffffff',
    bgGradient:
      'radial-gradient(ellipse at center, #ffffff 0%, #f8f9fa 55%, #f1f3f5 100%)',
    firefly: {
      primary: '0, 0, 0',
      secondary: '40, 40, 40',
    },
    accentRing: 'ring-slate-800',
    accentHex: '#1e293b',
    textColor: 'text-slate-900',
  },
  {
    id: 'light-lava',
    mode: 'light',
    background: '#ffffff',
    bgGradient:
      'radial-gradient(ellipse at center, #ffffff 0%, #fff5f5 55%, #ffe3e3 100%)',
    firefly: {
      primary: '255, 69, 0',
      secondary: '255, 140, 0',
    },
    accentRing: 'ring-orange-500',
    accentHex: '#f97316',
    textColor: 'text-slate-900',
  },
  {
    id: 'light-mixed',
    mode: 'light',
    background: '#ffffff',
    bgGradient:
      'radial-gradient(ellipse at center, #ffffff 0%, #faf5ff 55%, #f3e8ff 100%)',
    firefly: {
      primary: '0, 0, 0',
      secondary: '255, 69, 0',
    },
    accentRing: 'ring-purple-500',
    accentHex: '#a855f7',
    textColor: 'text-slate-900',
  },
];

export const defaultTheme = themes[0];
