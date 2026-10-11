import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

export default function Profile() {
  const router = useRouter()
  const colors = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.activeHighlight,
            borderColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.avatarText}>👤</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        Kasutaja Profiil
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Grupp 5 testkasutaja
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
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/settings")}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            ⚙️ Ava seaded
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 42,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
