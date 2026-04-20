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
  },

  // ─────────────────────────── LIGHT THEMES ─────────────────────────────
  {
    id: 'ivory-mist',
    mode: 'light',
    background: '#fafaf8',
    bgGradient:
      'radial-gradient(ellipse at center, #fffbeb 0%, #fef9f0 55%, #fafaf8 100%)',
    firefly: {
      primary: '255, 180, 0',
      secondary: '255, 210, 60',
    },
    accentRing: 'ring-amber-400',
    accentHex: '#f59e0b',
  },
  {
    id: 'petal-dusk',
    mode: 'light',
    background: '#fdf4ff',
    bgGradient:
      'radial-gradient(ellipse at center, #fce7f3 0%, #fdf2f8 55%, #fdf4ff 100%)',
    firefly: {
      primary: '236, 72, 153',
      secondary: '167, 139, 250',
    },
    accentRing: 'ring-pink-400',
    accentHex: '#ec4899',
  },
  {
    id: 'solar-pulse',
    mode: 'light',
    background: '#fffbf0',
    bgGradient:
      'radial-gradient(ellipse at center, #fff7e6 0%, #fffbf0 55%, #ffffff 100%)',
    firefly: {
      primary: '255, 120, 0',
      secondary: '255, 210, 0',
    },
    accentRing: 'ring-orange-400',
    accentHex: '#fb923c',
  },
];

export const defaultTheme = themes[0];
