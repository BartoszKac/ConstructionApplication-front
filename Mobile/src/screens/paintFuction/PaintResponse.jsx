import React from "react";
import { ScrollView, StyleSheet, Text, Linking, View, TouchableOpacity, Image } from "react-native";
import { usePaintData } from "../../contex/contex";

function PaintResponse() {
  const { paintData } = usePaintData();

  if (!paintData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Brak danych. Wróć i wyślij ponownie.</Text>
      </View>
    );
  }

  const { mapper, scraping } = paintData;

  const renderDetail = (key, value) => {
    // Sprawdzamy oba możliwe klucze dla zdjęć: "image" oraz "itemWebUrl"
    const isImageKey = key === "image"  || key === "image_imageUrl";
    const isImageUrl = typeof value === "string" && value.startsWith("http");
    
    // Warunek końcowy: czy to jest klucz zdjęcia i czy ma poprawny link
    const shouldRenderImage = isImageKey && isImageUrl;
    
    const isUrl = typeof value === "string" && (value.startsWith("http") || value.startsWith("www"));
    
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
      <View key={key} style={shouldRenderImage ? styles.imageWrapper : styles.detailRow}>
        <Text style={styles.detailKey}>{formattedKey}:</Text>
        
        {shouldRenderImage ? (
          <Image 
            source={{ uri: value }} 
            style={styles.productImage} 
            resizeMode="contain"
          />
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
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>{emptyMsg}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderSection("📊 Mapper (API Shop)", mapper, "Brak danych w mapperze")}
      <View style={styles.divider} />
      {renderSection("🔍 Scraping (Produkty)", scraping, "Brak danych w scrapingu")}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default PaintResponse;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingHorizontal: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  emptyText: { fontSize: 16, color: "#999", fontWeight: "500" },
  section: { marginTop: 20 },
  headerBadge: { backgroundColor: "#E9ECEF", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#212529" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 3, borderWidth: 1, borderColor: "#F1F3F5" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#F1F3F5" },
  detailKey: { fontWeight: "600", color: "#6C757D", fontSize: 13, flex: 1 },
  detailValue: { flex: 2, textAlign: "right", fontSize: 13, color: "#343A40" },
  linkText: { color: "#007AFF", textDecorationLine: "underline" },
  noDataText: { fontSize: 14, color: "#ADB5BD", fontStyle: "italic", marginLeft: 4 },
  divider: { height: 1, backgroundColor: "#DEE2E6", marginVertical: 10, opacity: 0.5 },
  imageWrapper: {
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1F3F5"
  },
  productImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: "#fff",
  }
});