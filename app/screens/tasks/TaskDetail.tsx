import { Pressable, Text, View } from "react-native";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { trpc } from "../../trpc";

type TaskDetailScreenProps = {
  route: RouteProp<AppStackParamList, "TaskDetail">;
};

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route }) => {
  const { Task } = route.params;

  const utils = trpc.useContext();
  const mutation = trpc.task.checkTask.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
    },
  });
  function checkTask() {
    mutation.mutateAsync({ taskId: Task.id });
  }

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="space-y-4 p-6">
        <Text className="text-xl font-bold">{Task.name}</Text>
        {Task.description && <Text>{Task.description}</Text>}
        {Task.assignedTo && <Text>Asignada a {Task.assignedTo.name}</Text>}
        <View className="flex-row space-x-4">
          <Pressable
            onPress={checkTask}
            className="w-36 rounded-full border-[1px] border-light bg-purple p-1"
          >
            <Text className="text-center text-light">marcar hecha</Text>
          </Pressable>
          <Pressable className="w-36 rounded-full border-[1px] border-purple p-1">
            <Text className="text-center text-purple">reasignar tarea</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TaskDetailScreen;
