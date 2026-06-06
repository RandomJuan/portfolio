'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeConfig, ThemeId, ThemeModeConfig, EffectStyle } from '@/types/theme';
import { themes, defaultTheme } from '@/lib/themeData';

export type ResolvedThemeConfig = Omit<ThemeConfig, 'light' | 'dark'> & ThemeModeConfig & { mode: 'light' | 'dark' };

interface ThemeContextValue {
  theme: ResolvedThemeConfig;
  setThemeById: (id: ThemeId) => void;
  themes: ThemeConfig[];
  effectStyle: EffectStyle;
  setEffectStyle: (style: EffectStyle) => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: { ...defaultTheme, ...defaultTheme.dark, mode: 'dark' },
  setThemeById: () => {},
  themes,
  effectStyle: EffectStyle.BEAM,
  setEffectStyle: () => { },
  themeMode: 'dark',
  setThemeMode: () => {},
});

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

function rgbToHex(rgbStr: string): string {
  const parts = rgbStr.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return '#000000';
  const [r, g, b] = parts;
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(defaultTheme.id);
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>('dark');
  const [effectStyle, setEffectStyleState] = useState<EffectStyle>(EffectStyle.BEAM);

  // Derive the active theme config
  const themeDef = themes.find(t => t.id === themeId) || defaultTheme;
  const theme: ResolvedThemeConfig = {
    ...themeDef,
    ...themeDef[themeMode],
    mode: themeMode
  };

  // Persist selection in localStorage across page loads
  useEffect(() => {
    // Resolve theme
    const storedTheme = localStorage.getItem('portfolio-theme') as ThemeId | null;
    if (storedTheme && themes.some(t => t.id === storedTheme)) {
      setThemeIdState(storedTheme);
    }
    
    // Resolve mode
    const storedMode = localStorage.getItem('portfolio-theme-mode') as 'light' | 'dark' | null;
    if (storedMode === 'light' || storedMode === 'dark') {
      setThemeModeState(storedMode);
    }
    
    // Resolve effect style
    const storedEffect = localStorage.getItem('portfolio-effect') as EffectStyle | null;

    if (!storedEffect) {
      if (window.innerWidth <= 768) {
        setThemeIdState('deep-blue');
      }
      setEffectStyleState(EffectStyle.BEAM);
    } else if (Object.values(EffectStyle).includes(storedEffect)) {
      setEffectStyleState(storedEffect);
    } else {
      setEffectStyleState(EffectStyle.BEAM);
    }
  }, []);

  const setEffectStyle = useCallback((style: EffectStyle) => {
    setEffectStyleState(style);
    localStorage.setItem('portfolio-effect', style);
  }, []);

  const setThemeById = useCallback((id: ThemeId) => {
    if (themes.some((t) => t.id === id)) {
      setThemeIdState(id);
      localStorage.setItem('portfolio-theme', id);
    }
  }, []);

  const setThemeMode = useCallback((mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    localStorage.setItem('portfolio-theme-mode', mode);
  }, []);

  // Apply body text color and background dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--foreground', theme.mode === 'dark' ? '#f8fafc' : '#0f172a');
    
    // Map Tailwind color definitions to raw CSS
    const textColorHex = theme.textColor === 'text-white' ? '#ffffff' : '#0f172a';
    document.documentElement.style.setProperty('--text-color', textColorHex);
    document.body.style.color = textColorHex;
    
    // Inject accent theme variables
    const rgb = hexToRgb(theme.accentHex);
    // Dark mode contrasts well with white text. Light mode contrast depends.
    const accentContrast = theme.mode === 'dark' ? '#ffffff' : '#ffffff'; 
    
    document.documentElement.style.setProperty('--accent-hex', theme.accentHex);
    document.documentElement.style.setProperty('--accent-rgb', rgb);
    document.documentElement.style.setProperty('--accent-contrast', accentContrast);
    
    // Analyze if the theme has two distinct glowing accent colors (Euclidean color distance)
    const pRGB = theme.firefly.primary;
    const sRGB = theme.firefly.secondary;
    const c1 = pRGB.split(',').map(s => parseInt(s.trim(), 10));
    const c2 = sRGB.split(',').map(s => parseInt(s.trim(), 10));
    const distance = Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
    );
    
    // We classify as two-color if the Euclidean distance is distinct (>100)
    const isTwoColor = distance > 100;
    
    let primaryHex = theme.accentHex;
    let primaryRgb = rgb;
    let secondaryHex = theme.accentHex;
    let secondaryRgb = rgb;
    
    if (isTwoColor) {
      primaryHex = rgbToHex(pRGB);
      primaryRgb = pRGB;
      secondaryHex = rgbToHex(sRGB);
      secondaryRgb = sRGB;
    }
    
    document.documentElement.style.setProperty('--accent-primary-hex', primaryHex);
    document.documentElement.style.setProperty('--accent-primary-rgb', primaryRgb);
    document.documentElement.style.setProperty('--accent-secondary-hex', secondaryHex);
    document.documentElement.style.setProperty('--accent-secondary-rgb', secondaryRgb);
    
    // Set the body background strictly to the solid base color. 
    // WARNING: Do not set to bgGradient, as it causes massive distorted duplicates on tall scroll areas.
    document.body.style.background = theme.background;
    document.documentElement.style.background = theme.background;
    document.documentElement.style.setProperty('--background', theme.background);
    
    // Clean up any residual Tailwind classes
    document.body.classList.remove('text-white', 'text-slate-900');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeById, themes, effectStyle, setEffectStyle, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
