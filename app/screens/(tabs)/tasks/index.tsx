import React from "react";
import { Pressable, Text, View } from "react-native";
import { trpc } from "../../../trpc";
import TaskCard from "../../../components/tasks/TaskCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";

type TabTasksScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabTasks">;
};

const TabTasksScreen: React.FC<TabTasksScreenProps> = ({ navigation }) => {
  const { data: allTasks } = trpc.task.getAllTasks.useQuery();

  function goToCreateTask() {
    navigation.navigate("CreateTask");
  }

  function goToMyTasks() {
    navigation.navigate("MyTasks");
  }

  return (
    <View className="h-full bg-[#F8F3ED] px-6">
      <View className="mb-6 gap-y-3">
        <Pressable
          onPress={goToCreateTask}
          className="h-10 w-full justify-center rounded-xl bg-[#7B61FF] pl-4"
        >
          <Text className="text-base text-[#F8F3ED]">Nueva tarea</Text>
        </Pressable>
        <Pressable
          onPress={goToMyTasks}
          className="h-10 w-full justify-center rounded-xl bg-[#212529] pl-4"
        >
          <Text className="text-base text-[#F8F3ED]">Mis tareas</Text>
        </Pressable>
      </View>
      <View className="mb-6 gap-y-3">
        <Pressable className="h-10 w-full justify-center rounded-xl border-[1.5px] border-[#7B61FF] pl-4">
          <Text className="text-base">Tareas sin asignar</Text>
        </Pressable>
        <Pressable className="h-10 w-full justify-center rounded-xl border-[1.5px] border-[#7B61FF] pl-4">
          <Text className="text-base">Grupo cocina</Text>
        </Pressable>
      </View>
      <Text className="mb-2 text-lg">Otras tareas</Text>
      <View>
        {allTasks ? (
          allTasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <Text>No hay tareas</Text>
        )}
      </View>
    </View>
  );
};

export default TabTasksScreen;
