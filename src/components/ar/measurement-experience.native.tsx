import * as Device from "expo-device"
import { useFocusEffect } from "expo-router"
import { Component, type ComponentType, type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, AppState, Linking, NativeModules, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

class SessionBoundary extends Component<{ children: ReactNode; onClose: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <View style={styles.page}>
          <Text>AR-seansi käivitamine ebaõnnestus. Kontrolli seadme tuge ja ehita arendusversioon uuesti.</Text>
          <Pressable accessibilityRole="button" onPress={this.props.onClose}>
            <Text style={styles.link}>Tagasi</Text>
          </Pressable>
        </View>
      )
    }
    return this.props.children
  }
}

export default function MeasurementExperience() {
  const colors = useTheme()
  const [Session, setSession] = useState<ComponentType | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [appActive, setAppActive] = useState(AppState.currentState === "active")
  const [focused, setFocused] = useState(true)
  const attempt = useRef(0)
  // Checking native modules before importing Viro keeps Expo Go safe.
  const nativeAvailable = Boolean(
    NativeModules.VRTARSceneNavigatorModule &&
    NativeModules.VRTARSceneModule &&
    (Platform.OS !== "ios" || NativeModules.VRTARUtils),
  )
  const available = Device.isDevice && nativeAvailable

  useFocusEffect(useCallback(() => {
    setFocused(true)
    return () => {
      attempt.current += 1
      setFocused(false)
      setSession(null)
      setBusy(false)
    }
  }, []))

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setAppActive(state === "active")
      if (state !== "active") {
        // A new session gets a new coordinate frame; never reuse old endpoints.
        setSession(null)
      }
    })
    return () => {
      attempt.current += 1
      subscription.remove()
    }
  }, [])

  async function start() {
    if (busy || !available) return
    const currentAttempt = ++attempt.current
    setBusy(true)
    setMessage("")
    try {
      const { isARSupportedOnDevice, requestRequiredPermissions } =
        await import("@reactvision/react-viro/dist/components/Utilities/ViroUtils")
      const support = await isARSupportedOnDevice()
      if (currentAttempt !== attempt.current) return
      if (!support.isARSupported) {
        setMessage("See seade ei toeta ruumilist AR-mõõtmist.")
        return
      }
      const permission = await requestRequiredPermissions(["camera"])
      if (currentAttempt !== attempt.current) return
      if (!permission.camera) {
        setMessage("Mõõtmiseks on vaja kaamera luba. Luba kaamera telefoni seadetes ja proovi uuesti.")
        return
      }
      const module = await import("./measurement-session")
      if (currentAttempt === attempt.current) setSession(() => module.default)
    } catch {
      if (currentAttempt === attempt.current) {
        setMessage("AR ei ole praegu saadaval. Androidis kontrolli Google Play AR-teenuseid. Proovi uuesti või ehita arendusversioon uuesti.")
      }
    } finally {
      if (currentAttempt === attempt.current) setBusy(false)
    }
  }

  if (Session && focused && appActive) {
    return (
      <SessionBoundary onClose={() => setSession(null)}>
        <Session />
      </SessionBoundary>
    )
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page}>
      <Text style={[styles.title, { color: colors.text }]}>Mõõda kahe punkti vahe</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Liiguta telefoni aeglaselt, et leida laua-, põranda- või seinapind.
        Suuna ekraani keskel olev sihik alguspunktile ja seejärel lõpp-punktile.
        Mõlemas kohas vajuta punkti lisamise nuppu.
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Tulemus on ligikaudne. Hea valgus ja mustriline, mittepeegeldav pind parandavad
        jälgimist. Hoia sihitav pind 0,1–5 meetri kaugusel. Taustale minnes mõõtmine
        lõpetatakse ning tuleb uuesti alustada.
      </Text>
      {!Device.isDevice ? (
        <Text style={[styles.body, { color: colors.text }]}>Mõõtmiseks kasuta füüsilist AR-toega telefoni, mitte simulaatorit.</Text>
      ) : !nativeAvailable ? (
        <Text style={[styles.body, { color: colors.text }]}>
          Expo Go või see rakenduse versioon ei sisalda AR-moodulit. Paigalda uus
          arendusversioon, mis sisaldab ViroReacti. Olemasolev 3D-mudeli vaatur töötab endiselt AR-lehel.
        </Text>
      ) : (
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          style={[styles.button, { backgroundColor: colors.primary, opacity: busy ? 0.5 : 1 }]}
          onPress={() => void start()}
        >
          {busy ? <ActivityIndicator color={colors.primaryText} /> :
            <Text style={[styles.buttonText, { color: colors.primaryText }]}>Alusta mõõtmist</Text>}
        </Pressable>
      )}
      {message ? <Text accessibilityLiveRegion="polite" style={[styles.body, { color: colors.text }]}>{message}</Text> : null}
      {nativeAvailable ? (
        <Pressable accessibilityRole="button" onPress={() => {
          void Linking.openSettings().catch(() => setMessage("Seadete avamine ebaõnnestus. Ava telefoni seaded käsitsi."))
        }}>
          <Text style={[styles.link, { color: colors.primary }]}>Ava rakenduse seaded</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24 },
  button: { borderRadius: 12, padding: 16, alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  link: { fontSize: 16, textDecorationLine: "underline" },
})
