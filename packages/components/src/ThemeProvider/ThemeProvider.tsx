import { ThemeContext, type ThemeModeKeys } from '@/context/Theme/themeContext';
import { useState, type ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme: ThemeModeKeys;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};
