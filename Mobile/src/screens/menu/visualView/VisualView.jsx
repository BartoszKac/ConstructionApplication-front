import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function VisualView() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Wizualizacja Projektu</Text>
        <Text style={styles.description}>
          Wybierz narzędzie, aby zobaczyć jak kolory i materiały będą wyglądać w Twoim pomieszczeniu.
        </Text>

        {/* Karta: Podgląd Kolorów */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8}
          onPress={() => navigation.navigate('ARPreview')}>
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={{ fontSize: 30 }}>📸</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Podgląd AR</Text>
            <Text style={styles.cardSubtitle}>Użyj aparatu, by nałożyć kolor na ścianę</Text>
          </View>
        </TouchableOpacity>

        {/* Karta: Palety Kolorów */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
            <Text style={{ fontSize: 30 }}>🎨</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Palety Inspiracji</Text>
            <Text style={styles.cardSubtitle}>Przeglądaj gotowe zestawy kolorystyczne</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 22,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343A40',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#ADB5BD',
    marginTop: 2,
  },
});

export default VisualView;