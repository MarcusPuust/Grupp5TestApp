import { StyleSheet, Text, View } from "react-native"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tere tulemast!</Text>

        <Text style={styles.subtitle}>
          Tutvu meie mobiilirakenduse ja projektiga.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meie projekt</Text>

          <Text style={styles.cardText}>
            Grupp 5 arendab mobiilirakendust React Native'i, TypeScripti ja Expo
            abil.
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FC",
    padding: 24,
  },

  content: {
    marginTop: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  cardText: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
  },
})
