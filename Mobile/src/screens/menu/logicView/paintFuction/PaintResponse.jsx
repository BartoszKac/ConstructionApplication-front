import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, Linking, View, TouchableOpacity, Image, Modal, FlatList, Alert } from "react-native";
import { usePaintData } from "../../../../contex/contex";
import { loadFolders, saveFolders } from "../../../../storage/StorageService";
import { useNavigation } from "@react-navigation/native";

function PaintResponse() {
  const { paintData } = usePaintData();
  const navigation = useNavigation();
  const [folders, setFolders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [productToSave, setProductToSave] = useState(null);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      const data = await loadFolders();
      setFolders(data || []);
    };
    fetchFolders();
  }, [isModalVisible]);

  const handleSaveToFolder = async (folderId) => {
    if (!productToSave) return;
    try {
      const allFolders = await loadFolders();
      const folderIdx = allFolders.findIndex(f => f.id === folderId);
      if (folderIdx !== -1) {
        const newProduct = {
          title: productToSave.title || "Farba",
          saveDate: new Date().toLocaleDateString('pl-PL'),
          mainImage: productToSave.image_imageUrl || null,
          allDetails: { ...productToSave }
        };
        const updatedFolders = [...allFolders];
        const currentSaved = updatedFolders[folderIdx].savedResults || [];
        updatedFolders[folderIdx].savedResults = [newProduct, ...currentSaved];
        await saveFolders(updatedFolders);
        setFolders(updatedFolders);
        Alert.alert("Sukces", "Produkt został zapisany!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalVisible(false);
      setProductToSave(null);
    }
  };

  const stats = useMemo(() => {
    if (!paintData) return { min: "---", count: 0, avg: "---" };
    const all = [...(paintData.scraping || []), ...(paintData.mapper || [])];
    const costs = all
      .map(item => parseFloat(item.calculated_cost))
      .filter(c => !isNaN(c) && c > 0);
    if (costs.length === 0) return { min: "---", count: all.length, avg: "---" };
    const min = Math.min(...costs);
    return { min: min.toFixed(2), count: all.length };
  }, [paintData]);

  const renderCard = (item, index) => {
    const cost = parseFloat(item.calculated_cost);
    const isBest = cost && cost.toFixed(2) === stats.min;
    const skipKeys = ["image_imageUrl", "itemWebUrl", "url", "itemId", "currency"];

    return (
      <View key={`${index}-${item.title}`} style={[styles.card, isBest && styles.bestCard]}>
        {/* POPRAWKA 1: Rzutowanie na Boolean !!isBest */}
        {!!isBest && (
          <View style={styles.bestBadge}>
            <Text style={styles.bestBadgeText}>NAJLEPSZA CENA PROJEKTU 🏆</Text>
          </View>
        )}
        
        {!!item.image_imageUrl && (
          <Image source={{ uri: item.image_imageUrl }} style={styles.productImage} resizeMode="contain" />
        )}

        <Text style={styles.productTitle}>{item.title || "Produkt"}</Text>
        <View style={styles.divider} />

        {Object.entries(item).map(([key, val]) => {
          if (skipKeys.includes(key) || typeof val === 'object' || val === null || val === undefined) return null;
          return (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.infoKey}>{key.replace(/_/g, ' ')}:</Text>
              {/* POPRAWKA 2: Stringi w jednej linii bez spacji przed/po klamrach */}
              <Text style={[styles.infoValue, key === 'calculated_cost' && styles.priceText]}>
                {val}{key === 'calculated_cost' ? ' PLN' : ''}
              </Text>
            </View>
          );
        })}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.linkBtn} onPress={() => {
              const target = item.url || item.itemWebUrl;
              if (target) Linking.openURL(target);
          }}>
            <Text style={styles.btnText}>🌐 Sklep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={() => { 
            setProductToSave(item); 
            setModalVisible(true); 
          }}>
            <Text style={styles.btnText}>💾 Zapisz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!paintData) return <View style={styles.center}><Text>Brak danych...</Text></View>;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerPanel}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Najniższy koszt</Text>
          {/* POPRAWKA 3: Bezpośrednie renderowanie bez spacji */}
          <Text style={styles.statValue}>{stats.min} PLN</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.sortBtn, isSorted && styles.activeSortBtn]} 
            onPress={() => setIsSorted(!isSorted)}
          >
            <Text style={styles.btnText}>{isSorted ? "📑 Grupowanie: ON" : "💰 Najtańsze: ON"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.analysisBtn} onPress={() => navigation.navigate("PaintAnalysisView")}>
            <Text style={styles.analysisText}>📊 ANALIZA</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {isSorted ? (
          <>
            <Text style={styles.sectionHeader}>💰 Posortowane według ceny całkowitej</Text>
            {[...(paintData.scraping || []), ...(paintData.mapper || [])]
              .sort((a, b) => parseFloat(a.calculated_cost) - parseFloat(b.calculated_cost))
              .map((item, i) => renderCard(item, i))}
          </>
        ) : (
          <>
            {/* POPRAWKA 4: Rzutowanie długości tablicy na Boolean */}
            {!!(paintData.scraping?.length > 0) && (
              <>
                <Text style={styles.sectionHeader}>🛒 Oferty z Marketów (Scraping)</Text>
                {paintData.scraping.map((item, i) => renderCard(item, i))}
              </>
            )}
            {!!(paintData.mapper?.length > 0) && (
              <>
                <Text style={[styles.sectionHeader, { marginTop: 20 }]}>🌎 Oferty Globalne (Ebay/API)</Text>
                {paintData.mapper.map((item, i) => renderCard(item, i))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Zapisz do projektu:</Text>
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.folderItem} onPress={() => handleSaveToFolder(item.id)}>
                  <Text style={styles.folderText}>📁 {item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.empty}>Najpierw stwórz folder w "Moje Projekty"</Text>}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}




const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F1F3F5" },
  headerPanel: { backgroundColor: "#fff", padding: 16, borderBottomWidth: 1, borderColor: '#ddd', elevation: 5 },
  statBox: { marginBottom: 12 },
  statLabel: { fontSize: 10, color: "#868E96", fontWeight: "bold", textTransform: 'uppercase' },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#2F9E44" },
  controls: { flexDirection: 'row', gap: 10 },
  sortBtn: { flex: 1, backgroundColor: "#868E96", padding: 12, borderRadius: 8, alignItems: "center" },
  activeSortBtn: { backgroundColor: "#2F9E44" },
  analysisBtn: { backgroundColor: "#5C7CFA", padding: 12, borderRadius: 8, justifyContent: 'center' },
  analysisText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  sectionHeader: { fontSize: 18, fontWeight: "800", marginBottom: 15, color: "#212529", borderLeftWidth: 4, borderLeftColor: '#5C7CFA', paddingLeft: 10 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20, elevation: 3 },
  bestCard: { borderWidth: 2, borderColor: "#2F9E44", backgroundColor: '#F8FFF9' },
  bestBadge: { backgroundColor: "#2F9E44", padding: 6, borderRadius: 6, marginBottom: 10 },
  bestBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold", textAlign: "center" },
  productImage: { width: "100%", height: 150, marginBottom: 12 },
  productTitle: { fontSize: 15, fontWeight: "bold", color: "#212529", marginBottom: 8 },
  divider: { height: 1, backgroundColor: "#E9ECEF", marginVertical: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 2 },
  infoKey: { color: "#868E96", fontSize: 11, textTransform: "capitalize" },
  infoValue: { fontSize: 12, fontWeight: "600", color: "#495057" },
  priceText: { color: "#E03131", fontSize: 14, fontWeight: "800" },
  buttonContainer: { flexDirection: "row", marginTop: 15, gap: 10 },
  linkBtn: { flex: 1, backgroundColor: "#339AF0", padding: 10, borderRadius: 8, alignItems: "center" },
  saveBtn: { flex: 1, backgroundColor: "#40C057", padding: 10, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "50%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  folderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  folderText: { fontSize: 16 },
  closeBtn: { marginTop: 15, alignItems: "center", padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});

export default PaintResponse;