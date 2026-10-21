import { StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

export default function MeasurementExperience() {
  const colors = useTheme()
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>AR-mõõdulint</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Mõõtmine töötab ARKit-toega iPhone’is või ARCore-toega Android-telefonis,
        kuhu on paigaldatud rakenduse arendusversioon. Veebis ja Expo Go rakenduses
        pole ruumiline mõõtmine saadaval.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24 },
})
