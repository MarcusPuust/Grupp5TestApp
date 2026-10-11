import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemeContext } from '@/context/theme-context';

export function useColorScheme() {
  const context = useContext(ThemeContext);
  const rnScheme = useRNColorScheme();

  if (context) {
    return context.colorScheme;
  }

  return rnScheme ?? 'light';
}
