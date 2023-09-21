import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Link } from "@react-navigation/native";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";

export function Header() {
  const [fontsLoaded] = useFonts({
    Raleway_700Bold,
  });
  return (
    <View className="flex-row bg-light px-6 pb-4 pt-12">
      <Text className="ml-4 flex-1 text-center font-ralewayBold text-base">
        homeplanner
      </Text>
      <Link to={{ screen: "Profile" }}>
        <Icon name="user" size={20} />
      </Link>
    </View>
  );
}
