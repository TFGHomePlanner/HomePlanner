import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ITask } from "../../common/validation/task";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { trpc } from "../../trpc";

type TaskCardProps = {
  navigation: NativeStackNavigationProp<any>;
  task: ITask;
  isAssigned?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({
  navigation,
  task,
  isAssigned,
}) => {
  function goToTaskDetail() {
    navigation.navigate("TaskDetail", { Task: task, isAssigned: isAssigned });
  }

  const utils = trpc.useContext();
  const mutation = trpc.task.checkTask.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
    },
  });

  function checkTask() {
    mutation.mutateAsync({ taskId: task.id });
  }

  return (
    <TouchableOpacity
      onPress={goToTaskDetail}
      className="mb-4 w-full rounded-lg bg-white px-4 py-4 shadow-sm"
    >
      <View className="flex-row justify-between">
        <Text className="text-lg font-medium">{task.name}</Text>
        <Icon name="chevron-right" size={24} />
      </View>
      <TouchableOpacity
        onPress={checkTask}
        className="mt-4 w-36 rounded-full border-[1px] border-light bg-purple p-1"
      >
        <Text className="text-center text-light">marcar hecha</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default TaskCard;
