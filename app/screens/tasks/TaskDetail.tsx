import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
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
  const checkMutation = trpc.task.checkTask.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });
  /**
   * Marca la tarea actual como completada.
   */
  function checkTask() {
    checkMutation.mutateAsync({ taskId: Task.id });
  }

  /**
   * Navega a la pantalla de creación/edición de tareas.
   */
  function goToEditTask() {
    navigation.navigate("CreateTask", { Task: Task, edit: true });
  }

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      utils.task.getAllGroupTasks.invalidate();
      utils.task.getUnassignedTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });

  function deleteTask() {
    deleteMutation.mutateAsync({ id: Task.id });
  }

  function handleDelete() {
    Alert.alert("Eliminar tarea", "", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "Eliminar", style: "destructive", onPress: () => deleteTask() },
    ]);
  }

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="flex-1 px-6 pb-10">
        <View className="flex-1 space-y-4">
          {canEdit && (
            <Text onPress={goToEditTask} className="self-end text-purple">
              Editar
            </Text>
          )}
          <Text className="text-xl font-bold">{Task.name}</Text>
          {Task.description && <Text>{Task.description}</Text>}
          {Task.assignedTo && <Text>Asignada a {Task.assignedTo.name}</Text>}
          {Task.startsAt instanceof Date && (
            <Text>Empieza el {Task.startsAt.toLocaleDateString()}</Text>
          )}
          <TouchableOpacity
            onPress={checkTask}
            className="w-36 rounded-full border-[1px] border-light bg-purple p-1"
          >
            <Text className="text-center text-light">marcar hecha</Text>
          </TouchableOpacity>
        </View>
        {canEdit && (
          <TouchableOpacity onPress={handleDelete} className="self-end">
            <Icon name="trash-outline" color={"#7B61FF"} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TaskDetailScreen;
