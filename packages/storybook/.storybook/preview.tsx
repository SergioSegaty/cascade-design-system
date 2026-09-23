import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import { useDarkMode } from '@vueless/storybook-dark-mode';
import type { Theme } from '@cascade-ds/styles/theme-names';
import { ThemeProvider } from '@/ThemeProvider';
import { useTheme } from '@/hooks';
import '@cascade-ds/styles/index.css';

function ThemeSync({ theme, children }: { theme: Theme; children: ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, setTheme]);

  return children;
}

function DarkModeThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = useDarkMode() ? 'dark' : 'light';

  return (
    <ThemeProvider initialMode={theme}>
      <ThemeSync theme={theme}>{children}</ThemeSync>
    </ThemeProvider>
  );
}

function ThemedDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  return <DocsContainer {...props} theme={useDarkMode() ? themes.dark : themes.light} />;
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <DarkModeThemeProvider>
        <Story />
      </DarkModeThemeProvider>
    ),
  ],
  parameters: {
    darkMode: {
      dark: themes.dark,
      light: themes.light,
    },
    docs: {
      container: ThemedDocsContainer,
    },
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
