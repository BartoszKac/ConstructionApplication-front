import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

function MenuView() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Sekcja Górna - Nowy Branding Remontowy */}
      <View style={styles.topSection}>
        <View style={styles.logoCircle}>
          {/* Zmiana ikony na bardziej uniwersalną dla remontu */}
          <Text style={{ fontSize: 50 }}>🏠</Text>
        </View>
        <Text style={styles.title}>Aplikacja Remontowa</Text>
        <Text style={styles.subtitle}>
          Kompleksowy asystent Twojego remontu.{"\n"}
          Obliczaj, wizualizuj i planuj koszty.
        </Text>
      </View>

      {/* Sekcja Dolna - Tylko Logowanie i Rejestracja */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("LoginView")}
        >
          <Text style={styles.loginButtonText}>Zaloguj się</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("RegisterView")}
        >
          <Text style={styles.registerButtonText}>Utwórz konto</Text>
        </TouchableOpacity>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>Wszystkie dane projektów w jednym miejscu</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MenuView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Solidniejszy cień dla efektu premium
    shadowColor: "#4C6EF5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#212529",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#868E96",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    paddingBottom: 20,
  },
  loginButton: {
    backgroundColor: "#4C6EF5", // Nowoczesny niebieski
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#4C6EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  registerButton: {
    backgroundColor: "transparent",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9ECEF", // Delikatniejsza ramka dla rejestracji
  },
  registerButtonText: {
    color: "#495057",
    fontSize: 18,
    fontWeight: "700",
  },
  footerNote: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#ADB5BD",
    fontSize: 12,
    fontWeight: "600",
  },
});