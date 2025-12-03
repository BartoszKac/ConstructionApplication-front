import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
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
  const [formatadd, setformatadd] = useState({
    width: "",
    height: "",
  });

  const upadatefieldAdd = (field, value) => {
    setformatadd({ ...formatadd, [field]: value });
  };

  const [formdelete, setFormadelete] = useState({
    width: "",
    height: "",
  });

  const upadatefieldDelete = (field, value) => {
    setFormadelete({ ...formdelete, [field]: value });
  };

  const [addRoom, setRooms] = useState([]);
  const [deleteRomm, delRooms] = useState([]);

  const addRoomHandler = () => {
    const object = { ...formatadd, name: "Add" };
    setRooms([...addRoom, { ...object }]);
    setformatadd({ width: "", height: "" });
  };

  const deleteRoomHandler = () => {
    const object = { ...formdelete, name: "Delete" };
    delRooms([...deleteRomm, { ...object }]);
    setFormadelete({ width: "", height: "" });
  };

  async function SendData() {
    const Table = [...addRoom, ...deleteRomm];
    Table = {COLOR: color, AREAS: Table};
    
    try {
      const result = await ApiPost(Table, "AREA");
      setPaintData(result)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
         <View style={{ padding: 20 }}>
      <RNPickerSelect
        onValueChange={(value) => setColor(value)}
        placeholder={{ label: "Wybierz kolor...", value: null }}
        items={colors}
      />
    </View>
      <Text style={styles.sectionTitle}>Dodaj Pomieszczenie</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Podaj Szerokość</Text>
        <TextInput
          style={styles.input}
          value={formatadd.width}
          onChangeText={(value) => upadatefieldAdd("width", value)}
        />
        <Text style={styles.label}>Podaj Wysokość</Text>
        <TextInput
          style={styles.input}
          value={formatadd.height}
          onChangeText={(value) => upadatefieldAdd("height", value)}
        />
        <TouchableOpacity style={styles.button} onPress={addRoomHandler}>
          <Text style={styles.buttonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Usuń Pomieszczenie</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Podaj Szerokość</Text>
        <TextInput
          style={styles.input}
          value={formdelete.width}
          onChangeText={(value) => upadatefieldDelete("width", value)}
        />
        <Text style={styles.label}>Podaj Wysokość</Text>
        <TextInput
          style={styles.input}
          value={formdelete.height}
          onChangeText={(value) => upadatefieldDelete("height", value)}
        />
        <TouchableOpacity style={styles.button} onPress={deleteRoomHandler}>
          <Text style={styles.buttonText}>Usuń</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={SendData}>
        <Text style={styles.button}>Wyślij</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Nawigacja do wyników");
          navigation.navigate("PaintResponseView"); // 👈 BEZ parametrów!
        }}
      >
        <Text style={styles.buttonText}>Zobacz wyniki</Text>
      </TouchableOpacity>

     
    </View>
    
  );
}

export default PaintCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
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
