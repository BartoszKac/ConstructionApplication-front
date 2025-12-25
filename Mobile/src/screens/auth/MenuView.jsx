import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

function MenuView() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Sekcja Górna - Logo i Powitanie */}
      <View style={styles.topSection}>
        <View style={styles.logoCircle}>
          <Text style={{ fontSize: 50 }}>🎨</Text>
        </View>
        <Text style={styles.title}>PaintMaster</Text>
        <Text style={styles.subtitle}>Twoje narzędzie do profesjonalnych obliczeń malarskich</Text>
      </View>

      {/* Sekcja Dolna - Przyciski */}
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

        <Text style={styles.guestText}>
          Kontynuuj jako <Text style={styles.guestLink}>Gość</Text>
        </Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Cień dla logo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "transparent",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  registerButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
  },
  guestText: {
    textAlign: "center",
    marginTop: 25,
    color: "#8E8E93",
    fontSize: 14,
  },
  guestLink: {
    color: "#1C1C1E",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});