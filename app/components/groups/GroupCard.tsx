import { Image, Text, View } from "react-native";
import React from "react";
import { IGroup } from "../../common/validation/group";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";

export default function GroupCard({ group }: { group: IGroup }) {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_700Bold,
  });
  return (
    <View className="mb-4 w-full flex-row justify-between rounded-lg bg-white p-5 shadow-sm shadow-lightGray">
      <View className="space-y-4">
        <Image
          source={require("../../../assets/images/grupo.png")}
          className="h-12 w-12"
        />
        <Text className="font-ralewayMedium text-lg text-placeholderGray">
          {group.name}
        </Text>
      </View>
      <Text className="font-ralewayBold text-4xl text-dark opacity-70">
        {group.users.length}
      </Text>
    </View>
  );
}
