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
    
    // Set the body background to match the theme gradient to prevent overscroll gaps on mobile
    document.body.style.background = theme.bgGradient;
    // Also apply it to html so the entire overscroll area matches
    document.documentElement.style.background = theme.bgGradient;
    
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
