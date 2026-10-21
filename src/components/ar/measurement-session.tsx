import { ViroARScene } from "@reactvision/react-viro/dist/components/AR/ViroARScene"
import { ViroARSceneNavigator } from "@reactvision/react-viro/dist/components/AR/ViroARSceneNavigator"
import { ViroMaterials } from "@reactvision/react-viro/dist/components/Material/ViroMaterials"
import type { ViroCameraARHitTest, ViroTrackingReason, ViroTrackingState } from "@reactvision/react-viro/dist/components/Types/ViroEvents"
import { ViroARTrackingReasonConstants, ViroTrackingStateConstants } from "@reactvision/react-viro/dist/components/ViroConstants"
import { ViroPolyline } from "@reactvision/react-viro/dist/components/ViroPolyline"
import { ViroSphere } from "@reactvision/react-viro/dist/components/ViroSphere"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  canPlaceTarget,
  distanceInMetres,
  formatDistance,
  type MeasurementTarget,
  type Point3D,
  selectSurfacePoint,
} from "@/utils/ar-measurement"

ViroMaterials.createMaterials({
  measurementStart: { diffuseColor: "#22C55E", lightingModel: "Constant" },
  measurementEnd: { diffuseColor: "#FBBF24", lightingModel: "Constant" },
  measurementLine: { diffuseColor: "#FFFFFF", lightingModel: "Constant" },
})

type SceneState = {
  points: Point3D[]
  onHit: (event: ViroCameraARHitTest) => void
  onTracking: (state: ViroTrackingState, reason: ViroTrackingReason) => void
}

const MeasurementContext = createContext<SceneState | null>(null)

function MeasurementScene() {
  const state = useContext(MeasurementContext)
  if (!state) throw new Error("Measurement scene requires its session")
  return (
    <ViroARScene
      anchorDetectionTypes={["PlanesHorizontal", "PlanesVertical"]}
      onCameraARHitTest={state.onHit}
      onTrackingUpdated={state.onTracking}
    >
      {state.points.map((point, index) => (
        <ViroSphere
          key={index}
          position={point}
          radius={0.008}
          materials={[index === 0 ? "measurementStart" : "measurementEnd"]}
          ignoreEventHandling
        />
      ))}
      {state.points.length === 2 ? (
        <ViroPolyline
          points={state.points}
          thickness={0.003}
          materials={["measurementLine"]}
          ignoreEventHandling
        />
      ) : null}
    </ViroARScene>
  )
}

const INITIAL_SCENE = { scene: MeasurementScene }

