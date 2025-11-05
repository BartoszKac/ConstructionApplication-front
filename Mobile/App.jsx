import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import {MenuNavigator} from "./src/navigation/StackNavigator";

function App() {
  return (
    <NavigationContainer>
      <MenuNavigator />
    </NavigationContainer>
  );
}

export default App;
