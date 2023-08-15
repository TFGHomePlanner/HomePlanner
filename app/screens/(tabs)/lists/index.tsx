
import React from "react";
import AddIcon from "react-native-vector-icons/FontAwesome5";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { trpc } from "../../../server/utils/trpc";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import ListCard from "../../../components/lists/Listcard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
/**
 * @typedef {object} TabsListcreenProps Props necesarios para el componente TabsListcreen
 * @property {NativeStackNavigationProp<AppStackParamList, "TabLists">} navigation Permite la navegación entre pantallas
 * @property {boolean} Edit Indica si se está editando la lista
 * @property {List} List Lista que se está editando
 */
type TabsListcreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabLists">;
};
/**
 * Interfaz que muestra un listado de todas las listas de la compra del grupo
 * @param {TabsListcreenProps} props Propiedades del componente
 * @returns {JSX.Element} TabListsScreen comppoenete de la pantalla de listas
 */
const TabListsScreen : React.FC<TabsListcreenProps> = ({ navigation }) =>  {
  // Hook para obtener el contexto del usuario
  const {User} = React.useContext (UserContext) as UserContextType;
  //Método para obtener todas las listas del grupo que estan activas
  const {data: activelist} = trpc.list.getAllLists.useQuery ({
    groupId: User.groupId || "",
    isClosed: false,
  });
  //Método para obtener todas las listas del grupo que estan cerradas
  const {data: closedlist} = trpc.list.getAllLists.useQuery ({
    groupId: User.groupId || "",
    isClosed: true,
  });

  /** 
   * Función que se encarga de navegar a la pantalla de creación de listas.
   * @returns {void}
   * */
  function goToCreateList() {
    navigation.navigate("CreateList", {Edit: false});
  }

  return (
    <View className="bg-[#F8F3ED] p-4 w-full h-full">
      <TouchableOpacity onPress={goToCreateList}>
        <View className="bg-[#F1889f] p-3 rounded-xl flex flex-row items-center justify-start w-full">
          <AddIcon name="plus" size={20} color="white" className="mr-2" />
          <Text className="text-lg font-bold ml-2 text-white pl-4">Nueva lista</Text>
        </View>
      </TouchableOpacity>
      {/* ScrollView */}
      <ScrollView showsVerticalScrollIndicator={false} className="p-1">
        <Text className="text-lg font-bold mb-2">Listas</Text>
        {activelist?.map((list) => {
          return (
            <ListCard
              key={list.id}
              list={list}
              navigation={navigation}
            />
          );
        })}
        <Text className="text-lg font-bold mb-2">Listas cerradas</Text>
        {closedlist?.map((list) => {
          return (
            <ListCard
              key={list.id}
              list={list}
              navigation={navigation}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
export default TabListsScreen;