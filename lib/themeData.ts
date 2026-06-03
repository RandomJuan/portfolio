import { ThemeConfig } from '@/types/theme';

export const themes: ThemeConfig[] = [
  // ─────────────────────────── POSITION 1: deep-blue (formerly abyss) ─────────────────────────────
  {
    id: 'deep-blue',
    displayName: 'Abyss',
    mode: 'dark',
    background: '#000000',
    bgGradient:
      'radial-gradient(ellipse at center, #0f172a 0%, #020617 55%, #01020a 100%)',
    beamGradient:
      'linear-gradient(to top right, #000000 0%, #000000 42%, #020a1c 48%, #0050b3 50%, #020a1c 52%, #000000 58%, #000000 100%)',
    firefly: {
      primary: '0, 120, 255',
      secondary: '0, 160, 255',
    },
    accentRing: 'ring-blue-500',
    accentHex: '#60a5fa',
    textColor: 'text-white',
  },
  // ─────────────────────────── POSITION 2: clean-white (formerly light-black) ────────────────────────
  {
    id: 'clean-white',
    displayName: 'Noir',
    mode: 'light',
    background: '#ffffff',
    bgGradient:
      'radial-gradient(ellipse at center, #ffffff 0%, #f8f9fa 55%, #f1f3f5 100%)',
    beamGradient:
      'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #e5e7eb 48%, #1f2937 50%, #e5e7eb 52%, #ffffff 58%, #ffffff 100%)',
    firefly: {
      primary: '0, 0, 0',
      secondary: '40, 40, 40',
    },
    accentRing: 'ring-slate-800',
    accentHex: '#1e293b',
    textColor: 'text-slate-900',
  },
  // ─────────────────────────── POSITION 3: deep-green (formerly neon-forest) ────────────────────────
  {
    id: 'deep-green',
    displayName: 'Neon',
    mode: 'dark',
    background: '#000000',
    bgGradient:
      'radial-gradient(ellipse at center, #052e16 0%, #011007 55%, #000000 100%)',
    beamGradient:
      'linear-gradient(to top right, #000000 0%, #000000 42%, #021208 48%, #16a34a 50%, #021208 52%, #000000 58%, #000000 100%)',
    firefly: {
      primary: '57, 255, 20',
      secondary: '120, 255, 80',
    },
    accentRing: 'ring-green-400',
    accentHex: '#4ade80',
    textColor: 'text-white',
  },
  // ─────────────────────────── POSITION 4: bright-orange (formerly light-lava) ─────────────────────────
  {
    id: 'bright-orange',
    displayName: 'Ember',
    mode: 'light',
    background: '#ffffff',
    bgGradient:
      'radial-gradient(ellipse at center, #ffffff 0%, #fff5f5 55%, #ffe3e3 100%)',
    beamGradient:
      'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #fee2e2 48%, #ea580c 50%, #fee2e2 52%, #ffffff 58%, #ffffff 100%)',
    firefly: {
      primary: '255, 69, 0',
      secondary: '255, 140, 0',
    },
    accentRing: 'ring-orange-500',
    accentHex: '#f97316',
    textColor: 'text-slate-900',
  },
  // ─────────────────────────── POSITION 5: cyber-cyan (formerly cyber-reef) ─────────────────────────
  {
    id: 'cyber-cyan',
    displayName: 'Reef',
    mode: 'dark',
    background: '#000000',
    bgGradient:
      'radial-gradient(ellipse at center, #0c1a2e 0%, #030c14 55%, #000000 100%)',
    beamGradient:
      'linear-gradient(to top right, #000000 0%, #000000 42%, #02141c 48%, #06b6d4 50%, #02141c 52%, #000000 58%, #000000 100%)',
    firefly: {
      primary: '0, 200, 255',
      secondary: '57, 255, 20',
    },
    accentRing: 'ring-cyan-400',
    accentHex: '#22d3ee',
    textColor: 'text-white',
  },
  // ─────────────────────────── POSITION 6: amber-white (formerly light-mixed) ─────────────────────────
  {
    id: 'amber-white',
    displayName: 'Gilt',
    mode: 'dark',
    background: '#050402',
    bgGradient:
      'radial-gradient(ellipse at center, #120e03 0%, #050402 55%, #020202 100%)',
    beamGradient:
      'linear-gradient(to top right, #020202 0%, #050402 42%, #120e03 48%, #8a6c22 50%, #120e03 52%, #050402 58%, #020202 100%)',
    firefly: {
      primary: '158, 127, 47',
      secondary: '58, 45, 16',
    },
    accentRing: 'ring-amber-600',
    accentHex: '#9e7f2f',
    textColor: 'text-white',
  },
];

export const defaultTheme = themes.find(t => t.id === 'bright-orange') || themes[0];
