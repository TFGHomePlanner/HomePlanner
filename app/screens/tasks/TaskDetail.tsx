import { Text, View } from "react-native";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TaskDetailScreenProps = {
  route: RouteProp<AppStackParamList, "TaskDetail">;
  navigation: NativeStackNavigationProp<AppStackParamList, "TaskDetail">;
};

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route }) => {
  const { Task } = route.params;
  return (
    <View className="p-16">
      <Text>{Task.name}</Text>
    </View>
  );
};

export default TaskDetailScreen;
