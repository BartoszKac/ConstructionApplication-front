import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Modal, 
  TextInput, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { saveFolders, loadFolders } from '../../../storage/StorageService';

// KLUCZOWA POPRAWKA: Dodano { navigation } w parametrach funkcji
function MyNoteView({ navigation }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState('');

  // Ładowanie folderów z pamięci przy starcie
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const savedData = await loadFolders();
        if (savedData) setFolders(savedData);
      } catch (error) {
        console.error("Błąd podczas wczytywania:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  // Tworzenie nowego folderu
  const addFolder = async () => {
    if (newFolderTitle.trim() === '') return;
    
    const newFolder = {
      id: Date.now().toString(),
      title: newFolderTitle,
      date: new Date().toLocaleDateString('pl-PL'),
      images: [] // Pusta lista na przyszłe zdjęcia
    };

    const updatedFolders = [newFolder, ...folders];
    setFolders(updatedFolders);
    await saveFolders(updatedFolders);
    
    setNewFolderTitle('');
    setModalVisible(false);
  };

  // Usuwanie folderu z potwierdzeniem
  const deleteFolder = (id, title) => {
    Alert.alert(
      "Usuń projekt",
      `Czy na pewno chcesz usunąć folder "${title}"?`,
      [
        { text: "Anuluj", style: "cancel" },
        { 
          text: "Usuń", 
          style: "destructive", 
          onPress: async () => {
            const updatedFolders = folders.filter(f => f.id !== id);
            setFolders(updatedFolders);
            await saveFolders(updatedFolders);
          } 
        }
      ]
    );
  };

  // Wygląd pojedynczego elementu na liście
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      // Przejście do widoku szczegółów folderu
      onPress={() => navigation.navigate('FolderDetails', { 
        folderId: item.id, 
        folderTitle: item.title 
      })} 
      onLongPress={() => deleteFolder(item.id, item.title)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.icon}>📁</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>Utworzono: {item.date}</Text>
        </View>
      </View>
      <Text style={styles.arrow}>➡️</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Moje Projekty</Text>
        
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : (
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Brak folderów. Kliknij przycisk poniżej.</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {/* Przycisk dodawania na dole */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Nowy Folder Projektu</Text>
        </TouchableOpacity>
      </View>

      {/* Okno tworzenia folderu */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeader}>Stwórz nowy folder</Text>
            <TextInput
              style={styles.input}
              placeholder="Nazwa projektu..."
              value={newFolderTitle}
              onChangeText={setNewFolderTitle}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addFolder} style={styles.saveBtn}>
                <Text style={styles.saveText}>Stwórz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: '800', color: '#212529', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textContainer: { flex: 1, marginRight: 10 },
  icon: { fontSize: 26, marginRight: 15 },
  title: { fontSize: 16, fontWeight: '700', color: '#343A40' },
  date: { fontSize: 12, color: '#ADB5BD', marginTop: 4 },
  arrow: { fontSize: 18, color: '#CCC' },
  addBtn: { 
    position: 'absolute', 
    bottom: 30, 
    left: 20, 
    right: 20, 
    backgroundColor: '#4CAF50', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 4 
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    padding: 25 
  },
  modalBox: { backgroundColor: '#fff', padding: 25, borderRadius: 20 },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#212529' },
  input: { 
    backgroundColor: '#F1F3F5', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    fontSize: 16 
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  cancelBtn: { padding: 10, marginRight: 20 },
  cancelText: { color: '#6C757D', fontWeight: '600' },
  saveBtn: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 10, 
    paddingHorizontal: 25, 
    borderRadius: 10 
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { textAlign: 'center', color: '#ADB5BD' }
});

export default MyNoteView;