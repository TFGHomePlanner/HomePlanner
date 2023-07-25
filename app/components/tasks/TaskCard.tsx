import { Pressable, Text, View } from "react-native";
import React from "react";
import { ITask } from "../../common/validation/task";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function TaskCard({ task }: { task: ITask }) {
  return (
    <View className="mb-4 w-full rounded-lg border-[1px] px-4 py-3">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">{task.name}</Text>
        <Icon name="chevron-right" size={24} />
      </View>
      <Text className="text-[#2125297b]">{task.userInCharge?.name}</Text>
      <View className="flex-row space-x-1">
        <Pressable className="mt-4 w-36 rounded-full border-[1px] border-[#F8F3ED] bg-[#7B61FF] p-1">
          <Text className="text-center text-[#F8F3ED]">marcar hecha</Text>
        </Pressable>
        <Pressable className="mt-4 w-36 rounded-full border-[1px] border-[#7B61FF] p-1">
          <Text className="text-center text-[#7B61FF]">reasignar tarea</Text>
        </Pressable>
      </View>
    </View>
  );
}
