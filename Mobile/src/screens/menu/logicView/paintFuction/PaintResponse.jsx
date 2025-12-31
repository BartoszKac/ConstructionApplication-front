import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, Linking, View, TouchableOpacity, Image, Modal, FlatList, Alert } from "react-native";
import { usePaintData } from "../../../../contex/contex";
import { loadFolders, saveFolders } from "../../../../storage/StorageService";

function PaintResponse() {
  const { paintData } = usePaintData();
  const [folders, setFolders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [productToSave, setProductToSave] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      const data = await loadFolders();
      setFolders(data || []);
    };
    fetchFolders();
  }, []);

  if (!paintData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Brak danych. Wróć i wyślij ponownie.</Text>
      </View>
    );
  }

  const { mapper, scraping } = paintData;

  const handleSaveToFolder = async (folderId) => {
    try {
      const allFolders = await loadFolders();
      const folderIndex = allFolders.findIndex(f => f.id === folderId);

      if (folderIndex !== -1) {
        if (!allFolders[folderIndex].savedResults) {
          allFolders[folderIndex].savedResults = [];
        }
        
        // Zapisujemy WSZYSTKIE detale produktu
        allFolders[folderIndex].savedResults.push({
          id: Date.now().toString(),
          saveDate: new Date().toLocaleDateString('pl-PL'),
          allDetails: productToSave, // Pełny obiekt ze wszystkimi kluczami
          title: productToSave.name || productToSave.title || "Produkt AI",
          mainImage: productToSave.image || productToSave.image_imageUrl
        });

        await saveFolders(allFolders);
        Alert.alert("Sukces", "Produkt i wszystkie jego detale zostały zapisane!");
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zapisać.");
    }
  };

  const renderDetail = (key, value) => {
    const isImageKey = key === "image" || key === "image_imageUrl";
    const isImageUrl = typeof value === "string" && value.startsWith("http");
    const shouldRenderImage = isImageKey && isImageUrl;
    const isUrl = typeof value === "string" && (value.startsWith("http") || value.startsWith("www"));
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
      <View key={key} style={shouldRenderImage ? styles.imageWrapper : styles.detailRow}>
        <Text style={styles.detailKey}>{formattedKey}:</Text>
        {shouldRenderImage ? (
          <Image source={{ uri: value }} style={styles.productImage} resizeMode="contain" />
        ) : isUrl ? (
          <TouchableOpacity onPress={() => Linking.openURL(value)} style={{ flex: 2 }}>
            <Text style={[styles.detailValue, styles.linkText]}>{value}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.detailValue}>{String(value)}</Text>
        )}
      </View>
    );
  };

  const renderSection = (title, data, emptyMsg) => (
    <View style={styles.section}>
      <View style={styles.headerBadge}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <View key={`${title}-${index}`} style={styles.card}>
            {Object.entries(item).map(([key, value]) => renderDetail(key, value))}
            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={() => {
                setProductToSave(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.saveBtnText}>💾 Zapisz wszystkie szczegóły</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>{emptyMsg}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderSection("📊 Mapper (API Shop)", mapper, "Brak danych")}
        <View style={styles.divider} />
        {renderSection("🔍 Scraping (Produkty)", scraping, "Brak danych")}
        <View style={{ height: 60 }} />
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Wybierz folder</Text>
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.folderItem} onPress={() => handleSaveToFolder(item.id)}>
                  <Text style={styles.folderItemText}>📁 {item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingHorizontal: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999" },
  section: { marginTop: 20 },
  headerBadge: { backgroundColor: "#E9ECEF", padding: 8, borderRadius: 8, alignSelf: 'flex-start' },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 15, elevation: 3 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  detailKey: { fontWeight: "600", color: "#6C757D", flex: 1, fontSize: 12 },
  detailValue: { flex: 2, textAlign: "right", fontSize: 12 },
  linkText: { color: "#007AFF" },
  imageWrapper: { alignItems: "center", marginVertical: 10 },
  productImage: { width: 200, height: 200 },
  saveBtn: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8, marginTop: 10, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20, maxHeight: '80%' },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  folderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  folderItemText: { fontSize: 16 },
  closeBtn: { marginTop: 15, alignItems: 'center' },
  closeBtnText: { color: 'red', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: "#DEE2E6", marginVertical: 10 }
});

export default PaintResponse;