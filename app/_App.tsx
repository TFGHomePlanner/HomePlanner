import React, { useState } from "react";
import { registerRootComponent } from "expo";
import { trpc } from "./server/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/login";
import ModalScreen from "./modal";
import AppLayout from "./screens/(tabs)/_layout";
import RegisterScreen from "./screens/register";
import CreateTaskScreen from "./screens/(tabs)/tasks/create";
import ChatScreen from "./screens/chat";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define los tipos de las rutas de la aplicación
export type AppStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  Chat: undefined;
  CreateTask: undefined;
  Modal: undefined;
};

// Define el tipo de props para el componente App
type AppProps = {
  navigation: NativeStackNavigationProp<AppStackParamList>;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://192.168.1.40:4000/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/*gestureEnabled: false*/}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Tabs" component={AppLayout} />
              <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
              <Stack.Screen name="Modal" component={ModalScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

registerRootComponent(App);
