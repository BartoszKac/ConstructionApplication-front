import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import {MenuNavigator} from "./src/navigation/StackNavigator";
import { PaintProvider } from "./src/contex/contex";

function App() {
  return (
    <PaintProvider>
    <NavigationContainer>
      <MenuNavigator />
    </NavigationContainer>
    </PaintProvider>
  );
}

export default App;
