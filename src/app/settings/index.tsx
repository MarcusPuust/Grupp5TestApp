import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { useThemeContext, type ThemePreference } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";

export default function SettingsScreen() {
  const { themePreference, setThemePreference, colorScheme, isDark } =
    useThemeContext();
  const colors = useTheme();

  const options: {
    id: ThemePreference;
    label: string;
    sublabel: string;
  }[] = [
    {
      id: "system",
      label: "Süsteem",
      sublabel: "Järgib seadme süsteemset teemat",
    },
    {
      id: "light",
      label: "Hele režiim",
      sublabel: "Selge ja heleda taustaga stiil",
    },
    {
      id: "dark",
      label: "Tume režiim",
      sublabel: "Säästab akut ja on mugav pimedas",
    },
  ];

  const handleToggleSwitch = (value: boolean) => {
    setThemePreference(value ? "dark" : "light");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Seaded</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Kohanda rakenduse välimust ja eelistusi.
      </Text>

      {/* Välimuse sektsioon */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Välimus ja teema
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Vali, kuidas soovid rakenduse värve kuvada.
        </Text>

        <View style={styles.optionsList}>
          {options.map((option) => {
            const isSelected = themePreference === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() => setThemePreference(option.id)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected
                      ? colors.activeHighlight
                      : colors.cardSubtle,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${option.label}: ${option.sublabel}`}
              >
                <Text style={styles.option}></Text>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? "700" : "500",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionSublabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {option.sublabel}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioIndicator,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected
                        ? colors.primary
                        : "transparent",
                    },
                  ]}
                >
                  {isSelected && <View style={styles.radioInnerCircle} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Kiirlüliti */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              Tume režiim sisse lülitatud
            </Text>
            <Text
              style={[styles.switchSublabel, { color: colors.textSecondary }]}
            >
              {themePreference === "system"
                ? `Süsteemi järgi (${isDark ? "Aktiivne" : "Mitteaktiivne"})`
                : isDark
                  ? "Käsitsi aktiveeritud"
                  : "Käsitsi välja lülitatud"}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleSwitch}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Rakenduse teave */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Rakenduse teave
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Aktiivne teema
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {colorScheme === "dark" ? "Tume 🌙" : "Hele ☀️"}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Valitud režiim
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {themePreference === "system"
              ? "Süsteemne (Automaatne)"
              : themePreference === "dark"
                ? "Tume"
                : "Hele"}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Versioon
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Arendaja
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            Grupp 5
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  option: {
    fontSize: 24,
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 3,
  },
  optionSublabel: {
    fontSize: 13,
  },
  radioIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  switchSublabel: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
});
