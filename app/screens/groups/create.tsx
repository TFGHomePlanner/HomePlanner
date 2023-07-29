import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { trpc } from "../../trpc";
import { Header } from "../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";

type CreateGroupScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateGroup">;
};

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({
  navigation,
}) => {
  const inputStyle = "mb-2 text-lg border-b-[1px] border-light p-2 text-dark";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function createGroup() {
    //
  }

  return (
    <View className="bg-light">
      <Header />
      <View className="px-6">
        <View className="flex flex-row justify-between">
          <Pressable onPress={navigation.goBack}>
            <Text className="text-purple">Cancelar</Text>
          </Pressable>
          <Text className="mr-4 self-center">Nueva tarea</Text>
          <Pressable className="self-end" onPress={createGroup}>
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
      </View>
    </View>
  );
};

export default CreateGroupScreen;
