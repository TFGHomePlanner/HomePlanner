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
import UserProvider from "./context/userContext";
import MyTasksScreen from "./screens/tasks/MyTasks";
import CreatelistScreen from "./screens/lists/createList";
import ProfileScreen from "./screens/profile/profile";
import CreateGroupScreen from "./screens/groups/create";
import DetailsListScreen from "./screens/lists/detailsList";

// Define los tipos de las rutas de la aplicación
export type AppStackParamList = {
  Header: undefined;
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  TabTasks: undefined;
  TabLists: undefined;
  Chat: undefined;
  CreateTask: undefined;
  MyTasks: undefined;
  Modal: undefined;
  CreateList: undefined;
  Profile: undefined;
  CreateGroup: undefined;
  ListCard: undefined;
  DetailsList: { listId: string };

};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://192.168.1.41:4000/trpc",
        }), 
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/*gestureEnabled: false*/}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="CreateGroup"component={CreateGroupScreen}
                />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Tabs" component={AppLayout} />
                <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
                <Stack.Screen name="MyTasks" component={MyTasksScreen} />
                <Stack.Screen name="Modal" component={ModalScreen} />
                <Stack.Screen name="DetailsList" component={DetailsListScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </UserProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

registerRootComponent(App);
