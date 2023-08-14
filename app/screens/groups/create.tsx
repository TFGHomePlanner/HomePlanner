import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Header } from "../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Feather";
import * as Clipboard from "expo-clipboard";

/**
 * Propiedades para la pantalla de creación de grupos.
 */
type CreateGroupScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateGroup">;
};

/**
 * Pantalla de creación de grupos.
 */
const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({
  navigation,
}) => {
  /**
   * Estilo de los campos de entrada.
   */
  const inputStyle =
    "mb-4 text-base py-2 px-4 bg-white rounded-lg border-b-[1px] border-light text-dark";

  /**
   * Contexto del usuario actual.
   */
  const { User } = useContext(UserContext) as UserContextType;
  /**
   * Utilidades de trpc para gestionar grupos y usuarios.
   */
  const utils = trpc.useContext();

  /**
   * Estado local para el nombre del grupo.
   */
  const [name, setName] = useState("");

  /**
   * Estado local para la descripción del grupo.
   */
  const [description, setDescription] = useState("");

  /**
   * Estado local para el código del grupo generado.
   */
  const [codeGroup, setCodeGroup] = useState("");

  /**
   * Estado local para la lista de usuarios.
   */
  const [users, setUsers] = useState([]);

  /**
   * Mutación para crear un grupo.
   */
  const mutation = trpc.group.create.useMutation({
    onSuccess() {
      utils.user.getUserGroups.invalidate();
      navigation.navigate("Tabs");
    },
  });

  /**
   * Crea un nuevo grupo utilizando los datos proporcionados.
   */
  function createGroup() {
    mutation.mutateAsync({
      name,
      description,
      adminId: User.id,
      codeGroup,
      users,
    });
  }

  /**
   * Genera un código de grupo aleatorio.
   */
  function generateCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 6;
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    setCodeGroup(code);
  }

  /**
   * Copia el código de grupo al portapapeles.
   */
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(codeGroup);
  };

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="px-6">
        <View className="mb-4 flex flex-row justify-between">
          <Pressable onPress={navigation.goBack}>
            <Text className="text-blue">Cancelar</Text>
          </Pressable>
          <Text className="mr-10 self-center text-dark">Nuevo grupo</Text>
          <Pressable className="self-end" onPress={createGroup}>
            <Text className="font-semibold text-blue">OK</Text>
          </Pressable>
        </View>

        <View>
          <TextInput
            className={`${inputStyle}`}
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={setName}
            placeholder="Nombre del grupo *"
          />
          <TextInput
            className={`${inputStyle} h-20`}
            placeholderTextColor="#95999C"
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            multiline={true}
          />
        </View>

        <Pressable
          onPress={generateCode}
          className="mb-4 flex-row space-x-2 rounded-lg bg-white p-4"
        >
          <Icon name="codepen" size={20} color={"#1E88E5"} />
          <Text className="self-center text-base text-blue">
            Generar código
          </Text>
        </Pressable>
        <View className="flex-row items-center space-x-2">
          <Text className="text-dark">
            Código de invitación:{" "}
            <Text className="text-lg font-semibold tracking-widest text-blue">
              {codeGroup}
            </Text>
          </Text>
          {codeGroup && (
            <Icon onPress={copyToClipboard} name="copy" size={16} />
          )}
        </View>
      </View>
    </View>
  );
};

export default CreateGroupScreen;
