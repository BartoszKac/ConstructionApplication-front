import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, Modal, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveFolders, loadFolders } from '../../../storage/StorageService';

function FolderDetailsView({ route, navigation }) {
  const { folderId, folderTitle } = route.params;
  const [images, setImages] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stan dla nowego Modala szczegółów
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const allFolders = await loadFolders();
    const folder = allFolders.find(f => f.id === folderId);
    if (folder) {
      setImages(folder.images || []);
      setSavedProducts(folder.savedResults || []);
    }
    setLoading(false);
  };

  const openDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      const allFolders = await loadFolders();
      const idx = allFolders.findIndex(f => f.id === folderId);
      allFolders[idx].images = [...(allFolders[idx].images || []), result.assets[0].uri];
      await saveFolders(allFolders);
      setImages(allFolders[idx].images);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>⬅</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{folderTitle}</Text>
      </View>

      {loading ? <ActivityIndicator size="large" style={{marginTop: 50}} color="#4CAF50"/> : (
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <Text style={styles.sectionLabel}>📸 GALERIA ZDJĘĆ</Text>
          <FlatList
            data={images}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(_, index) => `img-${index}`}
            renderItem={({item}) => <Image source={{uri: item}} style={styles.gridImg}/>}
            ListEmptyComponent={<Text style={styles.empty}>Brak zdjęć w tym folderze</Text>}
          />

          <Text style={styles.sectionLabel}>🎨 ZAPISANE FARBY I PRODUKTY</Text>
          {savedProducts.map((item, index) => (
            <TouchableOpacity key={index} style={styles.prodCard} onPress={() => openDetails(item)}>
              <View style={{flex: 1}}>
                <Text style={styles.prodTitle}>{item.title}</Text>
                <Text style={styles.prodDate}>Zapisano: {item.saveDate}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>Szczegóły AI 🔍</Text></View>
              </View>
              {item.mainImage && <Image source={{uri: item.mainImage}} style={styles.prodImg}/>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* MODAL ZE SZCZEGÓŁAMI PRODUKTU */}
      <Modal visible={detailModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Szczegóły produktu</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedProduct && (
              <ScrollView style={styles.modalScroll}>
                {selectedProduct.mainImage && (
                   <Image source={{uri: selectedProduct.mainImage}} style={styles.modalBigImg} resizeMode="contain" />
                )}
                
                <Text style={styles.modalProdName}>{selectedProduct.title}</Text>
                
                <View style={styles.detailsBox}>
                  {Object.entries(selectedProduct.allDetails).map(([key, value]) => {
                    // Pomijamy zdjęcia w liście tekstowej
                    if (key.includes('image') || typeof value === 'object') return null;
                    return (
                      <View key={key} style={styles.detailRow}>
                        <Text style={styles.detailKey}>{key.replace(/_/g, ' ')}:</Text>
                        <Text style={styles.detailValue}>{String(value)}</Text>
                      </View>
                    );
                  })}
                </View>

                {selectedProduct.allDetails.itemWebUrl && (
                  <TouchableOpacity 
                    style={styles.linkBtn} 
                    onPress={() => Linking.openURL(selectedProduct.allDetails.itemWebUrl)}
                  >
                    <Text style={styles.linkBtnText}>Zobacz w sklepie 🌐</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={addImage}>
        <Text style={styles.fabText}>+ Zdjęcie</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  back: { fontSize: 24, color: '#4CAF50', marginRight: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  sectionLabel: { padding: 15, fontWeight: '800', color: '#7f8c8d', backgroundColor: '#f1f1f1', fontSize: 12, letterSpacing: 1 },
  gridImg: { width: '33.3%', height: 110, borderWidth: 1, borderColor: '#fff' },
  prodCard: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginHorizontal: 10, marginTop: 10, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  prodTitle: { fontWeight: 'bold', fontSize: 16, color: '#2c3e50' },
  prodDate: { fontSize: 12, color: '#95a5a6', marginTop: 2 },
  badge: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  badgeText: { color: '#4CAF50', fontSize: 11, fontWeight: 'bold' },
  prodImg: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#f9f9f9' },
  empty: { textAlign: 'center', padding: 40, color: '#bdc3c7' },
  fab: { position: 'absolute', bottom: 25, right: 20, backgroundColor: '#4CAF50', paddingHorizontal: 20, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontWeight: 'bold' },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '85%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  closeX: { fontSize: 22, color: '#999', fontWeight: 'bold' },
  modalScroll: { flex: 1 },
  modalBigImg: { width: '100%', height: 200, marginBottom: 15 },
  modalProdName: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, textAlign: 'center' },
  detailsBox: { backgroundColor: '#f8f9fa', borderRadius: 15, padding: 15, marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  detailKey: { color: '#7f8c8d', fontSize: 13, textTransform: 'capitalize', flex: 1 },
  detailValue: { color: '#2c3e50', fontSize: 13, fontWeight: '600', flex: 1.5, textAlign: 'right' },
  linkBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  linkBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default FolderDetailsView;