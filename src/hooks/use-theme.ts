import { useContext } from 'react';

import { Colors, ThemeColors } from '@/constants/theme';
import { ThemeContext } from '@/context/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(): ThemeColors {
  const context = useContext(ThemeContext);
  if (context) {
    return context.colors;
  }

  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme] ?? Colors.light;
}
