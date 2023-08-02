import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Header } from "../../../components/Header";
import { trpc } from "../../../trpc";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { Frequency } from "@prisma/client";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";

type CreateTaskScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateTask">;
};

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ navigation }) => {
  const frequencyTranslations: Record<Frequency, string> = {
    never: "Nunca",
    oncePerDay: "Cada día",
    oncePerWeek: "Cada semana",
    oncePerMonth: "Cada mes",
  };

  const data = Object.entries(frequencyTranslations).map(([value, label]) => ({
    value,
    label,
  }));

  const inputStyle = "mb-2 text-lg border-b-[1px] border-light p-2 text-dark";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0)
  );
  const selectedFrequency = data[selectedIndex.row].value as Frequency;

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
    });
    console.log(
      "Task created: " +
        name +
        ", " +
        description +
        ", " +
        selectedFrequency.valueOf()
    );
  };

  return (
    <View className="bg-light">
      <Header />
      <View className="px-6">
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
        <Select
          selectedIndex={selectedIndex}
          onSelect={(index) =>
            setSelectedIndex(Array.isArray(index) ? index[0] : index)
          }
          placeholder="Repetir tarea"
        >
          {data.map((f, index) => (
            <SelectItem key={index} title={f.label} />
          ))}
        </Select>
      </View>
    </View>
  );
};

export default CreateTaskScreen;
