import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { trpc } from "../../trpc";
import { Header } from "../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/AntDesign";

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
  const [codeGroup, setCodeGroup] = useState("");
  const [users, setUsers] = useState([]);

  const mutation = trpc.group.create.useMutation({
    onSuccess() {
      utils.user.getUserGroups.invalidate();
      navigation.navigate("Tabs");
    },
  });
  function createGroup() {
    mutation.mutateAsync({
      name,
      description,
      adminId: User.id,
      codeGroup,
      users,
    });
    console.log("Group created: " + name + ", " + codeGroup);
  }

  function generateCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 6;
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    setCodeGroup(code);
  }

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="px-6">
        <View className="flex flex-row justify-between">
          <Pressable onPress={navigation.goBack}>
            <Text className="text-purple">Cancelar</Text>
          </Pressable>
          <Text className="mr-4 self-center">Nuevo grupo</Text>
          <Pressable className="self-end" onPress={createGroup}>
            <Text className="font-semibold text-purple">Añadir</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={generateCode}
          className="my-6 flex-row space-x-2 rounded-lg bg-white p-4"
        >
          <Icon name="codepen" size={20} color={"#7B61FF"} />
          <Text className="self-center text-base text-purple">
            Generar código
          </Text>
        </Pressable>

        <View>
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
        <Text className="text-lg tracking-widest">{codeGroup}</Text>
      </View>
    </View>
  );
};

export default CreateGroupScreen;
