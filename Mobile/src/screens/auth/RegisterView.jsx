import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ApiPost from "../../api/HttpApi";

function RegisterView() {

  const [error, setError] = useState("");
  
  const[form,setForm] = useState({
    username: "",
    email: '',
    password: '',
    confirmPassword: ''
  });

  const upadatefield = (field,value)=>{
    setForm({...form,[field]: value})
  }

  const handleRegister = () => {
   const {username,email,password,confirmPassword} = form;
    setError("");
    if (!username || !email || !password || !confirmPassword) {
      setError("Wszystkie pola są wymagane");
      return;
    }
    if (password !== confirmPassword) { 
      setError("Hasła nie są takie same");
      return;
    }
    let data = ApiPost(form,"REGISTER")
    // Tutaj dodamy później logikę rejestracji
    console.log("Rejestracja:", data);

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja</Text>
         <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={(value) => {upadatefield("username",value)}}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => {upadatefield("email",value)}}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={form.password}
        onChangeText={(value) => {upadatefield("password",value)}}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Potwierdź hasło"
        value={form.confirmPassword}
        onChangeText={(value) => {upadatefield("confirmPassword",value)}}
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

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
});

export default RegisterView;
