import React, { use } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./Style";
import { useNavigation } from "@react-navigation/native";

function MenuView() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LoginView")}
      >
        <Text style={styles.buttonText}>Logowanie</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate("RegisterView")}
      >
        <Text style={styles.buttonText}>Rejestracja</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MenuView;


