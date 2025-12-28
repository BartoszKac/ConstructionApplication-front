import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePaintData } from "../../contex/contex";
import ApiPost from "../../api/HttpApi";
import RNPickerSelect from "react-native-picker-select";
import colors from "../../constats/constats";

function PaintCalculator() {
  const [color, setColor] = useState("WHITE");
  const navigation = useNavigation();
  const { setPaintData } = usePaintData();

  const [formatadd, setformatadd] = useState({ width: "", height: "" });
  const [formdelete, setFormadelete] = useState({ width: "", height: "" });
  const [addRoom, setRooms] = useState([]);
  const [deleteRomm, delRooms] = useState([]);

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

  async function SendData() {
    if (addRoom.length === 0 && deleteRomm.length === 0) {
      Alert.alert("Uwaga", "Dodaj co najmniej jedno pomieszczenie!");
      return;
    }

    const dataToSend = {
      color: color,
      areas: [...addRoom, ...deleteRomm]
    };

    try {
      const result = await ApiPost(dataToSend, "AREA", true);
      setPaintData(result);
      Alert.alert("Sukces", "Dane przeliczone pomyślnie!");
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się wysłać danych.");
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

        {/* Sekcja Odejmowania (Okna/Drzwi) */}
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

        {/* Przyciski Akcji */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.sendButton} onPress={SendData}>
            <Text style={styles.sendButtonText}>OBLICZ KOSZTY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resultsButton}
            onPress={() => navigation.navigate("PaintResponseView")}
          >
            <Text style={styles.resultsButtonText}>Zobacz ostatnie wyniki 📊</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default PaintCalculator;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F2F2F7",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 25,
    marginTop: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3A3A3C",
  },
  label: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 10,
    marginBottom: 40,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  resultsButton: {
    padding: 15,
    alignItems: "center",
  },
  resultsButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff'
  },
});