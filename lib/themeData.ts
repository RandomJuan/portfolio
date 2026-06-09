import { ThemeConfig } from '@/types/theme';

export const themes: ThemeConfig[] = [
  // ─────────────────────────── POSITION 1: deep-blue (Abyss) ─────────────────────────────
  {
    id: 'deep-blue',
    displayName: 'Abyss',
    dark: {
      background: '#000000',
      bgGradient: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 55%, #01020a 100%)',
      beamGradient: 'linear-gradient(to top right, #000000 0%, #000000 42%, #020a1c 48%, #0050b3 50%, #020a1c 52%, #000000 58%, #000000 100%)',
      accentRing: 'ring-blue-500',
      textColor: 'text-white',
      firefly: { primary: '0, 120, 255', secondary: '0, 160, 255' },
      accentHex: '#3b82f6',
    },
    light: {
      background: '#ffffff',
      bgGradient: 'radial-gradient(ellipse at center, #eff6ff 0%, #dbeafe 55%, #bfdbfe 100%)',
      beamGradient: 'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #bfdbfe 48%, #3b82f6 50%, #bfdbfe 52%, #ffffff 58%, #ffffff 100%)',
      accentRing: 'ring-blue-600',
      textColor: 'text-slate-900',
      firefly: { primary: '0, 120, 255', secondary: '0, 160, 255' },
      accentHex: '#3b82f6',
    }
  },
  // ─────────────────────────── POSITION 2: clean-white (Noir) ────────────────────────
  {
    id: 'clean-white',
    displayName: 'Noir',
    dark: {
      background: '#000000',
      bgGradient: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 55%, #000000 100%)',
      beamGradient: 'linear-gradient(to top right, #000000 0%, #000000 42%, #0f172a 48%, #ffffff 50%, #0f172a 52%, #000000 58%, #000000 100%)',
      accentRing: 'ring-slate-300',
      textColor: 'text-white',
      firefly: { primary: '255, 255, 255', secondary: '200, 200, 200' }, // White in dark mode
      accentHex: '#ffffff',
      accentContrast: '#000000',
    },
    light: {
      background: '#ffffff',
      bgGradient: 'radial-gradient(ellipse at center, #ffffff 0%, #f8f9fa 55%, #f1f3f5 100%)',
      beamGradient: 'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #e5e7eb 48%, #1f2937 50%, #e5e7eb 52%, #ffffff 58%, #ffffff 100%)',
      accentRing: 'ring-slate-800',
      textColor: 'text-slate-900',
      firefly: { primary: '0, 0, 0', secondary: '40, 40, 40' }, // Black in light mode
      accentHex: '#1e293b',
    }
  },
  // ─────────────────────────── POSITION 3: deep-green (Neon) ────────────────────────
  {
    id: 'deep-green',
    displayName: 'Neon',
    dark: {
      background: '#000000',
      bgGradient: 'radial-gradient(ellipse at center, #052e16 0%, #011007 55%, #000000 100%)',
      beamGradient: 'linear-gradient(to top right, #000000 0%, #000000 42%, #021208 48%, #16a34a 50%, #021208 52%, #000000 58%, #000000 100%)',
      accentRing: 'ring-green-400',
      textColor: 'text-white',
      firefly: { primary: '57, 255, 20', secondary: '120, 255, 80' },
      accentHex: '#22c55e',
    },
    light: {
      background: '#ffffff',
      bgGradient: 'radial-gradient(ellipse at center, #f0fdf4 0%, #dcfce7 55%, #bbf7d0 100%)',
      beamGradient: 'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #bbf7d0 48%, #22c55e 50%, #bbf7d0 52%, #ffffff 58%, #ffffff 100%)',
      accentRing: 'ring-green-500',
      textColor: 'text-slate-900',
      firefly: { primary: '57, 255, 20', secondary: '120, 255, 80' },
      accentHex: '#22c55e',
    }
  },
  // ─────────────────────────── POSITION 4: bright-orange (Ember) ─────────────────────────
  {
    id: 'bright-orange',
    displayName: 'Ember',
    dark: {
      background: '#000000',
      bgGradient: 'radial-gradient(ellipse at center, #431407 0%, #1a0800 55%, #000000 100%)',
      beamGradient: 'linear-gradient(to top right, #000000 0%, #000000 42%, #1a0800 48%, #ea580c 50%, #1a0800 52%, #000000 58%, #000000 100%)',
      accentRing: 'ring-orange-500',
      textColor: 'text-white',
      firefly: { primary: '255, 69, 0', secondary: '255, 140, 0' },
      accentHex: '#f97316',
    },
    light: {
      background: '#ffffff',
      bgGradient: 'radial-gradient(ellipse at center, #ffffff 0%, #fff5f5 55%, #ffe3e3 100%)',
      beamGradient: 'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #fee2e2 48%, #ea580c 50%, #fee2e2 52%, #ffffff 58%, #ffffff 100%)',
      accentRing: 'ring-orange-600',
      textColor: 'text-slate-900',
      firefly: { primary: '255, 69, 0', secondary: '255, 140, 0' },
      accentHex: '#f97316',
    }
  },
  // ─────────────────────────── POSITION 5: cyber-cyan (Reef) ─────────────────────────
  {
    id: 'cyber-cyan',
    displayName: 'Reef',
    dark: {
      background: '#000000',
      bgGradient: 'radial-gradient(ellipse at center, #0c1a2e 0%, #030c14 55%, #000000 100%)',
      beamGradient: 'linear-gradient(to top right, #000000 0%, #000000 42%, #02141c 48%, #06b6d4 50%, #02141c 52%, #000000 58%, #000000 100%)',
      accentRing: 'ring-cyan-400',
      textColor: 'text-white',
      firefly: { primary: '0, 200, 255', secondary: '57, 255, 20' },
      accentHex: '#06b6d4',
    },
    light: {
      background: '#ffffff',
      bgGradient: 'radial-gradient(ellipse at center, #ecfeff 0%, #cffafe 55%, #a5f3fc 100%)',
      beamGradient: 'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #a5f3fc 48%, #06b6d4 50%, #a5f3fc 52%, #ffffff 58%, #ffffff 100%)',
      accentRing: 'ring-cyan-500',
      textColor: 'text-slate-900',
      firefly: { primary: '0, 200, 255', secondary: '57, 255, 20' },
      accentHex: '#06b6d4',
    }
  },
  // ─────────────────────────── POSITION 6: amber-white (Gilt) ─────────────────────────
  {
    id: 'amber-white',
    displayName: 'Gilt',
    dark: {
      background: '#050402',
      bgGradient: 'radial-gradient(ellipse at center, #120e03 0%, #050402 55%, #020202 100%)',
      beamGradient: 'linear-gradient(to top right, #020202 0%, #050402 42%, #120e03 48%, #8a6c22 50%, #120e03 52%, #050402 58%, #020202 100%)',
      accentRing: 'ring-amber-600',
      textColor: 'text-white',
      firefly: { primary: '158, 127, 47', secondary: '58, 45, 16' },
      accentHex: '#d97706',
    },
    light: {
      background: '#ffffff',
      bgGradient: 'radial-gradient(ellipse at center, #fefce8 0%, #fef3c7 55%, #fde68a 100%)',
      beamGradient: 'linear-gradient(to top right, #ffffff 0%, #ffffff 42%, #fde68a 48%, #d97706 50%, #fde68a 52%, #ffffff 58%, #ffffff 100%)',
      accentRing: 'ring-amber-500',
      textColor: 'text-slate-900',
      firefly: { primary: '158, 127, 47', secondary: '58, 45, 16' },
      accentHex: '#d97706',
    }
  },
];

export const defaultTheme = themes.find(t => t.id === 'clean-white') || themes[0];
