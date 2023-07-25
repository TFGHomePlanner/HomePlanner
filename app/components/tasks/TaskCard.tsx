import { Text, View } from "react-native";
import React from "react";
import { ITask } from "../../common/validation/task";

export default function TaskCard({ task }: { task: ITask }) {
  return (
    <View className="w-full rounded-lg border-[1px] p-4">
      <Text className="text-base font-semibold">{task.name}</Text>
      <Text className="">{task.userInCharge?.name}</Text>
    </View>
  );
}
