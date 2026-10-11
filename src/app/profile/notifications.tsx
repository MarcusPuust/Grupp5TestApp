import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useTheme } from "@/hooks/use-theme"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Turvahoiatus",
    message: "Face ID sisselogimine lubati edukalt sinu seadmes.",
    time: "10m tagasi",
    read: false,
    icon: "shield-checkmark",
    iconColor: "#34C759",
  },
  {
    id: "2",
    title: "Uus kontakt",
    message: "Mari Kald lisas sind oma kontaktide nimekirja.",
    time: "1h tagasi",
    read: false,
    icon: "person-add",
    iconColor: "#007AFF",
  },
  {
    id: "3",
    title: "Süsteemi uuendus",
    message: "Rakenduse uus versioon 1.2 on nüüd saadaval.",
    time: "Eile",
    read: true,
    icon: "sparkles",
    iconColor: "#AF52DE",
  },
  {
    id: "4",
    title: "Profiil uuendatud",
    message: "Sinu e-posti aadress kinnitati edukalt.",
    time: "2 päeva tagasi",
    read: true,
    icon: "checkmark-circle",
    iconColor: "#8E8E93",
  },
]

export default function NotificationsScreen() {
  const router = useRouter()
  const colors = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  )

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace("/")
    }
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handlePressNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    )
  }

  const hasUnread = notifications.some((item) => !item.read)

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Teavitused
        </Text>

        {hasUnread ? (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={[styles.markReadText, { color: colors.primary }]}>
              Loe kõik
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={54}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Teavitusi pole
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Kõik teavitused on loetud!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemCard,
              {
                backgroundColor: item.read
                  ? colors.card
                  : colors.activeHighlight,
                borderColor: item.read ? colors.border : colors.primary,
              },
            ]}
            onPress={() => handlePressNotification(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.iconColor}20` },
              ]}
            >
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>

            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.time, { color: colors.textSecondary }]}>
                  {item.time}
                </Text>
              </View>

              <Text
                style={[styles.message, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {item.message}
              </Text>
            </View>

            {!item.read && (
              <View
                style={[styles.unreadDot, { backgroundColor: colors.primary }]}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  markReadText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 6,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 14,
  },
})
