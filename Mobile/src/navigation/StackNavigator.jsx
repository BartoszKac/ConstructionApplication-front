import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuView from "../screens/auth/MenuView";
import LoginView from "../screens/auth/LoginView";
import RegisterView from "../screens/auth/RegisterView";
import PaintCalculator from "../screens/menu/PaintCalculator";
import MainView from "../screens/menu/MainView";


const Stack = createNativeStackNavigator();

const StackMain = createNativeStackNavigator();

export function MenuNavigator(){
  return (
     <Stack.Navigator initialRouteName="MenuView">
        <Stack.Screen
          name="MenuView"
          component={MenuView}
          options={{ title: "Menu Główne" }}
        />
        <Stack.Screen
          name="LoginView"
          component={LoginView}
          options={{ title: "Logowanie" }}
        />
        <Stack.Screen
          name="RegisterView"
          component={RegisterView}
          options={{ title: "Rejestracja" }}
        />
        <Stack.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{ 
            headerBackVisible: false,
            headerShown: false}}
        />
      </Stack.Navigator>
        );
};

export function MainNavigator(){
    return (
        <StackMain.Navigator initialRouteName="MainView">
          <StackMain.Screen
            name ="MainView"
            component={MainView}
            options={{
              title: "Menu Główne",
              headerBackVisible: false
            }}/>
          <StackMain.Screen
            name ="PaintView"
            component={PaintCalculator}
            options={{
              title: "Kalkulator Farby"
            }}/>
        </StackMain.Navigator>
    );
}

