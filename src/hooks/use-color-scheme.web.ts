import { useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemeContext } from '@/context/theme-context';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const context = useContext(ThemeContext);
  const rnScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (context) {
    return context.colorScheme;
  }

  if (hasHydrated) {
    return rnScheme ?? 'light';
  }

  return 'light';
}
