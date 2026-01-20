import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Linking } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { usePaintData } from "../../../../contex/contex";

const screenWidth = Dimensions.get("window").width;

function PaintAnalysis() {
  const { paintData } = usePaintData();

  const safeParse = (val) => {
    if (val === undefined || val === null) return 0;
    const cleaned = val.toString().replace(',', '.').replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleOpenLink = (item) => {
    const url = item.url || item.itemWebUrl;
    if (url) {
      Linking.openURL(url).catch(() => alert("Nie można otworzyć linku"));
    }
  };

  const stats = useMemo(() => {
    if (!paintData) return null;

    const scraping = paintData.scraping || [];
    const mapper = paintData.mapper || [];
    const getVal = (item) => safeParse(item.calculated_cost);

    const validScraping = scraping.filter(i => getVal(i) > 0);
    const validMapper = mapper.filter(i => getVal(i) > 0);

    const bestLocal = validScraping.length > 0 ? [...validScraping].sort((a, b) => getVal(a) - getVal(b))[0] : null;
    const bestGlobal = validMapper.length > 0 ? [...validMapper].sort((a, b) => getVal(a) - getVal(b))[0] : null;

    const topLocal = [...validScraping].sort((a, b) => getVal(a) - getVal(b)).slice(0, 3);
    const topGlobal = [...validMapper].sort((a, b) => getVal(a) - getVal(b)).slice(0, 3);
    const chartItems = [...topLocal, ...topGlobal];

    return { 
      chartData: {
        labels: chartItems.map((_, i) => `#${i + 1}`),
        datasets: [{ data: chartItems.map(getVal) }]
      },
      chartItems,
      avgLocal: validScraping.reduce((acc, curr) => acc + getVal(curr), 0) / (validScraping.length || 1),
      avgGlobal: validMapper.reduce((acc, curr) => acc + getVal(curr), 0) / (validMapper.length || 1),
      bestLocal,
      bestGlobal
    };
  }, [paintData]);

  if (!stats) return <View style={styles.center}><Text>Brak danych</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analiza Produktowa</Text>

      {/* MODUŁ 1: WIZUALNI LIDERZY CENOWI (Klikalni) */}
      <View style={styles.leadersRow}>
        <TouchableOpacity 
          style={[styles.leaderCard, { borderTopColor: '#339AF0' }]}
          onPress={() => handleOpenLink(stats.bestLocal)}
        >
          <Text style={[styles.leaderTag, { color: '#339AF0' }]}>NAJTAŃSZA LOKALNIE 🌐</Text>
          {stats.bestLocal ? (
            <View style={styles.leaderContent}>
              <Image source={{ uri: stats.bestLocal.image_imageUrl }} style={styles.leaderImg} resizeMode="contain" />
              <Text style={styles.leaderPrice}>{safeParse(stats.bestLocal.calculated_cost).toFixed(2)} zł</Text>
              <Text numberOfLines={1} style={styles.leaderName}>{stats.bestLocal.title}</Text>
            </View>
          ) : <Text>Brak</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.leaderCard, { borderTopColor: '#51CF66' }]}
          onPress={() => handleOpenLink(stats.bestGlobal)}
        >
          <Text style={[styles.leaderTag, { color: '#51CF66' }]}>NAJTAŃSZA GLOBALNIE 🌐</Text>
          {stats.bestGlobal ? (
            <View style={styles.leaderContent}>
              <Image source={{ uri: stats.bestGlobal.image_imageUrl }} style={styles.leaderImg} resizeMode="contain" />
              <Text style={[styles.leaderPrice, { color: '#2B8A3E' }]}>{safeParse(stats.bestGlobal.calculated_cost).toFixed(2)} zł</Text>
              <Text numberOfLines={1} style={styles.leaderName}>{stats.bestGlobal.title}</Text>
            </View>
          ) : <Text>Brak</Text>}
        </TouchableOpacity>
      </View>

      {/* MODUŁ 2: WYKRES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ZESTAWIENIE TOP 6 PROJEKTÓW</Text>
        <BarChart
          data={stats.chartData}
          width={screenWidth - 40}
          height={200}
          chartConfig={barConfig}
          fromZero
          showValuesOnTopOfBars
        />

        {/* LEGENDA ZE ZDJĘCIAMI I LINKAMI */}
        <View style={styles.visualLegend}>
          {stats.chartItems.map((item, index) => {
            const isLocal = paintData.scraping?.some(s => s.title === item.title);
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.legendItem, { borderLeftColor: isLocal ? '#339AF0' : '#51CF66' }]}
                onPress={() => handleOpenLink(item)}
              >
                <Text style={styles.legendIdx}>#{index + 1}</Text>
                <Image source={{ uri: item.image_imageUrl }} style={styles.legendMiniImg} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.legendTitleText}>{item.title}</Text>
                  <Text style={styles.legendSubText}>
                    {isLocal ? "Market" : "Global"} • {safeParse(item.calculated_cost).toFixed(2)} zł • Kliknij, by przejść
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* MODUŁ 3: ŚREDNIE */}
      <View style={styles.summaryContainer}>
         <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Średnia Lokalnie</Text>
            <Text style={[styles.summaryValue, {color: '#339AF0'}]}>{stats.avgLocal.toFixed(2)} zł</Text>
         </View>
         <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Średnia Globalnie</Text>
            <Text style={[styles.summaryValue, {color: '#51CF66'}]}>{stats.avgGlobal.toFixed(2)} zł</Text>
         </View>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const barConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F3F5", padding: 15 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#212529" },
  leadersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  leaderCard: { backgroundColor: '#fff', width: '48%', borderRadius: 15, padding: 12, elevation: 4, borderTopWidth: 5 },
  leaderTag: { fontSize: 8, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  leaderContent: { alignItems: 'center' },
  leaderImg: { width: 80, height: 80, marginBottom: 10 },
  leaderPrice: { fontSize: 18, fontWeight: '900', color: '#E03131' },
  leaderName: { fontSize: 11, color: '#495057', marginTop: 5 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 15, elevation: 5 },
  cardTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#adb5bd' },
  visualLegend: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#f1f3f5', paddingTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingLeft: 10, borderLeftWidth: 4, backgroundColor: '#f8f9fa', padding: 8, borderRadius: 8 },
  legendIdx: { fontWeight: 'bold', fontSize: 14, color: '#adb5bd', marginRight: 10 },
  legendMiniImg: { width: 40, height: 40, borderRadius: 5, marginRight: 12 },
  legendTitleText: { fontSize: 12, fontWeight: '600', color: '#212529' },
  legendSubText: { fontSize: 10, color: '#868E96' },
  summaryContainer: { flexDirection: 'row', marginTop: 20, gap: 15 },
  summaryBox: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 2, alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: 'bold', color: '#868E96', marginBottom: 5 },
  summaryValue: { fontSize: 17, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});

export default PaintAnalysis;