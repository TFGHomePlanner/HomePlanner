import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Divider } from "@ui-kitten/components";

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
            <TouchableOpacity onPress={goToEditTask}>
              <Text className="self-end font-ralewayMedium text-purple">
                Editar
              </Text>
            </TouchableOpacity>
          )}
          <Text className="font-ralewayBold text-xl">{Task.name}</Text>
          <View className="space-y-2 rounded-lg bg-white px-4 py-3">
            {Task.description && (
              <View>
                <Text className="mb-2 font-sans">{Task.description}</Text>
                <Divider />
              </View>
            )}
            {Task.assignedTo && (
              <Text className="font-sans">
                👤 Asignada a {Task.assignedTo.name}
              </Text>
            )}
            {Task.startsAt instanceof Date && (
              <View>
                <Divider />
                <Text className="mt-2 font-sans">
                  ⏳ Empieza el {Task.startsAt.toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={checkTask}
            className="w-36 rounded-full border-[1px] border-light bg-purple p-1"
          >
            <Text className="mb-1 text-center font-ralewayMedium text-light">
              marcar hecha
            </Text>
          </TouchableOpacity>
        </View>
        {canEdit && (
          <TouchableOpacity onPress={handleDelete} className="self-center">
            <Text className="font-ralewayMedium text-purple">
              Eliminar tarea
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TaskDetailScreen;
