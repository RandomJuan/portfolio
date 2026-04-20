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
      if (found) setTheme(found);
    }
  }, []);

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
