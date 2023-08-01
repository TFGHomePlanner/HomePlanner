import React, {useState} from "react";
import {View, Text} from "react-native";
import {trpc} from "../../server/utils/trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";

type DetailsScreenProps = {
  route: RouteProp<AppStackParamList, "DetailsList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "DetailsList">;
};

const DetailsListScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { List } = route.params;
  
  

  const {mutate} = trpc.list.updateProduct.useMutation({
    onSuccess: (output) => {
      if (output.success) {
        console.log("Product updated");
      } 
    },
    onError: (error) => {
      console.log("Error during the update:", error);
    },
  });

  const {User} = React.useContext(UserContext) as UserContextType;
  const {data: list} = trpc.list.getListById.useQuery({
    groupId: User.groupId,
    listId: List.id,
  });
  return (
    <View className="w-full h-full justify-end">
      <Text>Miniflusi</Text>
      <Text>{List.id}</Text>
      <Text>Miniflusi</Text>
    </View>
  );
};

export default DetailsListScreen;
  