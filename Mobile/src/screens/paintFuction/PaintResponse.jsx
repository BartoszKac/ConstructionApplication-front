import { ScrollView, StyleSheet, Text, Linking, View } from "react-native";
import { usePaintData } from "../../contex/contex";

function PaintResponse() {
  const { paintData } = usePaintData(); // pobierz dane z contextu

  if (!paintData) {
      console.log("Brak danych paintData w kontekście");
      console.log(paintData);
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Brak danych. Wróć i wyślij ponownie.
        </Text>
      </View>
    );
  }

  // Zakładamy, że paintData zawiera mapper i scraping
  const { mapper, scraping } = paintData;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Mapper (API Shop):</Text>
      {mapper && mapper.length > 0 ? (
        mapper.map((item, index) => (
          <View key={`mapper-${index}`} style={styles.itemContainer}>
            {Object.entries(item).map(([key, value]) => (
              <View key={key} style={styles.detailItem}>
                <Text style={styles.detailKey}>{key}:</Text>
                <Text style={styles.detailValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.text}>Brak danych w mapper</Text>
      )}

      <Text style={styles.sectionTitle}>Scraping (Produkty):</Text>
      {scraping && scraping.length > 0 ? (
        scraping.map((item, index) => (
          <View key={`scraping-${index}`} style={styles.itemContainer}>
            {Object.entries(item).map(([key, value]) => (
              <View key={key} style={styles.detailItem}>
                <Text style={styles.detailKey}>{key}:</Text>
                <Text style={styles.detailValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.text}>Brak danych w scraping</Text>
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

export default PaintResponse;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#777" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 10, marginBottom: 4 },
  itemContainer: { marginBottom: 12, padding: 8, backgroundColor: "#f5f5f5", borderRadius: 6 },
  detailItem: { flexDirection: "row", flexWrap: "wrap", marginVertical: 2 },
  detailKey: { fontWeight: "600", marginRight: 4 },
  detailValue: { flexShrink: 1 },
  text: { fontSize: 14, color: "#333", marginBottom: 4 },
});
