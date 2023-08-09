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

type MyTasksScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "MyTasks">;
};

const MyTasksScreen: React.FC<MyTasksScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: myTasks } = trpc.user.getUserTasks.useQuery({
    userId: User.id,
    groupId: User.groupId!,
  });
  return (
    <View className="h-full bg-light">
      <Header />
      <View className="px-6">
        <View className="flex-row items-center">
          <Pressable onPress={navigation.goBack}>
            <Icon name="left" size={20} color={"#7B61FF"} />
          </Pressable>
          <Text className="mr-6 flex-1 text-center text-base">Mis tareas</Text>
        </View>
        <View className="my-6">
          {myTasks ? (
            myTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                navigation={navigation}
                isAssigned={true}
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

export default MyTasksScreen;
