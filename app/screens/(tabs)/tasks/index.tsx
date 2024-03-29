import React, { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { trpc } from "../../../trpc";
import TaskCard from "../../../components/tasks/TaskCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TaskGroupCard from "../../../components/tasks/TaskGroupCard";
import { Divider } from "@ui-kitten/components";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
  Raleway_900Black,
} from "@expo-google-fonts/raleway";

type TabTasksScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabTasks">;
};

const TabTasksScreen: React.FC<TabTasksScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_900Black,
  });
  const { User } = useContext(UserContext) as UserContextType;
  const { data: allTasks } = trpc.task.getAllTasks.useQuery({
    groupId: User.groupId || "",
  });

  const { data: groups } = trpc.task.getAllTaskGroups.useQuery({
    groupId: User.groupId,
  });

  function goToCreateTask() {
    navigation.navigate("CreateTask", { edit: false });
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
      <TouchableOpacity className="mb-4 items-end" onPress={goToCreateTask}>
        <Icon name="shape-square-rounded-plus" size={24} color={"#7B61FF"} />
      </TouchableOpacity>
      <View className="mb-4 h-24 w-full justify-center space-y-3 rounded-xl bg-white px-4 shadow-sm">
        <TouchableOpacity
          onPress={goToMyTasks}
          className="flex-row justify-between"
        >
          <View className="flex-row items-center space-x-2">
            <Icon name="account-details" color={"#7B61FF"} size={20} />
            <Text className="font-sans text-base text-dark">Mis tareas</Text>
          </View>
          <Icon name="chevron-right" color={"#212529"} size={20} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={goToUnassignedTasks}
          className="flex-row justify-between"
        >
          <View className="flex-row items-center space-x-2">
            <Icon name="account-question-outline" color={"#7B61FF"} size={20} />
            <Text className="font-sans text-base text-dark">
              Tareas sin asignar
            </Text>
          </View>
          <Icon name="chevron-right" color={"#212529"} size={20} />
        </TouchableOpacity>
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
      <Text className="mb-2 font-ralewayBold text-lg text-dark">
        Todas las tareas
      </Text>
      <View>
        {allTasks ? (
          allTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                ...task,
                startsAt: task.startsAt ? new Date(task.startsAt) : null,
              }}
              navigation={navigation}
              isAssigned={task.assignedTo != null}
            />
          ))
        ) : (
          <Text>Cargando...</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default TabTasksScreen;
