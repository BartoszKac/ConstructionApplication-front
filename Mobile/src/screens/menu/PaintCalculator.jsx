import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ApiPost from "../../api/HttpApi";  


function PaintCalculator() {
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
    await ApiPost(Table, "AREA");
    console.log(Table);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.sendButtonText}>Wyślij</Text>
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
