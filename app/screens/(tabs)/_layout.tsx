import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabCalendarScreen from "./calendar";
import TabTasksScreen from "./tasks";
import TabHomeScreen from "./home";
import TabListsScreen from "./lists";
import TabPaymentsScreen from "./payments";
import { View } from "react-native";
import { Header } from "../../components/Header";
import Icon from "react-native-vector-icons/Octicons";

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  return (
    <View className="h-full">
      <Header />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={TabHomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Tareas"
          component={TabTasksScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="tasklist" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendario"
          component={TabCalendarScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Listas"
          component={TabListsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="list-unordered" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Pagos"
          component={TabPaymentsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="credit-card" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
