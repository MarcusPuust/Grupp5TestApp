import { useState } from "react"
import { router } from "expo-router"
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"


const MODEL_BASE = "https://cdn.jsdelivr.net/gh/MarcusPuust/Grupp5TestApp@1a15e735a826def3f7340fa09b6977901d21b3b7/assets/models"

const MODEL = {
  name: "Tung Tung Tung Sahur",
  author: "Eks.Art",
  source: "https://sketchfab.com/3d-models/tung-tung-tung-sahur-91ddd9079bd84019ba4a12e01d93a0d6",
  usdz: `${MODEL_BASE}/tung-tung-sahur.usdz`,
  glb: `${MODEL_BASE}/tung-tung-sahur.glb`,
}


function arUrl() {
  if (Platform.OS === "ios") return MODEL.usdz
  const file = encodeURIComponent(MODEL.glb)
  return `https://arvr.google.com/scene-viewer/1.0?file=${file}&mode=ar_preferred&title=${encodeURIComponent(MODEL.name)}`
}

export default function ArScreen() {
  const colors = useTheme()
  const [activeTab, setActiveTab] = useState<"model" | "measure">("model")
  const [message, setMessage] = useState("")
  const supported = Platform.OS === "ios" || Platform.OS === "android"

  async function openAr() {
    try {
      await Linking.openURL(arUrl())
      setMessage("")
    } catch {
      setMessage("AR-vaaturi avamine ebaõnnestus.")
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page}>
      <Text style={[styles.title, { color: colors.text }]}>Liitreaalsus</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {activeTab === "model"
          ? "Paiguta 3D-mudel enda ümber päris pinnale. Telefon tuvastab kaamera abil põranda või laua ja mudel jääb sinna paigale."
          : "Mõõda kahe pärismaailma punkti vahelist kaugust telefoni kaamera ja ruumilise jälgimise abil."}
      </Text>
      <View accessibilityRole="tablist" style={[styles.tabs, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {([
          { key: "model", label: "3D-mudel" },
          { key: "measure", label: "Mõõtmine" },
        ] as const).map((tab) => {
          const selected = activeTab === tab.key
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setActiveTab(tab.key)}
              style={({ pressed }) => [
                styles.tab,
                { backgroundColor: selected ? colors.primary : "transparent", opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.tabText, { color: selected ? colors.primaryText : colors.textSecondary }]}>
                {tab.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {activeTab === "measure" ? (
        <>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>AR-mõõdulint</Text>
            <Text style={[styles.step, { color: colors.textSecondary }]}>
              Vali päris pinnal kaks punkti ja mõõda nende vaheline sirgjooneline kaugus.
              Vajab AR-toega telefoni ja eraldi arendusversiooni; Expo Go mõõtmist ei toeta.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={[styles.button, { backgroundColor: colors.primary, marginTop: 12 }]}
              onPress={() => router.push("/ar/measure")}
            >
              <Text style={[styles.buttonText, { color: colors.primaryText }]}>Mõõda kaugust</Text>
            </Pressable>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kuidas mõõta</Text>
            <Text style={[styles.step, { color: colors.text }]}>1. Ava mõõtmine ja luba kaamera kasutamine.</Text>
            <Text style={[styles.step, { color: colors.text }]}>2. Liiguta telefoni aeglaselt, kuni pind on leitud.</Text>
            <Text style={[styles.step, { color: colors.text }]}>3. Suuna sihik algus- ja lõpp-punktile ning lisa mõlemad punktid.</Text>
            <Text style={[styles.step, { color: colors.textSecondary }]}>Tulemus on ligikaudne. Mõõtmine vajab eraldi arendusversiooni ja füüsilist AR-toega telefoni.</Text>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.emoji}>🪵</Text>
            <Text style={[styles.modelName, { color: colors.text }]}>{MODEL.name}</Text>
            {/* CC BY litsents nõuab autori nimetamist. */}
            <Pressable onPress={() => void Linking.openURL(MODEL.source)}>
              <Text style={[styles.credit, { color: colors.textSecondary }]}>
                Mudel: {MODEL.author}, Sketchfab (CC BY 4.0)
              </Text>
            </Pressable>

            {supported ? (
              <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => void openAr()}>
                <Text style={[styles.buttonText, { color: colors.primaryText }]}>Ava AR-is</Text>
              </Pressable>
            ) : (
              <Text style={[styles.message, { color: colors.textSecondary }]}>AR töötab ainult telefonis.</Text>
            )}
            {message ? <Text style={[styles.message, { color: colors.text }]}>{message}</Text> : null}
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kuidas kasutada</Text>
            <Text style={[styles.step, { color: colors.text }]}>1. Vajuta „Ava AR-is“.</Text>
            <Text style={[styles.step, { color: colors.text }]}>2. Liiguta telefoni aeglaselt, kuni pind on leitud.</Text>
            <Text style={[styles.step, { color: colors.text }]}>3. Lohista mudelit sõrmega, pööra ja suurenda kahe sõrmega.</Text>
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 18, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "700" },
  description: { fontSize: 15, lineHeight: 22 },
  tabs: { flexDirection: "row", padding: 4, gap: 4, borderWidth: 1, borderRadius: 28, alignSelf: "flex-start", width: "100%", maxWidth: 400 },
  tab: { flex: 1, minHeight: 44, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 15, fontWeight: "600" },
  card: { borderWidth: 1, borderRadius: 16, padding: 20 },
  emoji: { fontSize: 72, textAlign: "center" },
  modelName: { fontSize: 20, fontWeight: "600", textAlign: "center", marginTop: 12 },
  credit: { fontSize: 13, textAlign: "center", textDecorationLine: "underline", marginTop: 4, marginBottom: 16 },
  button: { borderRadius: 12, padding: 14, alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  message: { fontSize: 14, textAlign: "center", marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  step: { fontSize: 15, lineHeight: 22, marginBottom: 6 },
})
