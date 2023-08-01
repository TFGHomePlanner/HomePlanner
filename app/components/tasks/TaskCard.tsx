import { Pressable, Text, View } from "react-native";
import React from "react";
import { ITask } from "../../common/validation/task";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TaskCardProps = {
  navigation: NativeStackNavigationProp<any>;
  task: ITask;
};

const TaskCard: React.FC<TaskCardProps> = ({ navigation, task }) => {
  function goToTaskDetails() {
    navigation.navigate("TaskDetail", { Task: task });
  }
  return (
    <Pressable
      onPress={goToTaskDetails}
      className="mb-4 w-full rounded-lg bg-white px-4 py-3"
    >
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">{task.name}</Text>
        <Icon name="chevron-right" size={24} />
      </View>
      <View className="flex-row space-x-1">
        <Pressable className="mt-4 w-36 rounded-full border-[1px] border-light bg-purple p-1">
          <Text className="text-center text-light">marcar hecha</Text>
        </Pressable>
        <Pressable className="mt-4 w-36 rounded-full border-[1px] border-purple p-1">
          <Text className="text-center text-purple">reasignar tarea</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default TaskCard;
