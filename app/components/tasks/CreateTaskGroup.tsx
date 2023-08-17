import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";

const CreateTaskGroupScreen = () => {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(false);
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
    name &&
      mutation.mutateAsync({
        name,
        groupId: User.groupId || "",
      });
    name && openCreateTaskGroup();
    setName("");
  };

  return (
    <View className="mb-2">
      <TouchableOpacity className="items-end">
        <Text onPress={openCreateTaskGroup} className="text-purple">
          {visible ? "Cancelar" : "Crear grupo"}
        </Text>
      </TouchableOpacity>
      {visible && (
        <View className="mt-2 flex-row items-center justify-between space-x-2">
          <TextInput
            className="flex-1 rounded-lg bg-white px-4 py-3"
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={(newName) => {
              setName(newName);
              setEnabled(newName.trim() !== "");
            }}
            placeholder="Nombre del grupo *"
            maxLength={15}
          />
          <Text
            disabled={!enabled}
            onPress={createTaskGroup}
            className={`${
              enabled ? "text-purple" : "text-darkGray"
            } font-semibold`}
          >
            OK
          </Text>
        </View>
      )}
    </View>
  );
};

export default CreateTaskGroupScreen;
