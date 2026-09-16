import { createContext } from 'react';
import type { Theme } from '@cascade-ds/styles/theme-names';

export type ThemeMode = Theme;

export type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
