'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeConfig, ThemeId } from '@/types/theme';
import { themes, defaultTheme } from '@/lib/themeData';

interface ThemeContextValue {
  theme: ThemeConfig;
  setThemeById: (id: ThemeId) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setThemeById: () => {},
  themes,
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
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  // Persist selection in localStorage across page loads
  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme') as ThemeId | null;
    if (stored) {
      const found = themes.find((t) => t.id === stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (found) setTheme(found);
    }
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
    const lightTextAccents = ['clean-white', 'bright-orange', 'amber-white'];
    const accentContrast = lightTextAccents.includes(theme.id) ? '#ffffff' : '#0f172a';
    
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
    
    // Set the body background to match the theme gradient to prevent overscroll gaps on mobile
    document.body.style.background = theme.bgGradient;
    // Also apply it to html so the entire overscroll area matches
    document.documentElement.style.background = theme.bgGradient;
    // Sync the CSS variable so background-color fallback also matches
    document.documentElement.style.setProperty('--background', theme.background);
    
    // Clean up any residual Tailwind classes
    document.body.classList.remove('text-white', 'text-slate-900');
  }, [theme]);

  const setThemeById = useCallback((id: ThemeId) => {
    const found = themes.find((t) => t.id === id);
    if (!found) return;
    setTheme(found);
    localStorage.setItem('portfolio-theme', id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeById, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
