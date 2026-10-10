import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router"

import * as SplashScreen from "expo-splash-screen"
import { useState } from "react"
import { Pressable, Text, useColorScheme } from "react-native"

import { AnimatedSplashOverlay } from "@/components/animated-icon"
import SideMenu from "@/components/side-menu"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />

      <Stack
        screenOptions={{
          headerTitle: "Grupp 5",
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => setMenuOpen(true)}
              accessibilityLabel="Ava menüü"
              style={{ paddingHorizontal: 12 }}
            >
              <Text style={{ fontSize: 26 }}>☰</Text>
            </Pressable>
          ),
        }}
      />

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </ThemeProvider>
  )
}
