import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';

function MainView() {
  const navigator = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Witaj w</Text>
        <Text style={styles.brandText}>PaintMaster Pro 🎨</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuGrid}>
        
        {/* ŚCIEŻKA 1: LOGIKA (Kalkulatory) */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigator.navigate("LogicNavigator")} // Kieruje do całego stosu Logic
        >
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 30 }}>🧠</Text>
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Logika i Obliczenia</Text>
            <Text style={styles.buttonSubtitle}>Kalkulatory farb i powierzchni</Text>
          </View>
        </TouchableOpacity>

        {/* ŚCIEŻKA 2: WIZUALIZACJA */}
        <TouchableOpacity
          style={[styles.mainButton, styles.visualButton]}
          onPress={() => navigator.navigate("VisualNavigator")} // Kieruje do stosu Visual
        >
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Text style={{ fontSize: 30 }}>👁️</Text>
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Wizualizacja</Text>
            <Text style={styles.buttonSubtitle}>Zobacz kolory w rzeczywistości</Text>
          </View>
        </TouchableOpacity>

        {/* ŚCIEŻKA 3: NOTATKI */}
        <TouchableOpacity
          style={[styles.mainButton, styles.noteButton]}
          onPress={() => navigator.navigate("MyNoteNavigator")} // Kieruje do stosu Notatek
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
            <Text style={{ fontSize: 30 }}>📝</Text>
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Moje Notatki</Text>
            <Text style={styles.buttonSubtitle}>Zapisane projekty i pomiary</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Wersja 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

export default MainView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 30 },
  welcomeText: { fontSize: 18, color: '#6C757D', fontWeight: '500' },
  brandText: { fontSize: 32, fontWeight: '800', color: '#212529', marginTop: 5 },
  menuGrid: { paddingHorizontal: 20, paddingBottom: 100 },
  mainButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  // Kolorowe paski dla odróżnienia sekcji
  visualButton: { borderLeftWidth: 5, borderLeftColor: '#4CAF50' },
  noteButton: { borderLeftWidth: 5, borderLeftColor: '#FF9800' },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#F0F3FF', justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  buttonContent: { flex: 1 },
  buttonTitle: { fontSize: 18, fontWeight: '700', color: '#343A40' },
  buttonSubtitle: { fontSize: 13, color: '#ADB5BD', marginTop: 2 },
  footer: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
  footerText: { color: '#CED4DA', fontSize: 12, letterSpacing: 1 }
});