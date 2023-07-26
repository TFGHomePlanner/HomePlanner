import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export function Header() {
  return (
    <View className="mt-8 h-auto flex-row bg-[#F8F3ED] p-6">
      <Text className="ml-4 flex-1 text-center text-base font-bold">
        homeplanner
      </Text>
      <Icon name="user" size={20} />
    </View>
  );
}
