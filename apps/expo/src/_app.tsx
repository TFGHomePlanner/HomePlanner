import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Login } from "./screens/Login";
import { StartScreen } from "./screens/StartScreen";
import { HomeScreen } from "./screens/home";
import { TRPCProvider } from "./utils/api";

export const App = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        {/* <HomeScreen /> */}
        {/* <StartScreen /> */}
        <Login />
        <StatusBar />
      </SafeAreaProvider>
    </TRPCProvider>
  );
};
