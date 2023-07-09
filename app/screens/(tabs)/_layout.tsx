import { Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabCalendarScreen from "./calendar";
import TabTasksScreen from "./tasks";

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tareas" component={TabTasksScreen} />
      <Tab.Screen name="Calendario" component={TabCalendarScreen} />
    </Tab.Navigator>
  );
}
