import { StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

export default function HomeScreen() {
  const colors = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Tere tulemast!</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tutvu meie mobiilirakenduse ja projektiga.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Meie projekt
          </Text>

          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
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
    padding: 24,
  },

  content: {
    marginTop: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },

  card: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 24,
  },
})
