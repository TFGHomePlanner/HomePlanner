import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from "./screens/Login";
import { StartScreen } from "./screens/StartScreen";
import { HomeScreen } from "./screens/home";
import { TRPCProvider } from "./utils/api";

const Stack = createNativeStackNavigator();

export const App = () => {
  return (
    // <TRPCProvider>
    //   <SafeAreaProvider>
    //     {/* <HomeScreen /> */}
    //     {/* <StartScreen /> */}
    //     <Login />
    //     <StatusBar />
    //   </SafeAreaProvider>
    // </TRPCProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={StartScreen} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
