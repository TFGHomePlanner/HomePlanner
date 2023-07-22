import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Header } from "../../../components/Header";
import { trpc } from "../../../trpc";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";

export default function CreateTaskScreen() {
  const [selectedIndex, setSelectedIndex] = React.useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));

  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPeriodic, setIsPeriodic] = useState(false);

  const mutation = trpc.task.create.useMutation();
  const createTask = () => {
    mutation.mutateAsync({ name, description, isPeriodic });
  };

  return (
    <View>
      <Header />
      <Text>Crear tarea</Text>
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
      <Select
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
        placeholder="Repetir tarea"
      >
        <SelectItem title="Nunca" />
        <SelectItem title="Cada día" />
        <SelectItem title="Cada semana" />
        <SelectItem title="Cada mes" />
      </Select>
      <Pressable
        className="h-10 w-full justify-center rounded-md bg-[#212529] pl-8"
        onPress={createTask}
      >
        <Text className="text-base text-[#F8F3ED]">Crear tarea</Text>
      </Pressable>
    </View>
  );
}
