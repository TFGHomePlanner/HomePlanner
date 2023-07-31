import React from "react";
import {View, Text} from "react-native";


export default function OpenListScreen({ idList }: { idList: string }) {
  return (
    <View className="">
      <Text>{idList}</Text>
    </View>
  );
}
  