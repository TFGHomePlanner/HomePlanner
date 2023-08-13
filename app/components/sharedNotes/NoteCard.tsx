import { Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function NoteCard() {
  return (
    <View className="mb-4 w-full rounded-lg bg-white px-4 py-3 shadow-sm shadow-lightGray">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold text-dark">
          Nota para miniflusi
        </Text>
        <Icon name="chevron-right" size={24} color={"#212529"} />
      </View>
    </View>
  );
}
