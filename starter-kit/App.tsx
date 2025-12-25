import React, { useState } from "react";
import { StyleSheet } from "react-native";

import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroQuad,
  ViroMaterials,
} from "@reactvision/react-viro";

/* ===== MATERIAŁY ===== */
ViroMaterials.createMaterials({
  red: { diffuseColor: "rgba(255,0,0,0.6)" },
  green: { diffuseColor: "rgba(0,255,0,0.6)" },
  blue: { diffuseColor: "rgba(0,0,255,0.6)" },
  yellow: { diffuseColor: "rgba(255,255,0,0.6)" },
});

/* ===== SCENA AR ===== */
const HelloWorldSceneAR: React.FC = () => {
  const colors = ["red", "green", "blue", "yellow"];
  const [colorIndex, setColorIndex] = useState(0);

  const changeColor = () => {
    setColorIndex((prev) => (prev + 1) % colors.length);
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={500} />

      {/* WYKRYWANIE ŚCIANY */}
      <ViroARPlaneSelector alignment="Vertical">
        <ViroARPlane alignment="Vertical">
          
          {/* KLIKALNA POWIERZCHNIA */}
          <ViroQuad
            width={3}
            height={3}
            position={[0, 0, 0]}
            materials={[colors[colorIndex]]}
            onClick={changeColor}   // 👈 KLIK = ZMIANA KOLORU
          />

        </ViroARPlane>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

/* ===== APP ===== */
export default function App() {
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene: HelloWorldSceneAR }}
      style={styles.f1}
    />
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
