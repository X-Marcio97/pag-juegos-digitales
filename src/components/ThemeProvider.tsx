'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode = 'vice' | 'cyan';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  tag: string;
  logoSrc: string;
  primaryAccent: string;
  hoverAccent: string;
  secondaryAccent: string;
  glowColor: string;
  topbarBg: string;
  description: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  vice: {
    id: 'vice',
    name: 'Vice Neon',
    tag: 'GTA VI / Magenta Neon',
    logoSrc: '/logos/logo-vice-pink.png',
    primaryAccent: '#f43f5e',
    hoverAccent: '#fb7185',
    secondaryAccent: '#a855f7',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    topbarBg: '#e11d48',
    description: 'Estilo Vice City Neon con tonos Magenta, Rosa Flúo y Púrpura',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyan Arcade',
    tag: 'Arcade / Electric Cyan',
    logoSrc: '/logos/logo-neon-blue.png',
    primaryAccent: '#00a2ff',
    hoverAccent: '#38bdf8',
    secondaryAccent: '#2563eb',
    glowColor: 'rgba(0, 162, 255, 0.4)',
    topbarBg: '#0284c7',
    description: 'Estilo Arcade Retro-Futurista con tonos Cyan Eléctrico y Azul Índigo',
  },
};

export interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  logoSrc: string;
  themeName: string;
  config: ThemeConfig;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'intergames_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('vice');
  const [mounted, setMounted] = useState(false);

  // Sync with localStorage & DOM on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'vice' || stored === 'cyan') {
        setThemeState(stored);
        document.documentElement.setAttribute('data-theme', stored);
        document.body.setAttribute('data-theme', stored);
      } else {
        document.documentElement.setAttribute('data-theme', 'vice');
        document.body.setAttribute('data-theme', 'vice');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'vice');
      document.body.setAttribute('data-theme', 'vice');
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'vice' ? 'cyan' : 'vice');
  }, [theme, setTheme]);

  const currentConfig = THEMES[theme];

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      logoSrc: currentConfig.logoSrc,
      themeName: currentConfig.name,
      config: currentConfig,
      mounted,
    }),
    [theme, setTheme, toggleTheme, currentConfig, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
