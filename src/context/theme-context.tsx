import React, { createContext, useContext, useEffect, useState } from "react"
import { useColorScheme as useRNColorScheme } from "react-native"

import { Colors, ThemeColors } from "@/constants/theme"

export type ThemePreference = "system" | "light" | "dark"
export type ColorScheme = "light" | "dark"

export interface ThemeContextValue {
  themePreference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
  colorScheme: ColorScheme
  isDark: boolean
  colors: ThemeColors
}

const STORAGE_KEY = "grupp5_theme_preference"

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system")
  const systemScheme = useRNColorScheme()

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(
        STORAGE_KEY
      ) as ThemePreference | null
      if (saved === "system" || saved === "light" || saved === "dark") {
        setThemePreferenceState(saved)
      }
    }
  }, [])

  const setThemePreference = (preference: ThemePreference) => {
    setThemePreferenceState(preference)
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, preference)
    }
  }

  const resolvedScheme: ColorScheme =
    themePreference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themePreference

  const isDark = resolvedScheme === "dark"
  const colors = Colors[resolvedScheme]

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        setThemePreference,
        colorScheme: resolvedScheme,
        isDark,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useThemeContext must be used within an AppThemeProvider")
  }
  return context
}
