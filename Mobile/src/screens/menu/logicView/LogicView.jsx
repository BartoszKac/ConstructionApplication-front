import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

function LogicView() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>Panel Ekspercki</Text>
          <Text style={styles.subtitle}>Wybierz moduł obliczeniowy</Text>
        </View>
        
        {/* Karta: FARBY */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('PaintView')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.icon}>🎨</Text>
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Kalkulator Farb</Text>
            <Text style={styles.cardDescription}>Obliczanie wydajności i kosztów malowania</Text>
          </View>
          <Text style={styles.arrow}>❯</Text>
        </TouchableOpacity>

        {/* Karta: PŁYTKI (MODUŁ GLAZURNICZY) */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('TilesView')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.icon}>🧱</Text>
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Moduł Glazurniczy</Text>
            <Text style={styles.cardDescription}>Zapotrzebowanie materiałowe i układanie</Text>
          </View>
          <Text style={styles.arrow}>❯</Text>
        </TouchableOpacity>

      </View>
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>System Inżynieryjny v1.2</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Ten sam jasny kolor co w TilesView
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  headerBox: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#212529',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#ADB5BD',
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    // Cienie dla efektu głębi
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212529',
  },
  cardDescription: {
    fontSize: 13,
    color: '#868E96',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#DEE2E6',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#DEE2E6',
    fontWeight: '700',
    letterSpacing: 1,
  }
});

export default LogicView;