import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePaintData } from "../../../../contex/contex";
import ApiPost from "../../../../api/HttpApi";
import RNPickerSelect from "react-native-picker-select";
import colors from "../../../../constats/constats";

function PaintCalculator() {
  const [color, setColor] = useState("WHITE");
  const navigation = useNavigation();
  const { setPaintData } = usePaintData();

  const [formatadd, setformatadd] = useState({ width: "", height: "" });
  const [formdelete, setFormadelete] = useState({ width: "", height: "" });
  const [addRoom, setRooms] = useState([]);
  const [deleteRomm, delRooms] = useState([]);

  // Nowe stany dla wyniku "na żywo"
  const [calculatedArea, setCalculatedArea] = useState(null);
  const [loading, setLoading] = useState(false);

  const addRoomHandler = () => {
    if (!formatadd.width || !formatadd.height) return Alert.alert("Błąd", "Wpisz wymiary");
    setRooms([...addRoom, { ...formatadd, name: "Add" }]);
    setformatadd({ width: "", height: "" });
  };

  const deleteRoomHandler = () => {
    if (!formdelete.width || !formdelete.height) return Alert.alert("Błąd", "Wpisz wymiary");
    delRooms([...deleteRomm, { ...formdelete, name: "Delete" }]);
    setFormadelete({ width: "", height: "" });
  };

  // Lokalna funkcja licząca metraż netto przed wysyłką
  const calculateLocalArea = () => {
    let addArea = addRoom.reduce((acc, curr) => acc + (parseFloat(curr.width) * parseFloat(curr.height)), 0);
    let subArea = deleteRomm.reduce((acc, curr) => acc + (parseFloat(curr.width) * parseFloat(curr.height)), 0);
    return (addArea - subArea).toFixed(2);
  };

  async function SendData() {
    if (addRoom.length === 0 && deleteRomm.length === 0) {
      Alert.alert("Uwaga", "Dodaj co najmniej jedno pomieszczenie!");
      return;
    }

    setLoading(true);
    const areaResult = calculateLocalArea();
    setCalculatedArea(areaResult); // Pokazujemy wynik na dole

    const dataToSend = {
      color: color,
      areas: [...addRoom, ...deleteRomm]
    };

    try {
      const result = await ApiPost(dataToSend, "AREA", true);
      setPaintData(result);
      // Nie robimy nawigacji od razu, pozwalamy użytkownikowi zobaczyć wynik na dole
      Alert.alert("Sukces", "Dane przeliczone pomyślnie!");
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się wysłać danych.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainTitle}>Kalkulator Malowania 🎨</Text>

        {/* Sekcja Koloru */}
        <View style={styles.card}>
          <Text style={styles.label}>Wybierz kolor ścian</Text>
          <RNPickerSelect
            onValueChange={(value) => setColor(value)}
            placeholder={{ label: "Wybierz kolor...", value: null }}
            items={colors}
            style={pickerSelectStyles}
            value={color}
          />
        </View>

        {/* Sekcja Dodawania */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>➕ Dodaj powierzchnię</Text>
            {addRoom.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{addRoom.length}</Text></View>}
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Szerokość"
              keyboardType="numeric"
              value={formatadd.width}
              onChangeText={(v) => setformatadd({ ...formatadd, width: v })}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Wysokość"
              keyboardType="numeric"
              value={formatadd.height}
              onChangeText={(v) => setformatadd({ ...formatadd, height: v })}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addRoomHandler}>
            <Text style={styles.buttonText}>Dodaj do listy</Text>
          </TouchableOpacity>
        </View>

        {/* Sekcja Odejmowania */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>➖ Odejmij (Okna/Drzwi)</Text>
            {deleteRomm.length > 0 && <View style={[styles.badge, { backgroundColor: '#FF9500' }]}><Text style={styles.badgeText}>{deleteRomm.length}</Text></View>}
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Szerokość"
              keyboardType="numeric"
              value={formdelete.width}
              onChangeText={(v) => setFormadelete({ ...formdelete, width: v })}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Wysokość"
              keyboardType="numeric"
              value={formdelete.height}
              onChangeText={(v) => setFormadelete({ ...formdelete, height: v })}
            />
          </View>
          <TouchableOpacity style={styles.deleteBtn} onPress={deleteRoomHandler}>
            <Text style={styles.buttonText}>Odejmij od powierzchni</Text>
          </TouchableOpacity>
        </View>

        {/* SEKACJA WYNIKU (Pojawia się po kliknięciu OBLICZ) */}
        {calculatedArea && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>POWIERZCHNIA DO MALOWANIA:</Text>
            <Text style={styles.summaryValue}>{calculatedArea} m²</Text>
            
            <TouchableOpacity 
              style={styles.nextStepButton}
              onPress={() => navigation.navigate("PaintResponseView")}
            >
              <Text style={styles.nextStepText}>DOBIERZ FARBY I PRODUKTY ❯</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.sendButton} onPress={SendData} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>OBLICZ METRAŻ</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Dodane i zmodyfikowane style
const styles = StyleSheet.create({
  // ... Twoje poprzednie style bez zmian ...
  container: { padding: 20, backgroundColor: "#F2F2F7" },
  mainTitle: { fontSize: 26, fontWeight: "800", color: "#1C1C1E", marginBottom: 25, marginTop: 40, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontWeight: "600", color: "#3A3A3C" },
  label: { fontSize: 14, color: "#8E8E93", marginBottom: 8, fontWeight: "500" },
  row: { flexDirection: "row", marginBottom: 10 },
  input: { height: 50, backgroundColor: "#F2F2F7", borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  addButton: { backgroundColor: "#34C759", padding: 15, borderRadius: 12, alignItems: "center" },
  deleteBtn: { backgroundColor: "#FF9500", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  badge: { backgroundColor: '#34C759', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  // NOWE STYLE DLA PODSUMOWANIA
  summaryCard: {
    backgroundColor: "#1C1C1E", // Ciemne tło dla kontrastu
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: { color: "#8E8E93", fontSize: 12, fontWeight: "700", marginBottom: 5 },
  summaryValue: { color: "#fff", fontSize: 32, fontWeight: "900", marginBottom: 15 },
  nextStepButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  nextStepText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  footer: { marginTop: 10, marginBottom: 40 },
  sendButton: { backgroundColor: "#007AFF", padding: 18, borderRadius: 16, alignItems: "center" },
  sendButtonText: { color: "#fff", fontSize: 18, fontWeight: "700", letterSpacing: 1 },
});

// Picker styles bez zmian...
const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#D1D1D6', borderRadius: 12, color: 'black', backgroundColor: '#fff' },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#D1D1D6', borderRadius: 12, color: 'black', backgroundColor: '#fff' },
});

export default PaintCalculator;