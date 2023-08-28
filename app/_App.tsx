import React, { useEffect, useState } from "react";
import { registerRootComponent } from "expo";
import { trpc } from "./server/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/login";
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
import { IPaymentSection, IPayment } from "./common/validation/payment";
import TaskDetailScreen from "./screens/tasks/TaskDetail";
import { ITask, ITaskGroup } from "./common/validation/task";
import { MenuProvider } from "react-native-popup-menu";
import CreateListScreen from "./screens/lists/createList";
import GroupSelectionScreen from "./screens/GroupSelection";
import TabListsScreen from "./screens/(tabs)/lists";
import UserNoteScreen from "./screens/profile/note";
import UnassignedTasksScreen from "./screens/tasks/UnassignedTasks";
import GroupTasksScreen from "./screens/tasks/GroupTasks";
import { ISharedNote } from "./common/validation/sharedNote";
import CreateSharedNoteScreen from "./screens/sharedNotes/create";
import NoteDetailScreen from "./screens/sharedNotes/NoteDetail";
import PaymentDetailScreen from "./screens/payment/paymentDetails";
import CreatePaymentScreen from "./screens/payment/Createpayment";
import PaymentListScreen from "./screens/payment/paymentlist";
import ResumePaymentScreenScreen from "./screens/payment/resumepayment";
import CreateEventScreen from "./screens/(tabs)/calendar/create";
import { IEvent, IReservation } from "./common/validation/event";
import CreateReservationScreen from "./screens/calendar/CreateReservation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventDetailScreen from "./screens/calendar/EventDetail";

// Define los tipos de las rutas de la aplicación
export type AppStackParamList = {
  Header: undefined;
  Login: undefined;
  Register: undefined;
  GroupSelection: undefined;
  Tabs: undefined;
  TabHome: undefined;
  TabTasks: undefined;
  TabCalendar: undefined;
  TabLists: undefined;
  TabPayments: undefined;
  Chat: undefined;
  CreateTask: { Task?: ITask; edit: boolean };
  MyTasks: undefined;
  UnassignedTasks: undefined;
  TaskDetail: { Task: ITask; isAssigned: boolean };
  GroupTasks: { taskGroup: ITaskGroup };
  CreateEvent: { Event?: IEvent; edit: boolean };
  CreateReservation: { Reservation?: IReservation; edit: boolean };
  EventDetail: { Event: IEvent };
  CreateList: { List?: IList; Edit: boolean };
  Profile: undefined;
  CreateGroup: undefined;
  DetailsList: { List: IList };
  PaymentDetails: { Payment: IPayment };
  UserNote: { Note?: INote; Edit: boolean };
  CreateSharedNote: { Note?: ISharedNote; edit: boolean };
  NoteDetail: { Note: ISharedNote };
  PaymentList: { Payments: IPaymentSection };
  CreatePayment: { Payments: IPaymentSection };
  ResumePayments: { Payments: IPaymentSection };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://192.168.1.48:4000/trpc",
        }),
      ],
    })
  );
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        userData !== null && setInitialRoute("GroupSelection");
        console.log("Datos del usuario en caché:", userData);
      } catch (error) {
        console.error(
          "Error al verificar los datos del usuario en la caché:",
          error
        );
      }
    };
    checkUserData();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MenuProvider>
          <UserProvider>
            <ApplicationProvider {...eva} theme={eva.light}>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  {/*gestureEnabled: false*/}
                  {initialRoute === "Login" && (
                    <Stack.Screen name="Login" component={LoginScreen} />
                  )}
                  <Stack.Screen
                    name="GroupSelection"
                    component={GroupSelectionScreen}
                  />
                  {initialRoute !== "Login" && (
                    <Stack.Screen name="Login" component={LoginScreen} />
                  )}
                  <Stack.Screen name="Register" component={RegisterScreen} />
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
                    name="CreateEvent"
                    component={CreateEventScreen}
                  />
                  <Stack.Screen
                    name="CreateReservation"
                    component={CreateReservationScreen}
                  />
                  <Stack.Screen
                    name="EventDetail"
                    component={EventDetailScreen}
                  />
                  <Stack.Screen
                    name="CreateList"
                    component={CreateListScreen}
                  />
                  <Stack.Screen
                    name="DetailsList"
                    component={DetailsListScreen}
                  />
                  <Stack.Screen
                    name="PaymentDetails"
                    component={PaymentDetailScreen}
                  />
                  <Stack.Screen name="TabLists" component={TabListsScreen} />
                  <Stack.Screen name="UserNote" component={UserNoteScreen} />
                  <Stack.Screen
                    name="CreateSharedNote"
                    component={CreateSharedNoteScreen}
                  />
                  <Stack.Screen
                    name="NoteDetail"
                    component={NoteDetailScreen}
                  />
                  <Stack.Screen
                    name="CreatePayment"
                    component={CreatePaymentScreen}
                  />
                  <Stack.Screen
                    name="PaymentList"
                    component={PaymentListScreen}
                  />
                  <Stack.Screen
                    name="ResumePayments"
                    component={ResumePaymentScreenScreen}
                    options={{ gestureEnabled: false }}
                  />
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
