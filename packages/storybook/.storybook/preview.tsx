import { useEffect, type ReactNode } from 'react';
import type { Preview } from '@storybook/react-vite';
import { THEMES, type Theme } from '@cascade-ds/styles/theme-names';
import { ThemeProvider } from '@/ThemeProvider';
import { useTheme } from '@/hooks';
import '@cascade-ds/styles/index.css';

// Pushes the toolbar selection into the provider without remounting the
// story, so interactive state survives a theme switch.
function ThemeSync({ theme, children }: { theme: Theme; children: ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return children;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: THEMES.map((theme) => ({ value: theme, title: theme })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as Theme;

      return (
        <ThemeProvider initialMode={theme}>
          <ThemeSync theme={theme}>
            <Story />
          </ThemeSync>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
