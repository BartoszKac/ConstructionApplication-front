import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, Alert, SafeAreaView } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import * as ImagePicker from 'expo-image-picker';
import ApiPost from '../../../api/HttpApi';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ARPreview() {
  const [originalUri, setOriginalUri] = useState(null);
  const [masks, setMasks] = useState([]); // Przechowuje wiele masek (każda może mieć inny kolor)
  const [loading, setLoading] = useState(false);
  const [hexColor, setHexColor] = useState('#960000');
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [layoutSize, setLayoutSize] = useState({ w: 0, h: 0 });
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setOriginalUri(uri);
      setMasks([]);
      handleInitialize(uri);
    }
  };

  const handleInitialize = async (uri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri, name: 'room.jpg', type: 'image/jpeg' });
      const response = await ApiPost(formData, "INITPAINT", true);
      if (response.w && response.h) {
        setImgSize({ w: response.w, h: response.h });
      }
    } catch (error) {
      Alert.alert("Błąd", "AI nie odpowiada.");
      setOriginalUri(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (event) => {
    if (!originalUri || loading || imgSize.w === 0) return;
    const { locationX, locationY } = event.nativeEvent;
    
    // Obliczanie skali względem oryginalnego zdjęcia
    const scaleX = imgSize.w / layoutSize.w;
    const scaleY = imgSize.h / layoutSize.h;

    try {
      setLoading(true);
      const data = { 
        x: Math.round(locationX * scaleX), 
        y: Math.round(locationY * scaleY), 
        color: hexToBGRA(hexColor) // Wysyłamy aktualnie wybrany kolor do backendu
      };
      
      const response = await ApiPost(data, "PAINT", true);
      
      if (response?.mask_base64) {
        // Dodajemy nową maskę do tablicy (nie zastępujemy poprzednich)
        setMasks(prev => [...prev, `data:image/png;base64,${response.mask_base64}`]);
      }
    } catch (e) { 
      console.log("Błąd malowania", e); 
    } finally {
      setLoading(false);
    }
  };

  // Funkcja konwertująca Hex na format BGRA dla OpenCV w Pythonie
  const hexToBGRA = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Zwracamy tablicę [B, G, R, Alpha] - istotna kolejność dla Twojego backendu
    return [b, g, r, 160]; 
  };

  // Funkcja cofania ostatniej zmiany
  const handleUndo = () => {
    setMasks(prev => prev.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* GÓRNY PASEK */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => { setOriginalUri(null); setMasks([]); }}>
          <Ionicons name="close-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topColorInfo}>
            <View style={[styles.tinyColor, {backgroundColor: hexColor}]} />
            <Text style={styles.topTitle}>Malowanie wielokolorowe</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={handleUndo} style={{marginRight: 15}}>
            <Ionicons name="arrow-undo-outline" size={24} color={masks.length > 0 ? "#fff" : "#444"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMasks([])}>
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* KANWA ZDJĘCIA */}
      <View style={styles.mainWorkArea}>
        {originalUri ? (
          <TouchableOpacity 
            style={styles.canvasContainer} 
            activeOpacity={1} 
            onPress={handlePress}
            onLayout={(e) => setLayoutSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
          >
            <Image source={{ uri: originalUri }} style={styles.fullImage} resizeMode="stretch" />
            {masks.map((m, i) => (
              <Image key={i} source={{ uri: m }} style={[styles.fullImage, styles.overlay]} resizeMode="stretch" />
            ))}
            {loading && (
              <View style={styles.loaderBg}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.emptyContainer} onPress={pickImage}>
            <Ionicons name="image-outline" size={60} color="#333" />
            <Text style={styles.emptyText}>Kliknij, aby wgrać zdjęcie pokoju</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* UCHWYT PANELU */}
      <TouchableOpacity 
        style={styles.toggleBar} 
        onPress={() => setIsPanelVisible(!isPanelVisible)}
      >
        <Ionicons 
          name={isPanelVisible ? "chevron-down" : "chevron-up"} 
          size={20} 
          color="#888" 
        />
      </TouchableOpacity>

      {/* PANEL STEROWANIA */}
      {isPanelVisible && (
        <View style={styles.integratedControls}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <ColorPicker
                color={hexColor}
                onColorChange={setHexColor}
                thumbSize={20}
                sliderSize={20}
                noSnap
              />
            </View>

            <View style={styles.sideActions}>
              <Text style={styles.label}>AKTYWNY:</Text>
              <View style={[styles.activeColorPreview, { backgroundColor: hexColor }]} />
              <Text style={styles.hexLabel}>{hexColor.toUpperCase()}</Text>
              
              <TouchableOpacity style={styles.miniBtn} onPress={pickImage}>
                <Ionicons name="camera" size={18} color="#fff" />
                <Text style={styles.miniBtnText}>ZMIEŃ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1a1a1a' },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  topColorInfo: { flexDirection: 'row', alignItems: 'center' },
  tinyColor: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  topTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  mainWorkArea: { flex: 1, backgroundColor: '#000' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#444', marginTop: 15, fontSize: 14 },

  canvasContainer: { flex: 1 },
  fullImage: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', top: 0, left: 0 },
  loaderBg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },

  toggleBar: { backgroundColor: '#1a1a1a', alignItems: 'center', paddingVertical: 5, borderTopWidth: 1, borderTopColor: '#333' },

  integratedControls: { backgroundColor: '#1a1a1a', padding: 15 },
  pickerRow: { flexDirection: 'row', height: 160, alignItems: 'center' },
  pickerContainer: { flex: 1.2, height: '100%' },
  sideActions: { flex: 0.8, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#333' },
  
  label: { color: '#555', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  activeColorPreview: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#fff' },
  hexLabel: { color: '#fff', fontSize: 11, marginTop: 5, fontFamily: 'monospace' },
  
  miniBtn: { backgroundColor: '#333', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  miniBtnText: { color: '#fff', fontSize: 10, marginLeft: 5, fontWeight: 'bold' }
});

export default ARPreview;