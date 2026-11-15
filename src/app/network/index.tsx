import { useTheme } from "@/hooks/use-theme"
import { useState } from "react"
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native"

const API_URL = "https://dummyjson.com"

// Serverist saadava toote andmetüüp
type Product = {
  id: number
  title: string
  description: string
  thumbnail: string
}

export default function NetworkScreen() {
  const colors = useTheme()
  const styles = createStyles(colors)

  // GET-päringu olekud
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [getStatus, setGetStatus] = useState("")

  // POST-päringu olekud
  const [inputText, setInputText] = useState("")
  const [sending, setSending] = useState(false)
  const [postStatus, setPostStatus] = useState("")
  const [serverResponse, setServerResponse] = useState("")

  // GET - andmete küsimine serverist
  const fetchProducts = async () => {
    setLoading(true)
    setGetStatus("")
    setProducts([])

    try {
      const response = await fetch(`${API_URL}/products?limit=3`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      setProducts(data.products)
      setGetStatus(`HTTP ${response.status} – päring õnnestus!`)
    } catch (error) {
      setGetStatus(`Päring ebaõnnestus: ${String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  // POST - teksti saatmine serverisse
  const sendData = async () => {
    const text = inputText.trim()

    if (!text) {
      setPostStatus("Palun sisesta kõigepealt tekst.")
      return
    }

    setSending(true)
    setPostStatus("")
    setServerResponse("")

    try {
      const response = await fetch(`${API_URL}/products/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: text,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      setServerResponse(JSON.stringify(data, null, 2))
      setPostStatus(`HTTP ${response.status} – andmed saadetud!`)
      setInputText("")
    } catch (error) {
      setPostStatus(`Saatmine ebaõnnestus: ${String(error)}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Võrgupäringud</Text>

      <Text style={styles.subtitle}>
        Andmete vastuvõtmine ja saatmine REST API kaudu.
      </Text>

      {/* GET-PÄRING */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Andmete vastuvõtmine</Text>

        <Text style={styles.description}>
          Laadi välisest serverist toodete tekstid ja pildid.
        </Text>

        <Pressable
          style={[styles.button, loading && styles.disabledButton]}
          onPress={fetchProducts}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Laadimine..." : "Laadi andmed (GET)"}
          </Text>
        </Pressable>

        {getStatus !== "" && <Text style={styles.status}>{getStatus}</Text>}

        {products.map((product) => (
          <View key={product.id} style={styles.product}>
            <Image
              source={{ uri: product.thumbnail }}
              style={styles.productImage}
              resizeMode="contain"
            />

            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>

              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* POST-PÄRING */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Andmete saatmine</Text>

        <Text style={styles.description}>
          Sisesta tekst, mis saadetakse välisele serverile uue toote nimetusena.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Sisesta tekst..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          editable={!sending}
        />

        <Pressable
          style={[styles.button, sending && styles.disabledButton]}
          onPress={sendData}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? "Saatmine..." : "Saada serverisse (POST)"}
          </Text>
        </Pressable>

        {postStatus !== "" && <Text style={styles.status}>{postStatus}</Text>}

        {serverResponse !== "" && (
          <View style={styles.responseBox}>
            <Text style={styles.responseTitle}>Serveri vastus (JSON)</Text>

            <Text style={styles.responseText} selectable>
              {serverResponse}
            </Text>
          </View>
        )}

        <Text style={styles.note}>
          Server simuleerib toote lisamist. Andmeid ei salvestata püsivalt.
        </Text>
      </View>

      <Text style={styles.footer}>
        API: dummyjson.com{"\n"}
        REST / HTTPS / JSON
      </Text>
    </ScrollView>
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
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    disabledButton: {
      opacity: 0.5,
    },
    status: {
      fontSize: 14,
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    product: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 16,
      gap: 12,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    productInfo: {
      flex: 1,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },
    productDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },
    input: {
      backgroundColor: colors.background,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
      marginBottom: 12,
    },
    responseBox: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 14,
      marginTop: 12,
    },
    responseTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },
    responseText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 20,
    },
    note: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
      marginTop: 16,
    },
    footer: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 20,
    },
  })
