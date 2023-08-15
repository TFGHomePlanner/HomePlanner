import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { UserContext } from "../context/userContext";
import { UserContextType } from "../context/types";
import { trpc } from "../server/utils/trpc";

/**
 * 
 * @returns {JSX.Element} Profileinformation componente de la información del perfil
 */
export function Profileinformation() {
  // Hook para obtener el contexto de usuario
  const { User } = useContext(UserContext) as UserContextType;
  //Varialbes de estado
  const [edit, setEdit] = useState(false);
  const [newPassword, setnewPassword] = useState("");
  const [PasswordV, setnewPasswordVi] = useState(false);
  const [oldPassword, setoldPassword] = useState("");
  const [OldPasswordV, setnewOldPasswordVi] = useState(false);
  const [textInfo, settextInfo] = useState("");

  // Hook para obtener el perfil del usuario
  const { data: UserProfile } = trpc.user.getUserByID.useQuery({ id: User.id });
  //Mutation para actualizar la contraseña
  const mutation = trpc.user.updateUserPassword.useMutation({
    onSuccess() {
      settextInfo("Contraseña actualizada");
      setEdit(false);
      setnewPassword("");
      setoldPassword("");
    },
  });
  //Método para cambiar la contraseña
  function changePassword() {
    settextInfo("");
    if (newPassword.length < 8) settextInfo("Mínimo 8 caracteres");
    else if (UserProfile?.passwordHash == oldPassword) {
      mutation.mutateAsync({
        id: User.id,
        passwordHash: newPassword,
      });
    } else settextInfo("Lac contraseñas no coinciden");
  }

  return (
    <View>
      <Text className="text-lg font-bold">Datos personales</Text>
      <Text className="text-md text-gray pt-2">
        Nombre: {UserProfile?.name}
      </Text>
      <Text className="text-md text-gray pt-2">
        Correo: {UserProfile?.email}
      </Text>
      <View className="flex flex-col">
        {edit && (
          <View className="flex flex-col justify-start pr-8">
            <View className="flex w-full flex-row items-center space-x-2">
              <TextInput
                className="my-2 w-full rounded-lg border-b-[1px] border-light bg-white px-4 py-2 text-dark"
                placeholderTextColor="#95999C"
                placeholder="Contraseña actual"
                value={oldPassword}
                onChangeText={setoldPassword}
                secureTextEntry={OldPasswordV}
              />
              <TouchableOpacity
                onPress={() => setnewOldPasswordVi(!oldPassword)}
              >
                <Icon name="eye" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View className="flex w-full flex-row items-center space-x-2">
              <TextInput
                className="my-2 w-full rounded-lg border-b-[1px] border-light bg-white px-4 py-2 text-dark"
                placeholderTextColor="#95999C"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setnewPassword}
                secureTextEntry={PasswordV}
              />
              <TouchableOpacity onPress={() => setnewPasswordVi(!PasswordV)}>
                <Icon name="eye" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text className="text-md mb-2 text-blue">{textInfo}</Text>
      </View>
      <TouchableOpacity
        className="ml-20 w-40 rounded-full bg-blue p-2"
        onPress={() => (!edit ? setEdit(true) : changePassword())}
      >
        <Text className="text-center text-white">
          {edit ? "Guardar contraseña" : "Editar contraseña"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
