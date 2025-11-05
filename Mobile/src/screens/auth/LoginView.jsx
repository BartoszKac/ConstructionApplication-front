import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

function LoginView() {

  const navigator = useNavigation();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const upadatefield = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="username"
        onChange={upadatefield}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        onChange={upadatefield}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigator.navigate("MainNavigator")}
      >
        <Text style={styles.buttonText}>Zaloguj się</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 10,
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 14,
  },
});
