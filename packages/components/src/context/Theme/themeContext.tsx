import { createContext } from 'react';
import type { Theme } from '@bds/types';
export type ThemeModeKeys = keyof typeof Theme.themes;

type ThemeContextType = {
  currentTheme: ThemeModeKeys;
  setTheme: (selectedTheme: ThemeModeKeys) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
