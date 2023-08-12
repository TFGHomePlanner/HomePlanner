import { Pressable, Text, View } from "react-native";
import React, { useContext } from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TaskDetailScreenProps = {
  route: RouteProp<AppStackParamList, "TaskDetail">;
  navigation: NativeStackNavigationProp<AppStackParamList, "TaskDetail">;
};

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route }) => {
  const Task = route.params.Task;
  const isAssigned = route.params.isAssigned;

  const { User } = useContext(UserContext) as UserContextType;
  const canEdit = User.id === Task.createdBy || User.isAdmin;
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
      <View className="flex-1 px-6 pb-10">
        <View className="flex-1 space-y-4">
          {canEdit && <Text className="self-end text-purple">Editar</Text>}
          <Text className="text-xl font-bold">{Task.name}</Text>
          {Task.description && <Text>{Task.description}</Text>}
          {Task.assignedTo && <Text>Asignada a {Task.assignedTo.name}</Text>}
          <View className="flex-row space-x-4">
            {isAssigned && (
              <Pressable
                onPress={checkTask}
                className="w-36 rounded-full border-[1px] border-light bg-purple p-1"
              >
                <Text className="text-center text-light">marcar hecha</Text>
              </Pressable>
            )}
            <Pressable className="w-36 rounded-full border-[1px] border-purple p-1">
              <Text className="text-center text-purple">reasignar tarea</Text>
            </Pressable>
          </View>
        </View>
        {canEdit && (
          <Pressable className="self-end">
            <Icon name="trash-outline" color={"#7B61FF"} size={24} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default TaskDetailScreen;
