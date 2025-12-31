import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ApiPost from '../../../api/HttpApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ARPreview() {
  const [originalUri, setOriginalUri] = useState(null);
  const [masks, setMasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // KLUCZOWE DANE DO SKALOWANIA
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 }); // Rozmiar zdjęcia z serwera
  const [layoutSize, setLayoutSize] = useState({ w: 0, h: 0 }); // Rozmiar kontenera na ekranie

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      
      // Serwer zwraca nam realne wymiary zdjęcia, które zapisał w pamięci
      if (response.w && response.h) {
        setImgSize({ w: response.w, h: response.h });
      }
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się połączyć z AI.");
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (event) => {
    if (!originalUri || loading || imgSize.w === 0) return;

    const { locationX, locationY } = event.nativeEvent;

    // PRECYZYJNE SKALOWANIE
    // Przeliczamy współrzędną z ekranu na realny piksel zdjęcia na serwerze
    const scaleX = imgSize.w / layoutSize.w;
    const scaleY = imgSize.h / layoutSize.h;

    const realX = Math.round(locationX * scaleX);
    const realY = Math.round(locationY * scaleY);

    console.log(`Klik: ${locationX},${locationY} | Skala: ${scaleX.toFixed(2)} | Real: ${realX},${realY}`);

    try {
      const data = { x: realX, y: realY };
      const response = await ApiPost(data, "PAINT", true);
      
      if (response && response.mask_base64) {
        setMasks(prev => [...prev, `data:image/png;base64,${response.mask_base64}`]);
      }
    } catch (error) {
      console.log("Paint error");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.canvasContainer} 
        activeOpacity={1} 
        onPress={handlePress}
        onLayout={(e) => {
          // Pobieramy dokładny rozmiar widocznego obszaru
          const { width, height } = e.nativeEvent.layout;
          setLayoutSize({ w: width, h: height });
        }}
      >
        {originalUri && (
          <>
            <Image 
              source={{ uri: originalUri }} 
              style={styles.fullImage} 
              resizeMode="stretch" // Zmieniamy na stretch, żeby współrzędne były liniowe względem kontenera
            />
            {masks.map((m, i) => (
              <Image key={i} source={{ uri: m }} style={[styles.fullImage, styles.overlay]} resizeMode="stretch" />
            ))}
          </>
        )}
        {loading && <ActivityIndicator size="large" style={styles.loader} color="#fff" />}
      </TouchableOpacity>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btn} onPress={pickImage}>
          <Text style={styles.btnText}>WGRAJ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#f44336'}]} onPress={() => setMasks([])}>
          <Text style={styles.btnText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  canvasContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#111'
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loader: { position: 'absolute', alignSelf: 'center', top: '50%' },
  bottomBar: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  btn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, width: 130, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default ARPreview;