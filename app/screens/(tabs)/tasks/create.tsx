import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Header } from "../../../components/Header";
import { trpc } from "../../../trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { Frequency } from "@prisma/client";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import { SelectList } from "react-native-dropdown-select-list";

type CreateTaskScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateTask">;
};

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ navigation }) => {
  const inputStyle =
    "mb-2 bg-white rounded-lg text-base border-b-[1px] border-light p-2 text-dark";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const frequencyOptions = [
    { key: Frequency.never, value: "Nunca" },
    { key: Frequency.oncePerDay, value: "Cada día" },
    { key: Frequency.oncePerWeek, value: "Cada semana" },
    { key: Frequency.oncePerMonth, value: "Cada mes" },
  ];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>(
    Frequency.never
  );

  const { data: users } = trpc.group.getUsers.useQuery({ id: User.groupId });
  const [selectedUser, setSelectedUser] = useState("");
  const userOptions = users?.map((user) => ({
    key: user.id,
    value: user.name,
  }));

  const mutation = trpc.task.create.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });

  const createTask = () => {
    mutation.mutateAsync({
      name,
      description,
      frequency: selectedFrequency,
      groupId: User.groupId!,
      userId: selectedUser,
    });
    console.log("Task created: " + selectedUser);
  };

  return (
    <View className="bg-light">
      <Header />
      <View className="h-full px-6">
        <View className="flex flex-row justify-between">
          <Pressable onPress={navigation.goBack}>
            <Text className="text-purple">Cancelar</Text>
          </Pressable>
          <Text className="mr-4 self-center">Nueva tarea</Text>
          <Pressable className="self-end" onPress={createTask}>
            <Text className="font-semibold text-purple">Añadir</Text>
          </Pressable>
        </View>

        <View className="my-6">
          <TextInput
            className={`${inputStyle}`}
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={setName}
            placeholder="Título"
          />
          <TextInput
            className={`${inputStyle}`}
            placeholderTextColor="#95999C"
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
          />
        </View>
        <View className="mb-4 flex-row items-center justify-between rounded-lg bg-white pl-4">
          <Text>Repetir tarea</Text>
          <SelectList
            data={frequencyOptions}
            setSelected={setSelectedFrequency}
            save="key"
            defaultOption={{ value: "Nunca", key: Frequency.never }}
            search={false}
            boxStyles={{
              height: 42,
              width: 140,
              borderColor: "#F8F3ED",
              alignSelf: "flex-end",
            }}
          />
        </View>
        <View className="flex-row items-center justify-between rounded-lg bg-white pl-4">
          <Text>Asignar encargado</Text>
          {userOptions ? (
            <SelectList
              data={userOptions}
              setSelected={setSelectedUser}
              save="key"
              search={false}
              boxStyles={{
                height: 42,
                width: 140,
                borderColor: "#F8F3ED",
                alignSelf: "flex-end",
              }}
              placeholder="Seleccionar"
            />
          ) : (
            <Text>Este grupo no tiene usuarios.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CreateTaskScreen;
