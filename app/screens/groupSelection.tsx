import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
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

  const utils = trpc.useContext();
  const joinMutation = trpc.group.joinGroup.useMutation({
    onSuccess() {
      utils.user.getUserGroups.invalidate();
    },
  });

  function joinGroup() {
    joinMutation.mutateAsync({ userId: User.id, codeGroup: codeGroup });
  }

  const [codeGroup, setCodeGroup] = useState("");

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

  return (
    <View className="h-full bg-light p-6 pb-10 pt-16">
      <Text className="mb-2 text-lg font-bold text-dark">
        <Text className="text-blue">ÚNETE</Text> A UN GRUPO
      </Text>
      <View className="mb-6 w-full flex-row items-center space-x-3">
        <TextInput
          className={"flex-1 rounded-lg bg-white px-4 py-3 text-dark"}
          placeholderTextColor="#95999C"
          value={codeGroup}
          onChangeText={setCodeGroup}
          placeholder="Código de invitación"
        />
        <Text className="text-base font-semibold text-blue">OK</Text>
      </View>
      <ScrollView>
        <Text className="mb-2 text-lg font-bold text-dark">
          O ELIGE UNO DE TUS GRUPOS
        </Text>
        {myGroups ? (
          myGroups.map((group) => (
            <Pressable onPress={() => selectGroup(group.id)} key={group.id}>
              <GroupCard group={group} />
            </Pressable>
          ))
        ) : (
          <Text>Todavía no tienes grupos</Text>
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
