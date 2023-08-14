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
import ProfileScreen from "./screens/profile/profile";
import CreateGroupScreen from "./screens/groups/create";
import DetailsListScreen from "./screens/lists/detailsList";
import { IList } from "./common/validation/list";
import { INote } from "./common/validation/note";
import TaskDetailScreen from "./screens/tasks/TaskDetail";
import { ITask, ITaskGroup } from "./common/validation/task";
import { MenuProvider } from "react-native-popup-menu";
import CreateListScreen from "./screens/lists/createList";
import GroupSelectionScreen from "./screens/GroupSelection";
import TabListsScreen from "./screens/(tabs)/lists";
import UserNoteScreen from "./screens/profile/note";
import UnassignedTasksScreen from "./screens/tasks/UnassignedTasks";
import GroupTasksScreen from "./screens/tasks/GroupTasks";

// Define los tipos de las rutas de la aplicación
export type AppStackParamList = {
  Header: undefined;
  Login: undefined;
  Register: undefined;
  GroupSelection: undefined;
  Tabs: undefined;
  TabTasks: undefined;
  TabLists: undefined;
  Chat: undefined;
  CreateTask: { Task?: ITask; edit: boolean };
  MyTasks: undefined;
  UnassignedTasks: undefined;
  TaskDetail: { Task: ITask; isAssigned: boolean };
  GroupTasks: { taskGroup: ITaskGroup };
  Modal: undefined;
  CreateList: { List?: IList; Edit: boolean };
  Profile: undefined;
  CreateGroup: undefined;
  DetailsList: { List: IList };
  UserNote: { Note?: INote; Edit: boolean };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://172.20.10.3:4000/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MenuProvider>
          <UserProvider>
            <ApplicationProvider {...eva} theme={eva.light}>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  {/*gestureEnabled: false*/}
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen
                    name="GroupSelection"
                    component={GroupSelectionScreen}
                  />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen
                    name="CreateGroup"
                    component={CreateGroupScreen}
                  />
                  <Stack.Screen name="Chat" component={ChatScreen} />
                  <Stack.Screen name="Tabs" component={AppLayout} />
                  <Stack.Screen
                    name="CreateTask"
                    component={CreateTaskScreen}
                  />
                  <Stack.Screen name="MyTasks" component={MyTasksScreen} />
                  <Stack.Screen
                    name="UnassignedTasks"
                    component={UnassignedTasksScreen}
                  />
                  <Stack.Screen
                    name="TaskDetail"
                    component={TaskDetailScreen}
                  />
                  <Stack.Screen
                    name="GroupTasks"
                    component={GroupTasksScreen}
                  />
                  <Stack.Screen
                    name="CreateList"
                    component={CreateListScreen}
                  />
                  <Stack.Screen name="Modal" component={ModalScreen} />
                  <Stack.Screen
                    name="DetailsList"
                    component={DetailsListScreen}
                  />
                  <Stack.Screen name="TabLists" component={TabListsScreen} />
                  <Stack.Screen name="UserNote" component={UserNoteScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ApplicationProvider>
          </UserProvider>
        </MenuProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

registerRootComponent(App);
