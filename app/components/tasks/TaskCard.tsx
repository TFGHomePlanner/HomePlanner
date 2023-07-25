import { Text, View } from "react-native";
import React from "react";
import { ITask } from "../../common/validation/task";

export default function TaskCard({ task }: { task: ITask }) {
  return (
    <View>
      <Text>{task.name}</Text>
    </View>
  );
}
