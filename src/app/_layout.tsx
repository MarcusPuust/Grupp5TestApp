import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Pressable, Text } from "react-native"

import { AnimatedSplashOverlay } from "@/components/animated-icon"
import SideMenu from "@/components/side-menu"
import { AppThemeProvider, useThemeContext } from "@/context/theme-context"

SplashScreen.preventAutoHideAsync()

function RootLayoutContent() {
  const { colorScheme, colors } = useThemeContext()
  const [menuOpen, setMenuOpen] = useState(false)

  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <AnimatedSplashOverlay />

      <Stack
        screenOptions={{
          headerTitle: "Grupp 5",
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => setMenuOpen(true)}
              accessibilityLabel="Ava menüü"
              style={{ paddingHorizontal: 12 }}
            >
              <Text style={{ fontSize: 26, color: colors.text }}>☰</Text>
            </Pressable>
          ),
        }}
      />

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  )
}
