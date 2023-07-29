import { Text, View } from "react-native";
import React from "react";
import { ITask } from "../../common/validation/task";

export default function TaskDetail({ task }: { task: ITask }) {
  return (
    <View className="">
      <Text>{task.name}</Text>
    </View>
  );
}
