import React, { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Link } from "@react-navigation/native";
import { UserContext } from "../context/userContext";
import { UserContextType } from "../context/types";
import { trpc } from "../server/utils/trpc";
import { Mutation } from "@tanstack/react-query";



export function Profileinformation() {
  const {User} = useContext(UserContext) as UserContextType;
  const [edit, setEdit] = useState(false);
  const [newPassword, setnewPassword] = useState("");
  const [PasswordV, setnewPasswordVi] = useState(false);
  const [oldPassword, setoldPassword] = useState("");
  const [OldPasswordV, setnewOldPasswordVi] = useState(false);
  const [textInfo, settextInfo]  = useState("");

  const {data: UserProfile} = trpc.user.getUserByID.useQuery({id: User.id});
  const mutation = trpc.user.updateUserPassword.useMutation({
    onSuccess() {
      settextInfo("Contraseña actualizada");
      setEdit(false);
      setnewPassword("");
      setoldPassword("");
    }
  });

  function changePassword() {
    settextInfo("");
    if(newPassword.length < 8) settextInfo("Mínimo 8 caracteres");
    else if(UserProfile?.passwordHash == oldPassword) {
      mutation.mutateAsync({
        id: User.id,
        passwordHash: newPassword,
      });
    }
    else settextInfo("Lac contraseñas no coinciden");
  }

  
  return (
    <View>
      <Text className="font-bold text-lg">Datos personales</Text>
      <Text className="text-md pt-2 text-gray">Nombre: {UserProfile?.name}</Text>
      <Text className="text-md pt-2 text-gray">Correo: {UserProfile?.email}</Text>
      <View className="flex flex-col"> 
        {edit && 
          <View className="flex flex-col justify-start">
            <View className="flex flex-row w-full pr-8 items-center space-x-2">
              <TextInput className="w-full my-2 rounded-lg border-b-[1px] border-light bg-white px-4 py-2 text-dark" 
                placeholderTextColor="#95999C" 
                placeholder="Contraseña actual"
                value={oldPassword}
                onChangeText={setoldPassword}
                secureTextEntry={OldPasswordV}
              />
              <TouchableOpacity onPress={() =>setnewOldPasswordVi(!oldPassword)}>
                <Icon name="eye" size={20} color = "black" />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row w-full pr-8 items-center space-x-2">
              <TextInput className="w-full my-2 rounded-lg border-b-[1px] border-light bg-white px-4 py-2 text-dark" 
                placeholderTextColor="#95999C" 
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setnewPassword}
                secureTextEntry={PasswordV}
              />
              <TouchableOpacity onPress={() =>setnewPasswordVi(!PasswordV)}>
                <Icon name="eye" size={20} color = "black" />
              </TouchableOpacity>
            </View>
          </View>  
        }
        <Text className="text-blue text-md">{textInfo}</Text>
      </View>
      <TouchableOpacity className="ml-20 mt-4 rounded-full bg-blue p-2 w-40" onPress={() => !edit ? setEdit(true) : changePassword() }>
        <Text className="text-center text-white">{edit ? "Guardar contraseña" : "Editar contraseña"}</Text>
      </TouchableOpacity>             
    </View>   
  );
}