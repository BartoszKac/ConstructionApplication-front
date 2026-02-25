import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import ApiPost from "../../../../api/HttpApi";

const TILE_SIZES = ["60x60", "30x60", "120x60", "20x120", "80x80"];
const LAYOUT_TYPES = [
  { id: 'simple', label: 'Prosty', waste: 1.10, icon: '▦' },
  { id: 'brick', label: 'Mijanka', waste: 1.15, icon: '🧱' },
  { id: 'diamond', label: 'Karo', waste: 1.20, icon: '◇' },
];

function TilesView() {
  const navigation = useNavigation();

  const [areas, setAreas] = useState([
    { id: 1, type: 'rect', name: 'Główna płyta', dimA: '', dimB: '' }
  ]);

  const [selectedLayout, setSelectedLayout] = useState(LAYOUT_TYPES[0]);
  const [selectedSize, setSelectedSize] = useState(TILE_SIZES[0]);
  const [totalResult, setTotalResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addZone = (type) => {
    const newId = areas.length > 0 ? areas[areas.length - 1].id + 1 : 1;
    const defaultName = type === 'rect' ? `Strefa ${newId}` : `Skos ${newId}`;
    setAreas([...areas, { id: newId, type: type, name: defaultName, dimA: '', dimB: '' }]);
  };

  const removeZone = (id) => {
    if (areas.length === 1) return;
    setAreas(areas.filter(area => area.id !== id));
  };

  const updateZone = (id, field, value) => {
    setAreas(areas.map(area => area.id === id ? { ...area, [field]: value } : area));
  };

  const calculateProject = () => {
    let totalNetArea = 0;
    let isValid = true;

    areas.forEach((area) => {
      const a = parseFloat(area.dimA.replace(',', '.'));
      const b = parseFloat(area.dimB.replace(',', '.'));
      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) isValid = false;
      else totalNetArea += area.type === 'rect' ? (a * b) : (0.5 * a * b);
    });

    if (!isValid) {
      Alert.alert("Błąd", "Wprowadź poprawne wymiary.");
      return;
    }

    const grossArea = totalNetArea * selectedLayout.waste;
    setTotalResult({
      net: totalNetArea.toFixed(2),
      gross: grossArea.toFixed(2),
      wastePercent: Math.round((selectedLayout.waste - 1) * 100),
    });
  };

  const handleFetchMarketData = async () => {
    if (!totalResult) {
      Alert.alert("Najpierw oblicz metraż!");
      return;
    }

    setLoading(true);
    try {
      const response = await ApiPost({
        size: selectedSize,
        area: totalResult.gross
      }, "TILES",true);

      if (response.status === "success" && response.data.length > 0) {
        // NAWIGACJA DO NOWEGO EKRANU Z DANYMI
        navigation.navigate('TilesResponseView', { 
            results: response.data,
            projectInfo: {
                size: selectedSize,
                grossArea: totalResult.gross
            }
        }); 
      } else {
        Alert.alert("Brak wyników", "Nie znaleźliśmy płytek w tym rozmiarze. Spróbuj zmienić format.");
      }
    } catch (err) {
      Alert.alert("Błąd połączenia", "Serwer 8089 nie odpowiada.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setTotalResult(null); 
  }, [areas, selectedLayout, selectedSize]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MODUŁ GLAZURNICZY</Text>
        <View style={styles.headerUnderline} />
      </View>

      <Text style={styles.sectionLabel}>POMIAR POWIERZCHNI</Text>
      
      {areas.map((area) => (
        <View key={area.id} style={styles.zoneCard}>
          <View style={styles.zoneHeader}>
            <TextInput 
              style={styles.zoneName} 
              value={area.name}
              onChangeText={(val) => updateZone(area.id, 'name', val)}
            />
            <TouchableOpacity onPress={() => removeZone(area.id)}>
              <Text style={styles.deleteLabel}>USUŃ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>{area.type === 'rect' ? 'DŁUGOŚĆ' : 'PODSTAWA'}</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="0.00" 
                value={area.dimA}
                onChangeText={(v) => updateZone(area.id, 'dimA', v)}
              />
            </View>
            <Text style={styles.x}>×</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>{area.type === 'rect' ? 'SZEROKOŚĆ' : 'WYSOKOŚĆ'}</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                placeholder="0.00" 
                value={area.dimB}
                onChangeText={(v) => updateZone(area.id, 'dimB', v)}
              />
            </View>
          </View>
        </View>
      ))}

      <View style={styles.addActions}>
        <TouchableOpacity style={styles.addBtn} onPress={() => addZone('rect')}>
          <Text style={styles.addBtnText}>+ POWIERZCHNIA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addBtn, styles.addBtnOutline]} onPress={() => addZone('tri')}>
          <Text style={styles.addBtnTextOutline}>+ SKOS</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>PARAMETRY MATERIAŁU</Text>
      
      <View style={styles.configCard}>
        <Text style={styles.configTitle}>FORMAT PŁYTKI:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TILE_SIZES.map(size => (
            <TouchableOpacity 
              key={size} 
              style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[styles.sizeText, selectedSize === size && styles.textWhite]}>{size}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.configTitle, {marginTop: 20}]}>WZÓR UKŁADANIA:</Text>
        <View style={styles.layoutContainer}>
          {LAYOUT_TYPES.map(l => (
            <TouchableOpacity 
              key={l.id} 
              style={[styles.layoutChip, selectedLayout.id === l.id && styles.layoutChipActive]}
              onPress={() => setSelectedLayout(l)}
            >
              <Text style={styles.layoutIcon}>{l.icon}</Text>
              <Text style={[styles.layoutLabel, selectedLayout.id === l.id && styles.textWhite]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.calcBtn} onPress={calculateProject}>
        <Text style={styles.calcBtnText}>OBLICZ ZAPOTRZEBOWANIE</Text>
      </TouchableOpacity>

      {totalResult && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>PODSUMOWANIE PROJEKTU</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Netto:</Text>
            <Text style={styles.summaryVal}>{totalResult.net} m²</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Zapas:</Text>
            <Text style={styles.summaryVal}>+{totalResult.wastePercent}%</Text>
          </View>
          <View style={styles.hr} />
          <Text style={styles.finalLabel}>DO KUPIENIA:</Text>
          <Text style={styles.finalVal}>{totalResult.gross} m²</Text>
          
          <TouchableOpacity 
            style={styles.searchBtn} 
            onPress={handleFetchMarketData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchBtnText}>🔍 SZUKAJ PRODUKTÓW</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={{height: 40}} />
    </ScrollView>
  );
}

// Style pozostają te same, co w Twoim kodzie powyżej...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  header: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#212529', letterSpacing: 1 },
  headerUnderline: { height: 4, width: 40, backgroundColor: '#FFC107', marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#ADB5BD', marginBottom: 10, letterSpacing: 1 },
  zoneCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  zoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  zoneName: { fontSize: 16, fontWeight: '700', color: '#495057', borderBottomWidth: 1, borderBottomColor: '#E9ECEF', flex: 1, marginRight: 10 },
  deleteLabel: { fontSize: 11, fontWeight: '700', color: '#FA5252' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputBox: { flex: 1 },
  inputLabel: { fontSize: 9, fontWeight: '700', color: '#ADB5BD', marginBottom: 4 },
  input: { backgroundColor: '#F1F3F5', borderRadius: 8, padding: 12, fontSize: 16, fontWeight: '700', color: '#212529', textAlign: 'center' },
  x: { paddingHorizontal: 12, color: '#DEE2E6', fontSize: 18 },
  addActions: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  addBtn: { flex: 1, backgroundColor: '#212529', padding: 14, borderRadius: 8, alignItems: 'center' },
  addBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CED4DA' },
  addBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  addBtnTextOutline: { color: '#495057', fontSize: 11, fontWeight: '800' },
  configCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 20 },
  configTitle: { fontSize: 11, fontWeight: '800', color: '#495057', marginBottom: 12 },
  sizeChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8F9FA', marginRight: 8, borderWidth: 1, borderColor: '#E9ECEF' },
  sizeChipActive: { backgroundColor: '#FFC107', borderColor: '#FFC107' },
  sizeText: { fontSize: 13, fontWeight: '700', color: '#495057' },
  layoutContainer: { flexDirection: 'row', gap: 8 },
  layoutChip: { flex: 1, backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E9ECEF' },
  layoutChipActive: { backgroundColor: '#212529', borderColor: '#212529' },
  layoutIcon: { fontSize: 18, marginBottom: 4 },
  layoutLabel: { fontSize: 10, fontWeight: '700', color: '#495057' },
  textWhite: { color: '#FFFFFF' },
  calcBtn: { backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  calcBtnText: { color: '#212529', fontWeight: '900', fontSize: 15 },
  summaryCard: { backgroundColor: '#212529', borderRadius: 15, padding: 20, marginBottom: 20 },
  summaryTitle: { color: '#ADB5BD', fontSize: 10, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#DEE2E6', fontSize: 14 },
  summaryVal: { color: '#FFFFFF', fontWeight: '700' },
  hr: { height: 1, backgroundColor: '#343A40', marginVertical: 15 },
  finalLabel: { color: '#FFC107', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  finalVal: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', textAlign: 'center', marginVertical: 4 },
  searchBtn: { backgroundColor: '#4C6EF5', padding: 14, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  searchBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 }
});

export default TilesView;