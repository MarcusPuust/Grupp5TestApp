import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function HomeScreen() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    const newCount = count + 1
    setCount(newCount)
  }

  const handleReset = () => {
    setCount(0)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupp 5 Counter App</Text>
      <Text style={styles.subtitle}>Mobiilirakenduste arendamine</Text>

      <Text style={styles.counter}>{count}</Text>

      <Pressable
        style={styles.button}
        onPress={handleIncrement}
      >
        <Text style={styles.buttonText}>Lisa +1</Text>
      </Pressable>

      <Pressable
        style={styles.resetButton}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>Nulli</Text>
      </Pressable>

      <Text style={styles.info}>React Native + TypeScript + Expo</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f7fb",
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
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: "#64748b",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    marginTop: 40,
    fontSize: 14,
  },
})
