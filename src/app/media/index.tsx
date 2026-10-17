import { useTheme } from "@/hooks/use-theme"
import { useState } from "react"
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native"

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio"

import * as ImagePicker from "expo-image-picker"
import { useVideoPlayer, VideoView } from "expo-video"

// Salvestatud heli kuulamine
function AudioPlayback({ uri }: { uri: string }) {
  const colors = useTheme()
  const styles = createStyles(colors)
  const player = useAudioPlayer(uri)

  const playRecording = async () => {
    try {
      await player.seekTo(0)
      player.play()
    } catch {
      Alert.alert("Viga", "Heli ei õnnestunud esitada.")
    }
  }

  return (
    <Pressable style={styles.secondaryButton} onPress={playRecording}>
      <Text style={styles.secondaryButtonText}>▶ Kuula salvestist</Text>
    </Pressable>
  )
}

// Salvestatud video vaatamine
function VideoPlayback({ uri }: { uri: string }) {
  const colors = useTheme()
  const styles = createStyles(colors)

  const player = useVideoPlayer(uri)

  return (
    <VideoView
      style={styles.mediaPreview}
      player={player}
      nativeControls
      contentFit="contain"
    />
  )
}

export default function MediaScreen() {
  const colors = useTheme()
  const styles = createStyles(colors)
  const [cameraBusy, setCameraBusy] = useState(false)
  const [imageFullscreen, setImageFullscreen] = useState(false)

  // Helisalvestuse olek
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const recorderState = useAudioRecorderState(recorder)

  const [recordingUri, setRecordingUri] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Foto või video olek
  const [mediaAsset, setMediaAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null)

  // Alustame heli salvestamist
  const startRecording = async () => {
    setBusy(true)

    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync()

      if (!permission.granted) {
        Alert.alert(
          "Luba puudub",
          "Heli salvestamiseks tuleb lubada mikrofoni kasutamine."
        )
        return
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      })

      await recorder.prepareToRecordAsync()

      setRecordingUri(null)
      recorder.record()
    } catch {
      Alert.alert("Viga", "Salvestamist ei õnnestunud alustada.")
    } finally {
      setBusy(false)
    }
  }

  // Lõpetame heli salvestamise
  const stopRecording = async () => {
    setBusy(true)

    try {
      await recorder.stop()

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      })

      if (recorder.uri) {
        setRecordingUri(recorder.uri)
      }
    } catch {
      Alert.alert("Viga", "Salvestamist ei õnnestunud lõpetada.")
    } finally {
      setBusy(false)
    }
  }

  // Avame telefoni kaamera
  const openCamera = async () => {
    setCameraBusy(true)

    try {
      // Küsime kaamera kasutamise luba
      const permission = await ImagePicker.requestCameraPermissionsAsync()

      if (!permission.granted) {
        Alert.alert(
          "Luba puudub",
          "Pildistamiseks ja video salvestamiseks tuleb lubada kaamera kasutamine."
        )
        return
      }

      // Avame kaamera foto või video tegemiseks
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 0.8,
        videoMaxDuration: 30,
      })

      // Salvestame tulemuse, kui kasutaja kinnitas selle
      if (!result.canceled && result.assets.length > 0) {
        setMediaAsset(result.assets[0])
      }
    } catch {
      Alert.alert(
        "Viga",
        "Kaamera avamine või meedia salvestamine ebaõnnestus."
      )
    } finally {
      setCameraBusy(false)
    }
  }

  // Eemaldame kuvatava foto või video
  const clearMedia = () => {
    setMediaAsset(null)
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Meedia katsetamine</Text>

        <Text style={styles.subtitle}>
          Proovi telefoni mikrofoni ja kaamera kasutamist.
        </Text>

        {/* HELISALVESTUS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Helisalvestus</Text>

          <Text style={styles.description}>
            Salvesta lühike heliklipp ja kuula seda.
          </Text>

          <Text style={styles.status}>
            {recorderState.isRecording
              ? "● Salvestamine käib..."
              : recordingUri
                ? "Salvestis on valmis!"
                : "Salvestist veel pole"}
          </Text>

          <Pressable
            style={[
              styles.button,
              recorderState.isRecording && styles.stopButton,
              busy && styles.disabledButton,
            ]}
            onPress={recorderState.isRecording ? stopRecording : startRecording}
            disabled={busy || cameraBusy}
          >
            <Text style={styles.buttonText}>
              {recorderState.isRecording
                ? "Lõpeta salvestamine"
                : "Alusta salvestamist"}
            </Text>
          </Pressable>

          {recordingUri && !recorderState.isRecording && (
            <AudioPlayback uri={recordingUri} />
          )}
        </View>

        {/* FOTO JA VIDEO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Foto ja video</Text>

          <Text style={styles.description}>
            Tee foto või salvesta kuni 30-sekundiline video.
          </Text>

          {/* Foto või video eelvaade */}
          {mediaAsset ? (
            <View>
              {mediaAsset.type === "video" ? (
                <VideoPlayback key={mediaAsset.uri} uri={mediaAsset.uri} />
              ) : (
                <Pressable
                  onPress={() => setImageFullscreen(true)}
                  accessibilityLabel="Ava foto suurelt"
                >
                  <Image
                    source={{ uri: mediaAsset.uri }}
                    style={styles.mediaPreview}
                    resizeMode="contain"
                  />
                </Pressable>
              )}

              <Text style={styles.mediaStatus}>
                {mediaAsset.type === "video"
                  ? "Video on salvestatud!"
                  : "Foto on tehtud!"}
              </Text>

              <Pressable style={styles.secondaryButton} onPress={clearMedia}>
                <Text style={styles.secondaryButtonText}>Eemalda eelvaade</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Foto või video puudub</Text>
            </View>
          )}

          <Pressable
            style={[
              styles.button,
              styles.cameraButton,
              (cameraBusy || recorderState.isRecording) &&
                styles.disabledButton,
            ]}
            onPress={openCamera}
            disabled={cameraBusy || recorderState.isRecording}
          >
            <Text style={styles.buttonText}>
              {cameraBusy ? "Kaamera avaneb..." : "Ava kaamera"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Foto täisekraanivaade */}
      <Modal
        visible={imageFullscreen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setImageFullscreen(false)}
      >
        <View style={styles.fullscreenContainer}>
          <Pressable
            style={styles.fullscreenClose}
            onPress={() => setImageFullscreen(false)}
            accessibilityLabel="Sulge täisekraan"
          >
            <Text style={styles.fullscreenCloseText}>✕</Text>
          </Pressable>

          {mediaAsset?.type === "image" && (
            <Image
              source={{ uri: mediaAsset.uri }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </>
  )
}

// Rakenduse ühise teema värvid
type ThemeColors = ReturnType<typeof useTheme>

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 24,
      paddingTop: 40,
      paddingBottom: 50,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 30,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 20,
    },
    status: {
      textAlign: "center",
      fontSize: 15,
      color: colors.textSecondary,
      marginVertical: 24,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    stopButton: {
      backgroundColor: "#DC2626",
    },
    disabledButton: {
      opacity: 0.5,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButton: {
      marginTop: 12,
      padding: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },
    cameraButton: {
      marginTop: 16,
    },
    placeholder: {
      height: 200,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    mediaPreview: {
      width: "100%",
      height: 260,
      borderRadius: 12,
      backgroundColor: "#000000",
    },
    mediaStatus: {
      textAlign: "center",
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 12,
    },
    fullscreenContainer: {
      flex: 1,
      backgroundColor: "#000000",
      justifyContent: "center",
    },

    fullscreenImage: {
      width: "100%",
      height: "100%",
    },

    fullscreenClose: {
      position: "absolute",
      top: 65,
      right: 24,
      zIndex: 10,
      padding: 12,
    },

    fullscreenCloseText: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "bold",
    },
  })
