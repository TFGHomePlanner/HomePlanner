import { Pressable, Text, View } from "react-native";
import React, { useContext } from "react";
import { Header } from "../../components/Header";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import Icon from "react-native-vector-icons/AntDesign";
import TaskCard from "../../components/tasks/TaskCard";
import { RouteProp } from "@react-navigation/native";

type GroupTasksScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "GroupTasks">;
  route: RouteProp<AppStackParamList, "GroupTasks">;
};

const GroupTasksScreen: React.FC<GroupTasksScreenProps> = ({
  navigation,
  route,
}) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: tasks } = trpc.task.getAllGroupTasks.useQuery({
    groupId: User.groupId || "",
    taskGroupId: route.params.taskGroup.id,
  });
  return (
    <View className="h-full bg-light">
      <Header />
      <View className="px-6">
        <Pressable onPress={navigation.goBack}>
          <Icon name="left" size={16} color={"#7B61FF"} />
        </Pressable>
        <View className="my-6">
          {tasks ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{
                  ...task,
                  startsAt: task.startsAt ? new Date(task.startsAt) : null,
                }}
                navigation={navigation}
                isAssigned={false}
              />
            ))
          ) : (
            <Text>No hay tareas</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default GroupTasksScreen;
