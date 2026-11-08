import AsyncStorage from "@react-native-async-storage/async-storage"
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

  // Loeme salvestatud teema valiku (töötab nii telefonis kui veebis)
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "system" || saved === "light" || saved === "dark") {
          setThemePreferenceState(saved)
        }
      })
      .catch((error) => console.error("Teema lugemine ebaõnnestus:", error))
  }, [])

  const setThemePreference = (preference: ThemePreference) => {
    setThemePreferenceState(preference)
    AsyncStorage.setItem(STORAGE_KEY, preference).catch((error) =>
      console.error("Teema salvestamine ebaõnnestus:", error)
    )
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
