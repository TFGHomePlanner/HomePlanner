import React, { useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { trpc } from "../../../trpc";
import TaskCard from "../../../components/tasks/TaskCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type TabTasksScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabTasks">;
};

const TabTasksScreen: React.FC<TabTasksScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: allTasks } = trpc.task.getAllTasks.useQuery({
    groupId: User.groupId,
  });

  function goToCreateTask() {
    navigation.navigate("CreateTask");
  }

  function goToMyTasks() {
    navigation.navigate("MyTasks");
  }

  return (
    <ScrollView
      className="h-full bg-light px-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6 items-end">
        <Pressable onPress={goToCreateTask}>
          <Icon name="shape-square-rounded-plus" size={24} color={"#7B61FF"} />
        </Pressable>
      </View>
      <Pressable
        onPress={goToMyTasks}
        className="mb-6 h-10 w-full justify-center rounded-xl bg-dark pl-4"
      >
        <Text className="text-base text-light">Mis tareas</Text>
      </Pressable>
      <View className="mb-6 flex-row justify-between gap-x-2">
        <Pressable className="h-16 flex-1 justify-center rounded-xl bg-white shadow-sm shadow-dark">
          <Text className="text-center text-base">Tareas sin asignar</Text>
        </Pressable>
        <Pressable className="h-16 flex-1 justify-center rounded-xl bg-white shadow-sm shadow-dark">
          <Text className="text-center text-base">Grupo cocina</Text>
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
    </ScrollView>
  );
};

export default TabTasksScreen;
