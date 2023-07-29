import {View, Text, TextInput, ScrollView} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { IFavouriteProduct } from "../../common/validation/list";


type CreateListScreenProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, "CreateList">;
  };
const [list, setList] = useState<string[]>(["apple", "banana", "orange"]);
const updateList = (newItem: string) => {
  const index = list.indexOf(newItem);
  if (index !== -1) {
    setList((prevList) => prevList.filter((item) => item !== newItem));
  } else {
    setList((prevList) => [...prevList, newItem]);
  }
};

const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation }) => {
  return (
    <View className="h-full flex flex-col w-full bg-light">
      <Header/> 
      <ScrollView className = "flex-1 w-full">
        <View className = "p-4 justify-center items-center">
          <View className = "bg-light  w-full p-4 mb-4">
            <Text className = "text-xl font-bold text-gray-700 mb-2">Titulo <Text className="text-pink">*</Text></Text>
            <TextInput
              className = "bg-[#ffff] shadow-md  rounded-md px-4 py-2"
              placeholder="Escribe el título aquí"
            />
            <Text className = "mt-3 text-xl font-bold text-gray-700 mb-2">Descripción:</Text>
            <TextInput
              className ="bg-[#ffff] shadow-md  rounded-md px-4 py-2"
              placeholder="Escribe una descripción aquí"
              maxLength={80}
            />
          </View>
          <View className = "bg-light w-full px-4 pt-2 mb-4">
            <Text className = "text-start text-xl font-bold text-gray-700 mb-2">Permisos de edición:</Text>
            <View className = "bg-[#ffff] shadow-md  rounded-md p-2 pt-4 mb-2">
              <View className = "flex-row items-center mb-2">
                <View className = "w-5 h-5 border border-gray-400 mr-2 rounded-full"></View>
                <Text className = "text-gray-700 mr-4">Permitir</Text>
              </View>
              <View className = "flex-row items-center">
                <View className = "w-5 h-5 border border-gray-400 mr-2 rounded-full"></View>
                <Text className = "text-gray-700">Denegar</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
  
  
export default CreateListScreen;
  