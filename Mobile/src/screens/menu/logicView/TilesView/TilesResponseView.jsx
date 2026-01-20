import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Image, Linking, Modal, Pressable, FlatList, Alert 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
// Importy Twoich serwisów
import { loadFolders, saveFolders } from "../../../../storage/StorageService";

function TilesResponseView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { results, projectInfo } = route.params || { results: [], projectInfo: {} };

  // STAN DLA PODGLĄDU SZCZEGÓŁÓW
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);

  // STAN DLA ZAPISYWANIA DO FOLDERÓW
  const [folders, setFolders] = useState([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [productToSave, setProductToSave] = useState(null);

  // Ładowanie folderów przy montowaniu komponentu
  useEffect(() => {
    const fetchFolders = async () => {
      const data = await loadFolders();
      setFolders(data || []);
    };
    fetchFolders();
  }, [saveModalVisible]);

  const openDetails = (item) => {
    setSelectedTile(item);
    setDetailModalVisible(true);
  };

  const openSaveModal = (item) => {
    setProductToSave(item);
    setSaveModalVisible(true);
  };

  const handleSaveToFolder = async (folderId) => {
    if (!productToSave) return;
    try {
      const allFolders = await loadFolders();
      const folderIdx = allFolders.findIndex(f => f.id === folderId);
      
      if (folderIdx !== -1) {
        const newProduct = {
          title: productToSave.title || "Płytka ceramiczna",
          saveDate: new Date().toLocaleDateString('pl-PL'),
          mainImage: productToSave.image || null,
          allDetails: { 
            ...productToSave, 
            projectFormat: projectInfo.size,
            projectArea: projectInfo.grossArea 
          }
        };

        const updatedFolders = [...allFolders];
        const currentSaved = updatedFolders[folderIdx].savedResults || [];
        updatedFolders[folderIdx].savedResults = [newProduct, ...currentSaved];

        await saveFolders(updatedFolders);
        Alert.alert("Sukces", "Płytki zostały zapisane do folderu!");
      }
    } catch (error) {
      console.error("Błąd zapisu:", error);
      Alert.alert("Błąd", "Nie udało się zapisać produktu.");
    } finally {
      setSaveModalVisible(false);
      setProductToSave(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* MODAL 1: SZCZEGÓŁY PŁYTKI */}
      <Modal animationType="slide" transparent={true} visible={detailModalVisible} onRequestClose={() => setDetailModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setDetailModalVisible(false)}>
          <View style={styles.detailCard}>
            <Image source={{ uri: selectedTile?.image || 'https://via.placeholder.com/150' }} style={styles.modalBigImage} />
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{selectedTile?.title}</Text>
              <View style={styles.modalGrid}>
                <View style={styles.modalStat}><Text style={styles.statLabel}>CENA / M²</Text><Text style={styles.statValue}>{selectedTile?.price_per_m2} zł</Text></View>
                <View style={styles.modalStat}><Text style={styles.statLabel}>ILOŚĆ</Text><Text style={styles.statValue}>{selectedTile?.pieces_needed} szt.</Text></View>
              </View>
              <View style={styles.modalTotalBox}>
                <Text style={styles.totalBoxLabel}>KOSZT CAŁKOWITY</Text>
                <Text style={styles.totalBoxValue}>{selectedTile?.total_project_cost} zł</Text>
              </View>
              <View style={styles.modalActions}>
                 <TouchableOpacity style={styles.modalSaveBtn} onPress={() => { setDetailModalVisible(false); openSaveModal(selectedTile); }}>
                    <Text style={styles.modalSaveBtnText}>💾 ZAPISZ DO PROJEKTU</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.modalShopBtn} onPress={() => Linking.openURL(selectedTile?.url)}>
                    <Text style={styles.modalShopBtnText}>SKLEP ❯</Text>
                 </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* MODAL 2: WYBÓR FOLDERU (Z Twojego przykładu) */}
      <Modal visible={saveModalVisible} transparent animationType="fade">
        <View style={styles.saveModalOverlay}>
          <View style={styles.saveModalContent}>
            <Text style={styles.saveModalTitle}>Wybierz folder:</Text>
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.folderItem} onPress={() => handleSaveToFolder(item.id)}>
                  <Text style={styles.folderText}>📁 {item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Brak folderów. Stwórz folder w "Moje Projekty".</Text>}
            />
            <TouchableOpacity onPress={() => setSaveModalVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* HEADER I LISTA */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtnText}>❮ POWRÓT</Text></TouchableOpacity>
        <Text style={styles.topBarTitle}>WYNIKI DLA {projectInfo.size}</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.projectSummaryCard}>
          <View style={styles.infoColumn}><Text style={styles.infoLabel}>FORMAT</Text><Text style={styles.infoValue}>{projectInfo.size}</Text></View>
          <View style={styles.verticalDivider} />
          <View style={styles.infoColumn}><Text style={styles.infoLabel}>METRAŻ</Text><Text style={styles.infoValue}>{projectInfo.grossArea} m²</Text></View>
        </View>

        {results && results.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <TouchableOpacity onPress={() => openDetails(item)} style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.tileImage} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.tileTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.pricePer}>{item.price_per_m2} zł/m²</Text>
              <Text style={styles.totalValCard}>{item.total_project_cost} zł</Text>
            </View>
            <TouchableOpacity style={styles.cardSaveIcon} onPress={() => openSaveModal(item)}>
               <Text style={{fontSize: 20}}>💾</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1, paddingHorizontal: 16 },
  // ... Style headera i kart ...
  topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  backBtnText: { color: '#4C6EF5', fontWeight: 'bold' },
  topBarTitle: { fontWeight: 'bold', color: '#333' },
  projectSummaryCard: { backgroundColor: '#212529', borderRadius: 15, flexDirection: 'row', padding: 15, marginVertical: 15 },
  infoColumn: { flex: 1, alignItems: 'center' },
  infoLabel: { color: '#adb5bd', fontSize: 10 },
  infoValue: { color: '#FFC107', fontWeight: 'bold', fontSize: 16 },
  verticalDivider: { width: 1, backgroundColor: '#444' },

  itemCard: { backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  imageWrapper: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden' },
  tileImage: { width: '100%', height: '100%' },
  textContainer: { flex: 1, marginLeft: 12 },
  tileTitle: { fontWeight: 'bold', fontSize: 13 },
  pricePer: { color: '#888', fontSize: 11 },
  totalValCard: { fontWeight: 'bold', color: '#4C6EF5' },
  cardSaveIcon: { padding: 10 },

  // MODAL SZCZEGÓŁÓW
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  detailCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalBigImage: { width: '100%', height: 200 },
  modalBody: { padding: 20 },
  modalTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 15 },
  modalGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 10, color: '#aaa' },
  statValue: { fontWeight: 'bold', fontSize: 14 },
  modalTotalBox: { backgroundColor: '#f1f3f5', padding: 15, borderRadius: 10, marginVertical: 15, alignItems: 'center' },
  totalBoxValue: { fontSize: 20, fontWeight: 'bold', color: '#4C6EF5' },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalSaveBtn: { flex: 2, backgroundColor: '#4C6EF5', padding: 12, borderRadius: 8, alignItems: 'center' },
  modalShopBtn: { flex: 1, backgroundColor: '#212529', padding: 12, borderRadius: 8, alignItems: 'center' },
  modalSaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  modalShopBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },

  // MODAL ZAPISU (TEN OD FOLDERÓW)
  saveModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  saveModalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '70%' },
  saveModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  folderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  folderText: { fontSize: 16 },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  cancelBtnText: { color: 'red', fontWeight: 'bold' }
});

export default TilesResponseView;