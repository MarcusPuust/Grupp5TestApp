import { useRouter, type Href } from "expo-router"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

type SideMenuProps = {
  visible: boolean
  onClose: () => void
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter()
  const colors = useTheme()

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
        <View style={[styles.menu, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>Grupp 5</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Navigatsioon
          </Text>

          <Pressable style={styles.menuItem} onPress={() => navigateTo("/")}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Avaleht
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/profile/notifications")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Teavitused
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/contacts")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Kontaktid
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/profile")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Profiil
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/settings")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Seaded
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/counter")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Eelmine loendur
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigateTo("/gyroscope")}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Güroskoobi mäng
            </Text>
          </Pressable>

          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeText, { color: colors.primary }]}>
              Sulge menüü
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.modalBackdrop }]}
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  backdrop: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
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
  },
  separator: {
    height: 1,
    marginVertical: 20,
  },
  closeButton: {
    paddingVertical: 14,
  },
  closeText: {
    fontSize: 15,
    fontWeight: "600",
  },
})
