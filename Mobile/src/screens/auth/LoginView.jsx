import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

function LoginView() {
  const navigator = useNavigation();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  // Poprawiona funkcja aktualizacji - TextInput przekazuje samą wartość (string)
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogin = () => {
    // Tutaj dodasz logikę API w przyszłości
    console.log("Logowanie dla:", form.login);
    navigator.navigate("MainNavigator");
  };

  return (
    // KeyboardAvoidingView zapobiega zasłanianiu pól przez klawiaturę
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          
          <View style={styles.headerSection}>
            <Text style={styles.welcomeText}>Witaj ponownie! 👋</Text>
            <Text style={styles.subtitleText}>Zaloguj się, aby kontynuować</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Nazwa użytkownika</Text>
            <TextInput
              style={styles.input}
              placeholder="Wpisz login"
              placeholderTextColor="#A1A1A1"
              autoCapitalize="none"
              value={form.login}
              onChangeText={(val) => updateField("login", val)} // Ważne: onChangeText
            />

            <Text style={styles.inputLabel}>Hasło</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A1A1A1"
              secureTextEntry={true} // Ukrywa znaki hasła
              value={form.password}
              onChangeText={(val) => updateField("password", val)}
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Zapomniałeś hasła?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Zaloguj się</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.noAccountText}>Nie masz konta? </Text>
            <TouchableOpacity onPress={() => navigator.navigate("RegisterView")}>
              <Text style={styles.signUpText}>Zarejestruj się</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  inner: {
    flex: 1,
    padding: 30,
    justifyContent: "space-around",
  },
  headerSection: {
    marginTop: 50,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  subtitleText: {
    fontSize: 16,
    color: "#7C7C7C",
    marginTop: 8,
  },
  formSection: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    // Subtelny cień dla inputów
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  noAccountText: {
    color: "#7C7C7C",
    fontSize: 15,
  },
  signUpText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "700",
  },
});