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
  navigation: NativeStackNavigationProp<AppStackParamList, "TaskDetail">;
  route: RouteProp<AppStackParamList, "TaskDetail">;
};
/**
 * Pantalla que muestra los detalles de una tarea.
 */
const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  navigation,
  route,
}) => {
  /**
   * Objeto que representa los detalles de la tarea.
   */
  const Task = route.params.Task;

  /**
   * Indica si la tarea está asignada a un usuario.
   */
  const isAssigned = route.params.isAssigned;

  /**
   * Contexto del usuario actual.
   */
  const { User } = useContext(UserContext) as UserContextType;

  /**
   * Indica si el usuario actual tiene permiso para editar la tarea.
   */
  const canEdit = User.id === Task.createdBy || User.isAdmin;
  const utils = trpc.useContext();

  /**
   * Mutación para marcar una tarea como completada.
   */
  const mutation = trpc.task.checkTask.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
    },
  });
  /**
   * Marca la tarea actual como completada.
   */
  function checkTask() {
    mutation.mutateAsync({ taskId: Task.id });
  }

  /**
   * Navega a la pantalla de edición de tareas.
   */
  function goToCreateTask() {
    navigation.navigate("CreateTask", { Task: Task, edit: true });
  }

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="flex-1 px-6 pb-10">
        <View className="flex-1 space-y-4">
          {canEdit && (
            <Text onPress={goToCreateTask} className="self-end text-purple">
              Editar
            </Text>
          )}
          <Text className="text-xl font-bold">{Task.name}</Text>
          {Task.description && <Text>{Task.description}</Text>}
          {Task.assignedTo && <Text>Asignada a {Task.assignedTo.name}</Text>}
          {Task.startsAt instanceof Date && (
            <Text>Empieza el {Task.startsAt.toLocaleDateString()}</Text>
          )}
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
