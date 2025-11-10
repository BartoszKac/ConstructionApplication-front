import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARScene,
  ViroARSceneNavigator,
    ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

import React, {useState} from "react";
import { StyleSheet } from "react-native";

const HelloWorldSceneAR: React.FC = () => {
    const [text, setText] = useState("Initializing AR...");

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Hello World!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* Oświetlenie — bez niego model będzie czarny */}
      <ViroAmbientLight color="#ffffff" intensity={500} />

      {/* Model 3D */}
      <Viro3DObject
        source={require("./assets/skull/12140_Skull_v3_L2.obj")}
        position={[0, -0.5, -5]}
        scale={[0.01, 0.01, 0.01]}
        rotation={[-45, 75, 40]}
        type="OBJ"
      />
    </ViroARScene>
  );
};

export default function App() {
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene: () => <HelloWorldSceneAR /> }}
      style={styles.f1}
    />
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
