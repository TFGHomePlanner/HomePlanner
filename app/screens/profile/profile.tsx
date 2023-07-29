import { Pressable, Text, View } from "react-native";
import React, { useContext } from "react";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import Icon from "react-native-vector-icons/AntDesign";
import GroupCard from "../../components/groups/GroupCard";

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Profile">;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: userGroups } = trpc.user.getUserGroups.useQuery({
    userId: User.id,
  });

  function goToCreateGroup() {
    navigation.navigate("CreateGroup");
  }

  return (
    <View className="h-full bg-light px-6 pt-16">
      <Pressable onPress={navigation.goBack}>
        <Icon name="left" size={16} color={"#7B61FF"} />
      </Pressable>
      <Pressable
        onPress={goToCreateGroup}
        className="mt-4 flex-row space-x-2 rounded-lg bg-white p-4"
      >
        <Icon name="addusergroup" size={20} color={"#7B61FF"} />
        <Text className="self-center text-purple">Nuevo grupo</Text>
      </Pressable>
      <View className="my-6">
        {userGroups ? (
          userGroups.map((group) => <GroupCard key={group.id} group={group} />)
        ) : (
          <Text>Todavía no tienes grupos</Text>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;
