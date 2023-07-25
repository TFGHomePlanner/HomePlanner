
import React from "react";
import AddIcon from "react-native-vector-icons/FontAwesome5";
import { Text, View, ScrollView } from "react-native";

export default function TabListsScreen() {
  return (
    <View className="bg-[#f8f3ed] m-4">
      <View className="bg-[#F1889f] p-3 rounded-xl flex flex-row items-center justify-start w-full">
        <AddIcon name="plus" size={20} color="white" className="mr-2" />
        <Text className="text-lg font-bold ml-2 text-white pl-4">Nueva lista</Text>
      </View>
      {/* ScrollView */}
      <ScrollView className="p-4">
        
        <Text className="text-lg font-bold mb-2">Listas</Text>
        {/* Rectángulo debajo de Listas */}
        <View className="bg-[#F1889F] p-3 rounded-lg mb-4" />

        {/* Listas cerradas */}
        <Text className="text-lg font-bold mb-2">Listas cerradas</Text>
        {/* Rectángulo debajo de Listas cerradas */}
        <View className="bg-[#F1889F] p-3 rounded-lg mb-4" />
      </ScrollView>
    </View>
  );
}

