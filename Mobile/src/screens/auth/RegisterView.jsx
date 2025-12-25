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
  Keyboard,
  ScrollView,
  Alert
} from "react-native";

function RegisterView() {
  const navigator = useNavigation();

  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = () => {
    const { login, email, password, confirmPassword } = form;

    // Prosta walidacja
    if (!login || !email || !password) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są identyczne!");
      return;
    }

    console.log("Rejestracja użytkownika:", login);
    Alert.alert("Sukces", "Konto zostało utworzone!", [
      { text: "OK", onPress: () => navigator.navigate("LoginView") }
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={() => navigator.goBack()} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.titleText}>Stwórz konto 🚀</Text>
            <Text style={styles.subtitleText}>Dołącz do nas i zacznij liczyć koszty malowania!</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Nazwa użytkownika</Text>
            <TextInput
              style={styles.input}
              placeholder="Twój login"
              value={form.login}
              onChangeText={(val) => updateField("login", val)}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="przyklad@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(val) => updateField("email", val)}
            />

            <Text style={styles.inputLabel}>Hasło</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={form.password}
              onChangeText={(val) => updateField("password", val)}
            />

            <Text style={styles.inputLabel}>Powtórz hasło</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(val) => updateField("confirmPassword", val)}
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Zarejestruj się</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.alreadyText}>Masz już konto? </Text>
            <TouchableOpacity onPress={() => navigator.navigate("LoginView")}>
              <Text style={styles.signInText}>Zaloguj się</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default RegisterView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    padding: 30,
    flexGrow: 1,
    justifyContent: "center",
  },
  headerSection: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
  titleText: {
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
    width: "100%",
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
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: "#34C759", // Zielony kolor dla rejestracji (odróżnienie od logowania)
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#34C759",
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
    marginTop: 30,
  },
  alreadyText: {
    color: "#7C7C7C",
    fontSize: 15,
  },
  signInText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "700",
  },
});