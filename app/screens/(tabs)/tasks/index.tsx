import React, { useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { trpc } from "../../../trpc";
import TaskCard from "../../../components/tasks/TaskCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TaskGroupCard from "../../../components/tasks/TaskGroupCard";
import { Divider } from "@ui-kitten/components";

type TabTasksScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabTasks">;
};

const TabTasksScreen: React.FC<TabTasksScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: allTasks } = trpc.task.getAllTasks.useQuery({
    groupId: User.groupId!,
  });

  const { data: groups } = trpc.task.getAllTaskGroups.useQuery({
    groupId: User.groupId,
  });

  function goToCreateTask() {
    navigation.navigate("CreateTask");
  }

  function goToMyTasks() {
    navigation.navigate("MyTasks");
  }

  function goToUnassignedTasks() {
    navigation.navigate("UnassignedTasks");
  }

  return (
    <ScrollView
      className="h-full bg-light px-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4 items-end">
        <Pressable onPress={goToCreateTask}>
          <Icon name="shape-square-rounded-plus" size={24} color={"#7B61FF"} />
        </Pressable>
      </View>
      <View className="mb-4 h-24 w-full justify-center space-y-3 rounded-xl bg-white px-4 shadow-sm">
        <Pressable onPress={goToMyTasks} className="flex-row justify-between">
          <View className="flex-row items-center space-x-2">
            <Icon name="account-details" color={"#7B61FF"} size={20} />
            <Text className="text-base text-dark">Mis tareas</Text>
          </View>
          <Icon name="chevron-right" color={"#212529"} size={20} />
        </Pressable>
        <Divider />
        <Pressable
          onPress={goToUnassignedTasks}
          className="flex-row justify-between"
        >
          <View className="flex-row items-center space-x-2">
            <Icon name="account-question-outline" color={"#7B61FF"} size={20} />
            <Text className="text-base text-dark">Tareas sin asignar</Text>
          </View>
          <Icon name="chevron-right" color={"#212529"} size={20} />
        </Pressable>
      </View>
      <View className="mb-2 flex flex-row flex-wrap justify-between">
        {groups &&
          groups.map((group) => (
            <TaskGroupCard
              key={group.id}
              taskGroup={group}
              navigation={navigation}
            />
          ))}
      </View>
      <Text className="mb-2 text-lg">Otras tareas</Text>
      <View>
        {allTasks ? (
          allTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              navigation={navigation}
              isAssigned={task.assignedTo == null}
            />
          ))
        ) : (
          <Text>No hay tareas</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default TabTasksScreen;
