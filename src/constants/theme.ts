/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F5F7FC',
    card: '#FFFFFF',
    border: '#E5E7EB',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    tint: '#2563EB',
    icon: '#4B5563',
    modalBackdrop: 'rgba(0, 0, 0, 0.45)',
    cardSubtle: '#F8FAFC',
    buttonSecondary: '#64748B',
    activeHighlight: 'rgba(37, 99, 235, 0.1)',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0F172A',
    card: '#1E293B',
    border: '#334155',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    tint: '#3B82F6',
    icon: '#94A3B8',
    modalBackdrop: 'rgba(0, 0, 0, 0.7)',
    cardSubtle: '#111827',
    buttonSecondary: '#475569',
    activeHighlight: 'rgba(59, 130, 246, 0.25)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;
export type ThemeColors = Record<ThemeColor, string>;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
