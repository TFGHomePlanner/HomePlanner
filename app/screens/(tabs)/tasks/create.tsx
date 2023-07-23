import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Header } from "../../../components/Header";
import { trpc } from "../../../trpc";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { Frequency } from "@prisma/client";

type CreateTaskScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateTask">;
};

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ navigation }) => {
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0)
  );
  const selectedFrequency = data[selectedIndex.row].value as Frequency;
  const mutation = trpc.task.create.useMutation();
  const createTask = () => {
    mutation.mutateAsync({ name, description, frequency: selectedFrequency });
  };

  return (
    <View className="bg-[#F8F3ED]">
      <Header />
      <View className="p-8">
        <View className="flex flex-row justify-between">
          <Pressable className="" onPress={navigation.goBack}>
            <Text className="text-[#7B61FF]">Cancelar</Text>
          </Pressable>
          <Text className="self-center">Nueva tarea</Text>
          <Pressable className="self-end" onPress={createTask}>
            <Text className="font-semibold text-[#7B61FF]">Añadir</Text>
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
          {data.map((f) => (
            <SelectItem key={f.value} title={f.label} />
          ))}
        </Select>
      </View>
    </View>
  );
};

export default CreateTaskScreen;
