import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../context/userContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../_App";
import { IUser, UserContextType } from "../context/types";
import { trpc } from "../trpc";
import GroupCard from "../components/groups/GroupCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GroupSelectionScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "GroupSelection">;
};

const GroupSelectionScreen: React.FC<GroupSelectionScreenProps> = ({
  navigation,
}) => {
  const { User, updateUser } = useContext(UserContext) as UserContextType;
  const { data: myGroups } = trpc.user.getUserGroups.useQuery({
    userId: User.id,
  });

  const [error, setError] = useState("");

  const utils = trpc.useContext();
  const joinMutation = trpc.group.joinGroup.useMutation({
    onSuccess(data) {
      if (data.status === 200 && data.groupId !== null) {
        utils.user.getUserGroups.invalidate();
        navigation.navigate("Tabs");
        selectGroup(data.groupId);
      } else if (data.status === 404) {
        setError("No se ha encontrado un grupo con este código.");
      } else if (data.status === 400) {
        setError("Ya estás en el grupo.");
      } else {
        setError("Ha ocurrido un error desconocido.");
      }
    },
  });

  function joinGroup() {
    joinMutation.mutateAsync({ userId: User.id, codeGroup: codeGroup });
  }

  const [codeGroup, setCodeGroup] = useState("");
  const [enabled, setEnabled] = useState(false);

  const mutation = trpc.group.getAdminId.useMutation({
    onSuccess(output) {
      const user: IUser = {
        ...User,
        isAdmin: User.id == output?.adminId,
      };
      updateUser(user);
      navigation.navigate("Tabs");
    },
  });

  function selectGroup(groupId: string) {
    const user: IUser = {
      id: User.id,
      groupId: groupId,
      isAdmin: false,
    };
    updateUser(user);
    mutation.mutateAsync({ id: groupId });
  }
  useEffect(() => {
    const checkUserData = async () => {
      if(User.id == "") {
        try {
          const userData = await AsyncStorage.getItem("userData");
          if (userData !== null) {
            console.log("User data found in cache:", userData);
            const user: IUser = {
              id: JSON.parse(userData),
              groupId: "",
              isAdmin: false,
            };
            console.log("User data found in cache:", user);
            updateUser(user); 
          
          }
        } catch (error) {
          console.error("Error al verificar los datos del usuario en la caché:", error);
        
        }
      }
    };
    checkUserData();
  }, [User, updateUser]);
  return (
    <View className="h-full bg-light p-6 pb-10 pt-16">
      <Text className="mb-2 text-lg font-bold text-dark">
        <Text className="text-blue">ÚNETE</Text> A UN GRUPO
      </Text>
      <View className="mb-2 w-full flex-row items-center space-x-3">
        <TextInput
          className={"flex-1 rounded-lg bg-white px-4 py-3 text-dark"}
          placeholderTextColor="#95999C"
          value={codeGroup}
          onChangeText={(code) => {
            setCodeGroup(code);
            setEnabled(
              code.trim() !== "" && code.replace(/\s/g, "").length === 6
            );
            setError("");
          }}
          placeholder="Código de invitación"
        />
        <Text
          className={`${
            enabled ? "text-blue" : "text-darkGray"
          } text-base font-semibold`}
          onPress={joinGroup}
        >
          OK
        </Text>
      </View>
      {error && <Text className="mb-2">{error}</Text>}
      <ScrollView>
        <Text className="mb-2 mt-4 text-lg font-bold text-dark">
          O ELIGE UNO DE TUS GRUPOS
        </Text>
        {myGroups ? (
          myGroups.map((group) => (
            <TouchableOpacity
              onPress={() => selectGroup(group.id)}
              key={group.id}
            >
              <GroupCard group={group} />
            </TouchableOpacity>
          ))
        ) : (
          <Text>Cargando...</Text>
        )}
      </ScrollView>
      <View className="flex-row items-center">
        <Text className="flex-1 text-center">{myGroups?.length} grupos</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateGroup")}>
          <Icon name="shape-square-rounded-plus" size={30} color={"#1E88E5"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupSelectionScreen;
