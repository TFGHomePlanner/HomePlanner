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
  return (
    <View className="h-full bg-light px-6 pt-16">
      <View className="flex-row justify-between">
        <Pressable onPress={navigation.goBack}>
          <Icon name="left" size={16} color={"#7B61FF"} />
        </Pressable>
        <Pressable>
          <Icon name="addusergroup" size={16} color={"#7B61FF"} />
        </Pressable>
      </View>
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
