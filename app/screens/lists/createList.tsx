import {View, Text, TextInput, ScrollView, TouchableOpacity,} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/FontAwesome5";
import DeleteIcon from "react-native-vector-icons/FontAwesome5";
import { trpc } from "../../server/utils/trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { RouteProp } from "@react-navigation/native";
import { router } from "expo-router";
type CreateListScreenProps = {
    route: RouteProp<AppStackParamList, "CreateList">;
    navigation: NativeStackNavigationProp<AppStackParamList, "CreateList">;
  };


const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation, route }) => {

  // TRPC
  const utils = trpc.useContext();
  const mutation = trpc.list.createList.useMutation({
    onSuccess() {
      utils.list.getAllLists.invalidate();
      navigation.goBack();
    },
  });
  const List = route.params.List;
  const Edit = route.params.Edit;
  const {User} = React.useContext (UserContext) as UserContextType;
  const {data: favouriteProducts} = trpc.list.getAllFavouritesProducts.useQuery({
    groupId: User.groupId || "",
  });
  function CreateList() {
    mutation.mutateAsync({
      description: description,
      groupId: User.groupId || "",
      items: listItemes,
      name: title,
      creatorId: User.id,
      isPublic: true,
    });
  }



  //VAL
  const [isPublic, setIsPublic] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescrpition] = useState("");
  const [listItemes, setListItems] = useState<string[]>([]);
  const [selected, setSelected] = React.useState("");
  const frequency = [
    {key:"1", value:"Nunca"},
    {key:"2", value:"Cada dia"},
    {key:"3", value:"Cada semana"},
    {key:"4", value: "Cada mes"},
  ];
  const addItemToList = (newItem: string) => {
    if (!listItemes.includes(newItem)) {
      setListItems((prevList) => [...prevList, newItem]);
    }
    setNewItem("");
    if(newItem in checkedItems) {
      console.log("entro");
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [newItem]: true,
      })); 
      console.log("entro");
    }
  };
  
  const removeItemFromList = (itemToRemove: string) => {
    setListItems((prevList) => prevList.filter((item) => item !== itemToRemove));
    if(itemToRemove in checkedItems) {
      console.log("salgo");
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [itemToRemove]: false,
      })
      ); 
    }
  };
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    const initialCheckedItems: { [key: string]: boolean } = {};
    favouriteProducts?.forEach((item) => {
      initialCheckedItems[item.name] = false;
    });
    return initialCheckedItems;
  });

  const iseditable = () => {
    if(Edit){
      setIsPublic(List?.isPublic || true);
      settitle(List?.name || ""),
      setdescrpition(List?.description || ""),
      List?.items?.map((item) => addItemToList(item.name));
    }
  };
  useEffect(() => {iseditable();}, []);

  return (
    <View className="h-full flex flex-col w-full bg-light">
      <Header/> 
      <ScrollView className = "flex-1 w-full">
        <View className = "p-4 justify-center items-center">
          <View className = "bg-light  w-full p-4 mb-4">
            <Text className = "text-xl font-bold text-gray-700 mb-2">Titulo <Text className="text-pink">*</Text></Text>
            <TextInput
              value = {title}
              className = "bg-[#ffff] shadow-md  rounded-md px-4 py-2"
              placeholderTextColor="#F1999F"
              placeholder="Escribe el título aquí"
              onChangeText={(text) => settitle(text)}
            />
            <Text className = "mt-3 text-xl font-bold text-gray-700 mb-2">Descripción:</Text>
            <TextInput
              value = {description}
              className ="bg-[#ffff] shadow-md  rounded-md px-4 py-2"
              placeholderTextColor="#F1999F"
              placeholder="Escribe una descripción aquí"
              maxLength={80}
              onChangeText={(text) => setdescrpition(text)}
            />
          </View>
          <View className = "bg-light w-full px-4 pt-2 mb-4">
            <Text className = "text-start text-xl font-bold text-gray-700 mb-2">Permisos de edición:</Text>
            <View className = "bg-[#ffff] shadow-md  rounded-md p-2 pt-4 mb-2">
              <View>
                <TouchableOpacity className="flex flex-row aling-items-center pb-3" onPress={() => setIsPublic(true)}>
                  <View className= {`w-6 h-6 rounded-full border-2 border-gray mr-4 ${isPublic ? "bg-pink" : "bg-grey"}`}/>
                  <Text className="text-md">Permitir</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-row aling-items-center" onPress={() => setIsPublic(false)}>
                  <View className= {`w-6 h-6 rounded-full border-2 border-gray mr-4  ${isPublic ? "bg-gray" : "bg-pink"}`}/>
                  <Text className="text-md pt-1">No permitir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className = "bg-light w-full px-4 pt-2 mb-4">
            <Text className = "text-start text-xl font-bold text-gray-700 mb-2">Productos favoritos:</Text>
            <View className="bg-[#ffff] shadow-md  rounded-md p-2 pt-4 mb-2">
              <ScrollView>
                <View>
                  {favouriteProducts?.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      onPress={() => {
                        if (checkedItems[item.name]) {
                          removeItemFromList(item.name);
                        } else {
                          addItemToList(item.name);
                        }
                      }}
                    >
                      <View className="flex flex-row pt-2">
                        <View className = "bg-pink border-[1px] border-black h-5 w-5 flex-row rounded-full items-center">
                          {checkedItems[item.name] && <Icon name="check" className="px-1" size={15} color="black" />}
                        </View>
                        <Text className = "px-2">{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View className="flex-row items-center w-full px-4 pt-2 mb-4">
            {/* Input para el nuevo ítem */}
            <TextInput
              className="bg-[#ffff] shadow-md rounded-md px-4 py-2 mr-2 flex-1"
              placeholderTextColor="#F1999F"
              placeholder="Agregar nuevo ítem"
              value={newItem}
              onChangeText={(text) => setNewItem(text)}
            />
            {/* Ícono que llama al método updateList */}
            <TouchableOpacity onPress={() => addItemToList(newItem)}>
              <Icon name="plus" size={20} color="pink" className="mr-2" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap">
            {listItemes.map((item) => (
              <TouchableOpacity key={item} onPress={() => removeItemFromList(item)}>
                <View className="bg-pink rounded-full px-3 py-2 m-2 flex flex-row justify-between items-center">
                  <Text className="text-white font-bold px-1">{item}</Text>
                  <DeleteIcon name="times" size={12} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className = "bg-light w-full px-4 pt-2 mb-4">
          <Text className = "text-start text-xl font-bold text-gray-700 mb-2">Lista Recurrente:</Text>
          <SelectList 
            setSelected={(val: React.SetStateAction<string>) => setSelected(val)} 
            data={frequency} 
            save="value"
          />
        </View>
        <View className="flex-row w-full px-4 pt-2 mb-4">
          <TouchableOpacity onPress={CreateList} className="w-full">
            <View className="bg-[#F1999F] p-3 rounded-xl flex flex-row items-center justify-start w-full">
              <Icon name="plus" size={20} color="white" className="mr-2" />
              <Text className="text-lg font-bold ml-2 text-white pl-4">Crear lista</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
  
  
export default CreateListScreen;
  