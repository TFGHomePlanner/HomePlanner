import { Pressable, Text } from "react-native";
import React from "react";
import { ITaskGroup } from "../../common/validation/task";

const TaskGroupCard = ({ taskGroup }: { taskGroup: ITaskGroup }) => {
  return (
    <Pressable className="mb-4 h-16 w-[48%] justify-center rounded-xl bg-dark">
      <Text className="text-center text-base text-light">{taskGroup.name}</Text>
    </Pressable>
  );
};
export default TaskGroupCard;
