import React from "react";
import { useNavigation } from "expo-router";
import { Pressable, Text, View} from "react-native";
import { IList } from "../../common/validation/list";
import Icon from "react-native-vector-icons/FontAwesome5";
import {AppStackParamList} from "../../_App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type ListCardProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "ListCard">;
  list: IList;
};


const ListCard: React.FC< ListCardProps> = ({ navigation, list }) => {
  const firstFiveItems = list.items.slice(0, 4);

  function move() {
    const navigation = useNavigation();
    navigation.navigate("OpenList", {idList: list.id});
  }
  return (
    <Pressable onPress={move}>
      <View className="flex flex-col mb-4 items-start rounded-lg  shadow-md shadow-black bg-[#fbf9f7] p-4">
        <View className="flex justify-between w-full flex-row">
          <View className = "flex flex-row">
            <Icon name="store" size={20} color="black" /> 
            <Text className="ml-2 -mt-1 text-lg font-bold text-[#F1889f]">{list.name}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="black" />
        </View>

        <View className="mt-3">
          {firstFiveItems.map((item, index) => (
            <View key={index} className="flex flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-black mr-2" />
              <Text className="text-sm">{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};
export default ListCard;
  