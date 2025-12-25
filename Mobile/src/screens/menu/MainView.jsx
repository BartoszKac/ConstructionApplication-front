import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

function MainView() {
  const navigator = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Witający */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Witaj w</Text>
        <Text style={styles.brandText}>PaintMaster Pro 🎨</Text>
      </View>

      {/* Menu Główne */}
      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.7}
          onPress={() => navigator.navigate("PaintView")}
        >
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 30 }}>📏</Text>
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Kalkulator Malowania</Text>
            <Text style={styles.buttonSubtitle}>Oblicz powierzchnię i koszty</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.secondaryButton]}
          activeOpacity={0.7}
          onPress={() => navigator.navigate("PaintResponseView")}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#E1F5FE' }]}>
            <Text style={{ fontSize: 30 }}>📊</Text>
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Ostatnie Wyniki</Text>
            <Text style={styles.buttonSubtitle}>Przejrzyj historię obliczeń</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer / Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Wersja 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

export default MainView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // Delikatny jasny niebieski/szary
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: '#6C757D',
    fontWeight: '500',
  },
  brandText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#212529',
    marginTop: 5,
  },
  menuGrid: {
    paddingHorizontal: 20,
    gap: 15, // Działa w nowszych wersjach RN, jeśli nie, użyj marginVertical
  },
  mainButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    // Cień
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  secondaryButton: {
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343A40',
  },
  buttonSubtitle: {
    fontSize: 13,
    color: '#ADB5BD',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#CED4DA',
    fontSize: 12,
    letterSpacing: 1,
  }
});