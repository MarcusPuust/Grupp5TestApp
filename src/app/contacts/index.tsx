import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import { useTheme } from "@/hooks/use-theme"

export default function ContactsScreen() {
  const colors = useTheme()

  const email = "kontakt@example.com"
  const phone = "+372 5555 0000"
  const address = "Narva mnt 25, 10120 Tallinn, Eesti"

  // Avab välise rakenduse või veebilehe
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch (error) {
      Alert.alert("Viga", "Linki ei õnnestunud avada.")
    }
  }

  const handleEmail = () => {
    openLink(`mailto:${email}`)
  }

  const handlePhone = () => {
    openLink(`tel:${phone.replace(/\s/g, "")}`)
  }

  const handleMap = () => {
    const mapUrl =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(address)

    openLink(mapUrl)
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Võta ühendust</Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Küsimuste korral kirjuta või külasta meid.
      </Text>

      {/* Kontaktandmete kaart */}
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
          style={styles.contactRow}
          onPress={handleEmail}
        >
          <Text style={styles.icon}>✉️</Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.label, { color: colors.text }]}>E-post</Text>
            <Text style={[styles.value, { color: colors.textSecondary }]}>
              {email}
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.textMuted }]}>›</Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Pressable
          style={styles.contactRow}
          onPress={handlePhone}
        >
          <Text style={styles.icon}>📞</Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.label, { color: colors.text }]}>Telefon</Text>
            <Text style={[styles.value, { color: colors.textSecondary }]}>
              {phone}
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.textMuted }]}>›</Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.contactRow}>
          <Text style={styles.icon}>📍</Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.label, { color: colors.text }]}>Kontor</Text>
            <Text style={[styles.value, { color: colors.textSecondary }]}>
              {address}
            </Text>
          </View>
        </View>
      </View>

      {/* Asukoha kaart */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Meie asukoht
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Vaata näidiskontori asukohta kaardirakenduses.
        </Text>

        <Pressable
          style={[styles.mapButton, { backgroundColor: colors.primary }]}
          onPress={handleMap}
        >
          <Text style={[styles.mapButtonText, { color: colors.primaryText }]}>
            Ava kaardil
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        Esialgsed näidisandmed
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 50,
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
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    fontSize: 22,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 26,
  },
  divider: {
    height: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  mapButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
  },
})
