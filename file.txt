import { ScrollView, StyleSheet, Text, Linking, View } from "react-native";
import { usePaintData } from "../../contex/contex";

function PaintResponse() {
      console.log("=== PaintResponse ===");

  const { paintData } = usePaintData(); // 👈 pobierz dane z contextu
  
  console.log("=== PaintResponse ===");
  console.log("paintData:", paintData);

  // Jeśli brak danych
  if (!paintData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Brak danych. Wróć i wyślij ponownie.
        </Text>
      </View>
    );
  }

  const {
    title,
    shortDescription,
    price,
    categoryPath,
    itemWebUrl,
    paintProduct,
  } = paintData;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title || "Brak tytułu"}</Text>

      <Text style={styles.price}>
        💲{price?.value || "?"} {price?.currency || "?"}
      </Text>

      <Text style={styles.sectionTitle}>Opis:</Text>
      <Text style={styles.text}>{shortDescription || "Brak opisu"}</Text>

      <Text style={styles.sectionTitle}>Kategoria:</Text>
      <Text style={styles.text}>{categoryPath || "Brak"}</Text>

      <Text style={styles.sectionTitle}>Szczegóły produktu:</Text>

      {paintProduct && Object.entries(paintProduct).map(([key, value]) => (
        <View key={key} style={styles.detailItem}>
          <Text style={styles.detailKey}>{key}:</Text>
          <Text style={styles.detailValue}>{String(value)}</Text>
        </View>
      ))}

      {itemWebUrl && (
        <Text style={styles.link} onPress={() => Linking.openURL(itemWebUrl)}>
          🔗 Zobacz na eBay
        </Text>
      )}
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

export default PaintResponse;

// style bez zmian...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#777" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 18, color: "#007AFF", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  text: { fontSize: 14, color: "#333", marginBottom: 8 },
  detailItem: { flexDirection: "row", marginVertical: 4, flexWrap: "wrap" },
  detailKey: { fontWeight: "600", marginRight: 4 },
  detailValue: { flexShrink: 1 },
  link: { color: "#007AFF", marginTop: 20, fontSize: 16 },
});
