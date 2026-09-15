import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from '../context/Theme/themeContext';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

type ThemeProviderProps = {
  children: ReactNode;
  initialMode?: ThemeMode;
};

function supportsMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

export function ThemeProvider({ children, initialMode = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    if (supportsMatchMedia()) {
      return;
    }

    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}
