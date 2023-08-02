import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { UserContext } from "../context/userContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../_App";
import { IUser, UserContextType } from "../context/types";
import { trpc } from "../trpc";

// Define el tipo de props para el componente LoginScreen
type GroupSelectionScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Login">;
};

const GroupSelectionScreen: React.FC<GroupSelectionScreenProps> = ({
  navigation,
}) => {
  const { User, updateUser } = useContext(UserContext) as UserContextType;
  const { data: myGroups } = trpc.user.getUserGroups.useQuery({
    userId: User.id,
  });

  function selectGroup(groupId: string) {
    const user: IUser = {
      id: User.id,
      groupId: groupId,
    };
    updateUser(user);
    console.log(user);
    navigation.navigate("Tabs");
  }

  return (
    <View>
      {myGroups ? (
        myGroups.map((group) => (
          <Pressable
            className="bg-light p-16"
            onPress={() => selectGroup(group.id)}
            key={group.id}
          >
            <Text>{group.name}</Text>
          </Pressable>
        ))
      ) : (
        <Text>Todavía no tienes grupos</Text>
      )}
    </View>
  );
};

export default GroupSelectionScreen;
