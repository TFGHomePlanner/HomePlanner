import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";

const CreateTaskGroupScreen = () => {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  function openCreateTaskGroup() {
    setVisible(!visible);
  }

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();
  const mutation = trpc.task.createTaskGroup.useMutation({
    onSuccess() {
      utils.task.getAllTaskGroups.invalidate();
    },
  });

  const createTaskGroup = () => {
    mutation.mutateAsync({
      name,
      groupId: User.groupId!,
    });
    openCreateTaskGroup();
  };

  return (
    <View className="mb-2">
      <Pressable onPress={openCreateTaskGroup} className="items-end">
        <Text className="text-purple">
          {visible ? "Cancelar" : "Crear grupo"}
        </Text>
      </Pressable>
      {visible && (
        <View className="mt-2 flex-row items-center justify-between space-x-2">
          <TextInput
            className="flex-1 rounded-lg bg-white px-4 py-3"
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={setName}
            placeholder="Nombre del grupo"
          />
          <Text onPress={createTaskGroup} className="font-semibold text-purple">
            OK
          </Text>
        </View>
      )}
    </View>
  );
};

export default CreateTaskGroupScreen;
