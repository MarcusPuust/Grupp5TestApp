import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

export default function CounterScreen() {
  const [count, setCount] = useState(0)
  const colors = useTheme()

  const handleIncrement = () => {
    setCount((prev) => prev + 1)
  }

  const handleReset = () => {
    setCount(0)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Grupp 5 Counter App
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Mobiilirakenduste arendamine
      </Text>

      <Text style={[styles.counter, { color: colors.text }]}>{count}</Text>

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleIncrement}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>
          Lisa +1
        </Text>
      </Pressable>

      <Pressable
        style={[styles.resetButton, { backgroundColor: colors.buttonSecondary }]}
        onPress={handleReset}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>
          Nulli
        </Text>
      </Pressable>

      <Text style={[styles.info, { color: colors.textMuted }]}>
        React Native + TypeScript + Expo
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  counter: {
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 12,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    marginTop: 40,
    fontSize: 14,
  },
})
