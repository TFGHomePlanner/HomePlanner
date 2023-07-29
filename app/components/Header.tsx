import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Link } from "@react-navigation/native";

export function Header() {
  return (
    <View className="h-auto flex-row bg-light p-6 pt-16">
      <Text className="ml-4 flex-1 text-center text-base font-bold">
        homeplanner
      </Text>
      <Link to={{ screen: "Profile" }}>
        <Icon name="user" size={20} />
      </Link>
    </View>
  );
}
