import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Header } from "../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { IUser, UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { Divider } from "@ui-kitten/components";

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
   * Contexto del usuario actual.
   */
  const { User, updateUser } = useContext(UserContext) as UserContextType;
  /**
   * Utilidades de trpc para gestionar grupos y usuarios.
   */
  const utils = trpc.useContext();

  /**
   * Estado local para el nombre del grupo.
   */
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(false);
  /**
   * Estado local para la descripción del grupo.
   */
  const [description, setDescription] = useState("");

  /**
   * Estado local para el código del grupo generado.
   */
  const [codeGroup, setCodeGroup] = useState("");

  /**
   * Mutación para crear un grupo.
   */
  const mutation = trpc.group.create.useMutation({
    onSuccess(data) {
      utils.user.getUserGroups.invalidate();
      navigation.navigate("Tabs");
      const user: IUser = {
        id: User.id,
        groupId: data.groupId,
        isAdmin: true,
      };
      updateUser(user);
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

    setName(name);
    setEnabled(name.trim() !== "" && code !== "");
  }

  /**
   * Copia el código de grupo al portapapeles.
   */
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(codeGroup);
  };

  /**
   * Estilo de los campos de entrada.
   */
  const inputStyle =
    "mb-4 bg-white rounded-lg space-y-3 text-base border-light p-4 text-dark";

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="px-6">
        <View className="mb-4 flex flex-row justify-between">
          <TouchableOpacity onPress={navigation.goBack}>
            <Text className="text-blue">Cancelar</Text>
          </TouchableOpacity>
          <Text className="mr-10 self-center text-dark">Nuevo grupo</Text>
          <TouchableOpacity
            disabled={!enabled}
            className="self-end"
            onPress={createGroup}
          >
            <Text
              className={`${
                enabled ? "text-blue" : "text-darkGray"
              } font-semibold`}
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
        <View className={`my-6 ${inputStyle}`}>
          <TextInput
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={(newName) => {
              setName(newName);
              setEnabled(newName.trim() !== "" && codeGroup !== "");
            }}
            placeholder="Nombre del grupo *"
          />
          <Divider />
          <TextInput
            placeholderTextColor="#95999C"
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            multiline={true}
          />
        </View>
        <TouchableOpacity
          onPress={generateCode}
          className="mb-4 flex-row space-x-2 rounded-lg bg-white p-4"
        >
          <Icon name="codepen" size={20} color={"#1E88E5"} />
          <Text className="self-center text-base text-blue">
            Generar código
          </Text>
        </TouchableOpacity>
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
