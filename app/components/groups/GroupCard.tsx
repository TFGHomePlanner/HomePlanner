import { Image, Text, View } from "react-native";
import React from "react";
import { IGroup } from "../../common/validation/group";

export default function GroupCard({ group }: { group: IGroup }) {
  return (
    <View className="mb-4 w-full flex-row justify-between rounded-lg bg-white p-6 shadow-sm shadow-lightGray">
      <View className="space-y-4">
        <Image
          source={require("../../../assets/images/grupo.png")}
          className="h-12 w-12"
        />
        <Text className="text-lg font-medium text-placeholderGray">
          {group.name}
        </Text>
      </View>
      <Text className="text-4xl font-bold text-dark">{group.users.length}</Text>
    </View>
  );
}
