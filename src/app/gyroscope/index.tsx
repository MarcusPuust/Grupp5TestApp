import * as Haptics from "expo-haptics"
import { Gyroscope, type GyroscopeMeasurement } from "expo-sensors"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

import { useTheme } from "@/hooks/use-theme"

const BALL_SIZE = 30
const TARGET_SIZE = 42
const DEAD_ZONE = 0.08
const SPEED = 170
const DEGREES_PER_RADIAN = 180 / Math.PI

export default function GyroscopeScreen() {
  const colors = useTheme()
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState("Vajuta „Alusta“ ja pööra telefoni nagu rooli.")
  const [reading, setReading] = useState({ x: 0, y: 0, z: 0 })
  const [trackWidth, setTrackWidth] = useState(0)
  const [position, setPosition] = useState(0.5)
  const [targetRight, setTargetRight] = useState(true)
  const [score, setScore] = useState(0)
  const [hapticsEnabled, setHapticsEnabled] = useState(true)
  const positionRef = useRef(0.5)
  const targetRightRef = useRef(true)
  const lastTimestampRef = useRef<number | null>(null)
  const lastHitRef = useRef(0)
  const hapticsRef = useRef(true)

  useEffect(() => {
    hapticsRef.current = hapticsEnabled
  }, [hapticsEnabled])

  const onReading = useCallback((data: GyroscopeMeasurement) => {
    setReading({ x: data.x, y: data.y, z: data.z })
    const previous = lastTimestampRef.current
    lastTimestampRef.current = data.timestamp
    if (previous === null) return

    const seconds = Math.min(Math.max(data.timestamp - previous, 0), 0.1)
    const rotation = Math.abs(data.z) < DEAD_ZONE ? 0 : data.z
    const next = Math.max(0, Math.min(1, positionRef.current - rotation * seconds * SPEED / 300))
    positionRef.current = next
    setPosition(next)

    const reached = targetRightRef.current ? next >= 0.9 : next <= 0.1
    const now = Date.now()
    if (reached && now - lastHitRef.current > 700) {
      lastHitRef.current = now
      targetRightRef.current = !targetRightRef.current
      setTargetRight(targetRightRef.current)
      setScore((value) => value + 1)
      setMessage("Sihtmärk tabatud! Pööra nüüd teisele poole.")
      if (hapticsRef.current) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      }
    }
  }, [])

  useFocusEffect(useCallback(() => {
    if (!running) return
    let cancelled = false
    let subscription: ReturnType<typeof Gyroscope.addListener> | undefined

    async function subscribe() {
      try {
        if (!(await Gyroscope.isAvailableAsync())) {
          if (!cancelled) {
            setMessage("Sellel seadmel pole güroskoop saadaval.")
            setRunning(false)
          }
          return
        }
        if (cancelled) return
        Gyroscope.setUpdateInterval(50)
        lastTimestampRef.current = null
        subscription = Gyroscope.addListener(onReading)
      } catch {
        if (!cancelled) {
          setMessage("Güroskoobi käivitamine ebaõnnestus.")
          setRunning(false)
        }
      }
    }

    void subscribe()
    return () => {
      cancelled = true
      subscription?.remove()
      lastTimestampRef.current = null
    }
  }, [running, onReading]))

  async function toggleRunning() {
    if (running) {
      setRunning(false)
      setMessage("Mäng peatatud.")
      return
    }
    if (Platform.OS === "web") {
      try {
        const permission = await Gyroscope.requestPermissionsAsync()
        if (!permission.granted) {
          setMessage("Luba brauseris liikumisanduri kasutamine.")
          return
        }
      } catch {
        setMessage("Brauser ei võimaldanud anduri luba küsida.")
        return
      }
    }
    setMessage("Pööra telefoni nagu rooli, et sinine ring sihtmärki viia.")
    setRunning(true)
  }

  const maxTravel = Math.max(0, trackWidth - BALL_SIZE)
  const targetLeft = targetRight ? Math.max(0, trackWidth - TARGET_SIZE - 8) : 8
  const magnitude = Math.hypot(reading.x, reading.y, reading.z) * DEGREES_PER_RADIAN

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page}>
      <Text style={[styles.title, { color: colors.text }]}>Güroskoobi mäng</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Hoia telefoni ekraan enda poole ja pööra seda nagu rooli. Güroskoobi Z-telje pöörlemiskiirus liigutab sinist ringi.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Punktid</Text>
        <Text style={[styles.score, { color: colors.primary }]}>{score}</Text>
        <View
          style={[styles.track, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          accessibilityLabel="Mängurada"
        >
          <View style={[styles.target, { left: targetLeft, borderColor: colors.primary }]} />
          <View style={[styles.ball, { left: position * maxTravel, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => void toggleRunning()}>
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>{running ? "Peata" : "Alusta"}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => {
          positionRef.current = 0.5
          targetRightRef.current = true
          lastHitRef.current = 0
          setPosition(0.5)
          setTargetRight(true)
          setScore(0)
          setMessage("Mäng lähtestatud. Pööra telefoni paremale.")
        }}>
          <Text style={{ color: colors.primary }}>Alusta uuesti</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Anduri näidud</Text>
        <Text style={[styles.reading, { color: colors.text }]}>X: {(reading.x * DEGREES_PER_RADIAN).toFixed(1)} °/s</Text>
        <Text style={[styles.reading, { color: colors.text }]}>Y: {(reading.y * DEGREES_PER_RADIAN).toFixed(1)} °/s</Text>
        <Text style={[styles.reading, { color: colors.primary, fontWeight: "600" }]}>Z (juhib mängu): {(reading.z * DEGREES_PER_RADIAN).toFixed(1)} °/s</Text>
        <Text style={[styles.reading, { color: colors.textSecondary }]}>Pöörlemise tugevus: {magnitude.toFixed(1)} °/s</Text>
        <Pressable style={styles.secondaryButton} onPress={() => setHapticsEnabled((value) => !value)}>
          <Text style={{ color: colors.primary }}>Vibratsioon: {hapticsEnabled ? "sees" : "väljas"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 18, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "700" },
  description: { fontSize: 15, lineHeight: 22 },
  card: { borderWidth: 1, borderRadius: 16, padding: 20 },
  label: { fontSize: 14, textAlign: "center" },
  score: { fontSize: 36, fontWeight: "700", textAlign: "center", marginBottom: 18 },
  track: { height: 72, borderWidth: 1, borderRadius: 36, justifyContent: "center", marginBottom: 16 },
  target: { position: "absolute", width: TARGET_SIZE, height: TARGET_SIZE, borderWidth: 3, borderRadius: TARGET_SIZE / 2 },
  ball: { position: "absolute", width: BALL_SIZE, height: BALL_SIZE, borderRadius: BALL_SIZE / 2 },
  message: { fontSize: 14, lineHeight: 21, minHeight: 42, textAlign: "center" },
  button: { borderRadius: 12, padding: 14, alignItems: "center", marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: "600" },
  secondaryButton: { padding: 12, alignItems: "center", marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  reading: { fontSize: 15, marginBottom: 8 },
})
