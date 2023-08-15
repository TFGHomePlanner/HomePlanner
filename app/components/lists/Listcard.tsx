import React from "react";
import { useNavigation } from "expo-router";
import { Pressable, Text, View} from "react-native";
import { IList } from "../../common/validation/list";
import Icon from "react-native-vector-icons/FontAwesome5";
import {AppStackParamList} from "../../_App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

/**
 * @typedef {object} ListCardProps Props necesarios para el componente ListCard
 * @property {NativeStackNavigationProp<AppStackParamList, "DetailsList">} navigation Permite la navegación entre pantallas
 * @property {IList} list Lista que se está editando
 * 
 */
type ListCardProps = {
   navigation: NativeStackNavigationProp<any>;
  list: IList;
};

/**
 * Componente que muestra una list en formato de tarjeta
 * @param {ListCardProps} props Propiedades del componente
 * @returns  {JSX.Element} ListCard componente de la lista
 */
const ListCard: React.FC< ListCardProps> = ({ navigation, list }) => {
  const firstFiveItems = list.items.slice(0, 4);
  //Función que se encarga de navegar a la pantalla de Detalles de lista.
  function move() {
    navigation.navigate("DetailsList", {List: list});
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
  