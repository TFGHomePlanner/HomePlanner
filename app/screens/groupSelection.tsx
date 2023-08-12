import React, { useContext } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
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
    <View className="h-full bg-light p-6 pt-16">
      <ScrollView>
        <Text className="mb-4">Elige un grupo para empezar</Text>
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
        <Pressable onPress={() => navigation.navigate("CreateGroup")}>
          <Icon name="shape-square-rounded-plus" size={24} color={"#1E88E5"} />
        </Pressable>
      </View>
    </View>
  );
};

export default GroupSelectionScreen;
