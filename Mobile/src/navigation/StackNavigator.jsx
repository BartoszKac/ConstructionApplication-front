import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importy ekranów (upewnij się, że ścieżki są poprawne)
import MenuView from "../screens/auth/MenuView";
import LoginView from "../screens/auth/LoginView";
import RegisterView from "../screens/auth/RegisterView";
import MainView from "../screens/menu/MainView";
import PaintCalculator from "../screens/menu/logicView/paintFuction/PaintCalculator";
import PaintResponse from "../screens/menu/logicView/paintFuction/PaintResponse";
 // Załóżmy, że masz te komponenty:
 import LogicView from "../screens/menu/logicView/LogicView";
 import VisualView from "../screens/menu/visualView/VisualView";
 import MyNoteView from "../screens/menu/noteView/MyNoteView";

 import ARPreview from "../screens/menu/visualView/ARPreview"; 
 import FolderDetailsView from "../screens/menu/noteView/FolderDetailsView";

// 1. Definiujemy osobne Stacki dla każdej sekcji
const RootStack = createNativeStackNavigator();
const LogicStack = createNativeStackNavigator();
const VisualStack = createNativeStackNavigator();
const NoteStack = createNativeStackNavigator();

// --- SEKTY POSZCZEGÓLNYCH FUNKCJI ---

export function LogicNavigator() {
  return (
    <LogicStack.Navigator>
      <LogicStack.Screen name="LogicHome" component={LogicView} options={{ title: "Logika" }} />
      <LogicStack.Screen name="PaintView" component={PaintCalculator} options={{ title: "Kalkulator Farby" }} />
      <LogicStack.Screen name="PaintResponseView" component={PaintResponse} options={{ title: "Wyniki" }} />
    </LogicStack.Navigator>
  );
}

export function VisualNavigator() {
  return (
    <VisualStack.Navigator>
      <VisualStack.Screen 
        name="VisualHome" 
        component={VisualView} 
        options={{ title: "Wizualizacja" }} 
      />
      {/* Dodany ekran AR */}
      <VisualStack.Screen 
        name="ARPreview" 
        component={ARPreview} 
        options={{ title: "Podgląd AR" }} 
      />
    </VisualStack.Navigator>
  );
}

export function MyNoteNavigator() {
  return (
    <NoteStack.Navigator>
      <NoteStack.Screen name="NoteHome" component={MyNoteView} options={{ title: "Moje Notatki" }} />
      <NoteStack.Screen name="FolderDetails" component={FolderDetailsView} options={{ title: "Szczegóły Folderu" }} />
    </NoteStack.Navigator>
  );
}

// --- GŁÓWNY NAWIGATOR (Root) ---

export function MenuNavigator() {
  return (
    <RootStack.Navigator initialRouteName="MenuView">
      {/* Autoryzacja */}
      <RootStack.Screen name="MenuView" component={MenuView} options={{ title: "Start" }} />
      <RootStack.Screen name="LoginView" component={LoginView} options={{ title: "Logowanie" }} />
      <RootStack.Screen name="RegisterView" component={RegisterView} options={{ title: "Rejestracja" }} />

      {/* Ekran główny z 3 opcjami */}
      <RootStack.Screen 
        name="MainView" 
        component={MainView} 
        options={{ title: "Menu Główne", headerBackVisible: false }} 
      />

      {/* Rejestracja pod-nawigatorów jako ekrany w głównym Stacku */}
      <RootStack.Screen 
        name="LogicNavigator" 
        component={LogicNavigator} 
        options={{ headerShown: false }} 
      />
      <RootStack.Screen 
        name="VisualNavigator" 
        component={VisualNavigator} 
        options={{ headerShown: false }} 
      />
      <RootStack.Screen 
        name="MyNoteNavigator" 
        component={MyNoteNavigator} 
        options={{ headerShown: false }} 
      />
    </RootStack.Navigator>
  );
}