export default function MeasurementSession() {
  const insets = useSafeAreaInsets()
  const [points, setPoints] = useState<Point3D[]>([])
  const [trackingMessage, setTrackingMessage] = useState("Liiguta telefoni aeglaselt ja skaneeri pinda.")
  const [ready, setReady] = useState(false)
  const [preview, setPreview] = useState("")
  const [notice, setNotice] = useState("")
  const target = useRef<MeasurementTarget | null>(null)
  const normal = useRef(false)
  const pointsRef = useRef<Point3D[]>([])
  const mounted = useRef(true)

  const onHit = useCallback((event: ViroCameraARHitTest) => {
    if (!mounted.current || !normal.current) return
    const position = selectSurfacePoint(event.hitTestResults, event.cameraOrientation.position)
    target.current = position ? { position, timestamp: Date.now() } : null
  }, [])

  const onTracking = useCallback((state: ViroTrackingState, reason: ViroTrackingReason) => {
    if (!mounted.current) return
    normal.current = state === ViroTrackingStateConstants.TRACKING_NORMAL
    // Require a new hit after every tracking transition.
    target.current = null
    setReady(false)
    setPreview("")
    if (!normal.current) {
      if (pointsRef.current.length) {
        pointsRef.current = []
        setPoints([])
        setNotice("Jälgimine katkes. Mõõtmise täpsuse huvides vali punktid uuesti.")
      }
      setTrackingMessage(
        reason === ViroARTrackingReasonConstants.TRACKING_REASON_EXCESSIVE_MOTION
          ? "Liiguta telefoni aeglasemalt."
          : "Otsin pinda. Liiguta telefoni aeglaselt ja kasuta head valgust.",
      )
    } else {
      setTrackingMessage("Jälgimine töötab. Suuna sihik tuvastatud pinnale.")
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    // Native hit callbacks run at camera rate; React UI only updates at 10 Hz.
    const interval = setInterval(() => {
      const current = target.current
      const valid = canPlaceTarget(current, normal.current, Date.now())
      setReady(valid)
      setPreview(valid && pointsRef.current.length === 1
        ? formatDistance(distanceInMetres(pointsRef.current[0], current.position))
        : "")
    }, 100)
    return () => {
      mounted.current = false
      normal.current = false
      target.current = null
      clearInterval(interval)
    }
  }, [])

  function updatePoints(next: Point3D[]) {
    pointsRef.current = next
    setPoints(next)
    setNotice("")
    setPreview("")
  }

  function placePoint() {
    const current = target.current
    if (pointsRef.current.length >= 2) return
    if (!canPlaceTarget(current, normal.current, Date.now())) {
      setNotice("Pind ei ole sihikul või jälgimine pole valmis. Suuna telefon uuesti pinnale.")
      return
    }
    if (pointsRef.current.length === 1 && distanceInMetres(pointsRef.current[0], current.position) < 0.01) {
      setNotice("Vali lõpp-punkt alguspunktist vähemalt 1 cm kaugusele.")
      return
    }
    updatePoints([...pointsRef.current, [...current.position]])
    target.current = null
    setReady(false)
  }

  const complete = points.length === 2
  const result = complete ? formatDistance(distanceInMetres(points[0], points[1])) : preview

  return (
    <MeasurementContext.Provider value={{ points, onHit, onTracking }}>
      <View style={styles.container}>
        <ViroARSceneNavigator
          style={StyleSheet.absoluteFill}
          initialScene={INITIAL_SCENE}
          provider="none"
          worldAlignment="Gravity"
          hdrEnabled={false}
          pbrEnabled={false}
          shadowsEnabled={false}
        />
        <View pointerEvents="none" style={styles.topPanel}>
          <Text style={styles.heading}>{complete ? "Mõõtmine valmis" : `Punkt ${points.length + 1} / 2`}</Text>
          <Text style={styles.body}>{trackingMessage}</Text>
          <Text style={styles.caption}>Roheline: algus · Kollane: lõpp</Text>
        </View>
        <View pointerEvents="none" style={styles.reticleContainer}>
          <View style={[styles.reticle, { borderColor: ready ? "#22C55E" : "#FFFFFF" }]}>
            <View style={[styles.dot, { backgroundColor: ready ? "#22C55E" : "#FFFFFF" }]} />
          </View>
        </View>
        <View style={[styles.bottomPanel, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text accessibilityLiveRegion="polite" style={styles.result}>{result || "—"}</Text>
          <Text style={styles.body}>
            {complete ? "Kahe punkti sirgjooneline kaugus"
              : ready ? "Pind leitud — võid punkti lisada"
                : "Suuna keskmine sihik pinnale (0,1–5 m)"}
          </Text>
          {notice ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text> : null}
          {!complete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !ready }}
              disabled={!ready}
              onPress={placePoint}
              style={[styles.primaryButton, { opacity: ready ? 1 : 0.45 }]}
            >
              <Text style={styles.buttonText}>{points.length ? "Lisa lõpp-punkt" : "Lisa alguspunkt"}</Text>
            </Pressable>
          ) : null}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={!points.length}
              style={[styles.secondaryButton, { opacity: points.length ? 1 : 0.45 }]}
              onPress={() => updatePoints(pointsRef.current.slice(0, -1))}
            >
              <Text style={styles.buttonText}>Võta tagasi</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => {
              updatePoints([])
              target.current = null
              setReady(false)
            }}>
              <Text style={styles.buttonText}>{complete ? "Uus mõõtmine" : "Nulli"}</Text>
            </Pressable>
          </View>
          <Text style={styles.caption}>Ligikaudne tulemus, mitte täppismõõteriist. Jälgimise katkemisel vali punktid uuesti.</Text>
        </View>
      </View>
    </MeasurementContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  topPanel: { position: "absolute", top: 12, left: 16, right: 16, padding: 16, gap: 6, borderRadius: 16, backgroundColor: "rgba(15, 23, 42, 0.85)" },
  heading: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  body: { color: "#FFFFFF", fontSize: 14, lineHeight: 20, textAlign: "center" },
  caption: { color: "#CBD5E1", fontSize: 12, lineHeight: 17, textAlign: "center" },
  reticleContainer: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  reticle: { width: 28, height: 28, borderWidth: 2, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dot: { width: 4, height: 4, borderRadius: 2 },
  bottomPanel: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, gap: 10, backgroundColor: "rgba(15, 23, 42, 0.9)" },
  result: { color: "#FFFFFF", fontSize: 32, fontWeight: "700", textAlign: "center" },
  notice: { color: "#FBBF24", fontSize: 14, textAlign: "center" },
  primaryButton: { backgroundColor: "#2563EB", borderRadius: 12, padding: 14, alignItems: "center" },
  secondaryButton: { flex: 1, backgroundColor: "#334155", borderRadius: 12, padding: 12, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 12 },
})
