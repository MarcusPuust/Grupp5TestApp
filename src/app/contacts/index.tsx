import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native"

export default function ContactsScreen() {
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
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Võta ühendust</Text>

      <Text style={styles.subtitle}>
        Küsimuste korral kirjuta või külasta meid.
      </Text>

      {/* Kontaktandmete kaart */}
      <View style={styles.card}>
        <Pressable
          style={styles.contactRow}
          onPress={handleEmail}
        >
          <Text style={styles.icon}></Text>
          <View style={styles.contactInfo}>
            <Text style={styles.label}>E-post</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={styles.contactRow}
          onPress={handlePhone}
        >
          <Text style={styles.icon}></Text>
          <View style={styles.contactInfo}>
            <Text style={styles.label}>Telefon</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.contactRow}>
          <Text style={styles.icon}></Text>
          <View style={styles.contactInfo}>
            <Text style={styles.label}>Kontor</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
        </View>
      </View>

      {/* Asukoha kaart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Meie asukoht</Text>

        <Text style={styles.description}>
          Vaata näidiskontori asukohta kaardirakenduses.
        </Text>

        <Pressable
          style={styles.mapButton}
          onPress={handleMap}
        >
          <Text style={styles.mapButtonText}> Ava kaardil</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>Esialgsed näidisandmed</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FC",
  },
  content: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 50,
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
    padding: 20,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: "#6B7280",
  },
  arrow: {
    fontSize: 26,
    color: "#9CA3AF",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 20,
  },
  mapButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 5,
  },
})
