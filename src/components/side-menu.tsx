import { useRouter, type Href } from "expo-router"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"

type SideMenuProps = {
  visible: boolean
  onClose: () => void
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter()

  const navigateTo = (path: Href) => {
    onClose()
    router.replace(path)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <Text style={styles.title}>Grupp 5</Text>
          <Text style={styles.subtitle}>Navigatsioon</Text>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/")}
          >
            <Text style={styles.menuText}>Avaleht</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/contacts")}
          >
            <Text style={styles.menuText}>Kontaktid</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/profile")}
          >
            <Text style={styles.menuText}>Profiil</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/counter")}
          >
            <Text style={styles.menuText}>Eelmine loendur</Text>
          </Pressable>

          <View style={styles.separator} />

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeText}>Sulge menüü</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Sulge menüü"
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  menu: {
    width: "78%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 17,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 17,
    color: "#111827",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  closeButton: {
    paddingVertical: 14,
  },
  closeText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
  },
})
