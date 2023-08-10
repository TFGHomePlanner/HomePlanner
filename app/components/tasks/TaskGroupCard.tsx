import { Pressable, Text } from "react-native";
import React from "react";
import { ITaskGroup } from "../../common/validation/task";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TaskGroupCardProps = {
  navigation: NativeStackNavigationProp<any>;
  taskGroup: ITaskGroup;
};

const TaskGroupCard: React.FC<TaskGroupCardProps> = ({
  taskGroup,
  navigation,
}) => {
  function goToGroupTasks() {
    navigation.navigate("GroupTasks", { taskGroup: taskGroup });
  }

  return (
    <Pressable
      onPress={goToGroupTasks}
      className="mb-4 h-16 w-[48%] justify-center rounded-xl bg-dark"
    >
      <Text className="text-center text-base text-light">{taskGroup.name}</Text>
    </Pressable>
  );
};
export default TaskGroupCard;
