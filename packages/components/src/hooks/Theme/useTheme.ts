import { ThemeContext } from '@/context/Theme/themeContext';
import { useContext } from 'react';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('useTheme must be used inside a Theme Provider');

  return context;
};
