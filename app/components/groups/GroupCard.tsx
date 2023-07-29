import { Text, View } from "react-native";
import React from "react";
import { IGroup } from "../../common/validation/group";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function GroupCard({ group }: { group: IGroup }) {
  return (
    <View className="mb-4 w-full rounded-lg bg-white px-4 py-3 shadow-sm shadow-lightGray">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">{group.name}</Text>
        <Icon name="chevron-right" size={24} />
      </View>
    </View>
  );
}
