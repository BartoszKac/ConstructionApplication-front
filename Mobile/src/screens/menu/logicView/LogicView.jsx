import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function LogicView() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel Logiki</Text>
      
      {/* Przycisk prowadzący do Kalkulatora Farby */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('PaintView')}
      >
        <Text style={styles.buttonText}>Kalkulator Farby</Text>
      </TouchableOpacity>

      {/* Tutaj możesz dodać kolejne przyciski dla innych funkcji logicznych */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default LogicView;