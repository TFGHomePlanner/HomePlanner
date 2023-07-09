import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabCalendarScreen from "./calendar";
import TabTasksScreen from "./tasks";
import TabHomeScreen from "./home";
import TabListsScreen from "./lists";
import TabPaymentsScreen from "./payments";

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Inicio" component={TabHomeScreen} />
      <Tab.Screen name="Tareas" component={TabTasksScreen} />
      <Tab.Screen name="Calendario" component={TabCalendarScreen} />
      <Tab.Screen name="Listas" component={TabListsScreen} />
      <Tab.Screen name="Pagos" component={TabPaymentsScreen} />
    </Tab.Navigator>
  );
}
