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
  ActivityIndicator,
  Alert
} from "react-native";
import ApiPost from "../../api/HttpApi";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pamiętaj o instalacji!

function LoginView() {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogin = async () => {
    // Prosta walidacja
    if (!form.login || !form.password) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    setLoading(true);
    try {
      // 1. Wysyłamy żądanie do endpointu LOGIN
      const response = await ApiPost(
        { email: form.login, password: form.password }, 
        "LOGIN"
      );

      // 2. Zakładamy, że serwer zwraca token w response.token lub response.jwt
   // NOWY KOD (poprawny)
    if (response.token) {
      console.log("Zalogowano pomyślnie!");
      // Używamy 'replace', aby użytkownik nie mógł wrócić do logowania przyciskiem 'back'
      navigator.replace("MainView"); 
    } else {
        Alert.alert("Błąd", "Nie otrzymano klucza dostępu od serwera.");
      }
    } catch (error) {
      // Obsługa błędu 403 lub braku sieci
      const errorMsg = error.response?.status === 403 
        ? "Błędny login lub hasło" 
        : "Problem z połączeniem z serwerem";
      
      Alert.alert("Logowanie nieudane", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              onChangeText={(val) => updateField("login", val)}
              editable={!loading} // Blokada podczas ładowania
            />

            <Text style={styles.inputLabel}>Hasło</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A1A1A1"
              secureTextEntry={true}
              value={form.password}
              onChangeText={(val) => updateField("password", val)}
              editable={!loading}
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}></Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Zaloguj się</Text>
              )}
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
    justifyContent: "center", // Bardziej scentrowany układ
  },
  headerSection: {
    marginBottom: 40,
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
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#EFEFEF",
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
  buttonDisabled: {
    backgroundColor: "#A1CFFF", // Jaśniejszy kolor gdy przycisk jest nieaktywny
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
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