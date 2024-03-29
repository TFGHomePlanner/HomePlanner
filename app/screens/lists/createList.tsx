import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/FontAwesome5";
import { trpc } from "../../server/utils/trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { RouteProp } from "@react-navigation/native";

/**
 * @typedef {object} CreateListScreenProps Props necesarios para el componente CreateListScreen
 * @property {RouteProp<AppStackParamList, "CreateList">} route Contiene los parametros que se le pasan a la ruta
 * @property {NativeStackNavigationProp<AppStackParamList, "CreateList">} navigation Permite la navegación entre pantallas
 */
type CreateListScreenProps = {
  route: RouteProp<AppStackParamList, "CreateList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateList">;
};
/**
 * Pantalla para crear o editar una lista.
 * @param {CreateListScreenProps} props - Propiedades para el componente CreateListScreen.
 * @return {JSX.Element} Elemento JSX que representa la pantalla.
 */
const CreateListScreen: React.FC<CreateListScreenProps> = ({
  navigation,
  route,
}) => {
  // Constate para invalidar queries.
  const utils = trpc.useContext();

  // Mutación para actualizar una lista
  const updateListMutation = trpc.list.updateList.useMutation({
    onSuccess() {
      utils.list.getAllLists.invalidate();
      navigation.navigate("TabLists");
    },
  });

  // Mutación para crear una lista
  const createListMutation = trpc.list.createList.useMutation({
    onSuccess() {
      utils.list.getAllLists.invalidate();
      navigation.goBack();
    },
  });

  // Obtener parametros de la pantalla anterior
  const List = route.params.List;
  const Edit = route.params.Edit;
  const { User } = React.useContext(UserContext) as UserContextType;
  const { data: favouriteProducts } =
    trpc.list.getAllFavouritesProducts.useQuery({
      groupId: User.groupId,
    });

  /**
   * Crea una nueva lista.
   * @return {void}
   */
  function CreateList() {
    createListMutation.mutateAsync({
      description: description,
      groupId: User.groupId,
      items: listItemes,
      name: title,
      creatorId: User.id,
      isPublic: true,
    });
  }
  /**
   *Edita la lista pasada por parámetoes
   * @return {void}
   */
  function EditList() {
    updateListMutation.mutateAsync({
      description: description,
      groupId: User.groupId,
      items: listItemes,
      name: title,
      creatorId: User.id,
      isPublic: true,
      id: List?.id || "",
      isClosed: false,
    });
  }

  //variables de estado
  const [isPublic, setIsPublic] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescrpition] = useState("");
  const [listItemes, setListItems] = useState<string[]>([]);
  const [selected, setSelected] = React.useState("");
  const frequency = [
    { key: "1", value: "Nunca" },
    { key: "2", value: "Cada dia" },
    { key: "3", value: "Cada semana" },
    { key: "4", value: "Cada mes" },
  ];

  /**
   * Método para añadir un nuevo producto a la lista.
   * @param newItem nombre del producto a añdir a la lista
   */
  const addItemToList = (newItem: string) => {
    if (!listItemes.includes(newItem)) {
      setListItems((prevList) => [...prevList, newItem]);
    }
    setNewItem("");
    if (newItem in checkedItems) {
      console.log("entro");
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [newItem]: true,
      }));
      console.log("entro");
    }
  };
  /**
   * metodo para eliminar un producto de la lista
   * @param itemToRemove nombre del producto a eliminar de la lista
   */

  const removeItemFromList = (itemToRemove: string) => {
    setListItems((prevList) =>
      prevList.filter((item) => item !== itemToRemove)
    );
    if (itemToRemove in checkedItems) {
      console.log("salgo");
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [itemToRemove]: false,
      }));
    }
  };
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    () => {
      const initialCheckedItems: { [key: string]: boolean } = {};
      favouriteProducts?.forEach((item) => {
        initialCheckedItems[item.name] = false;
      });
      return initialCheckedItems;
    }
  );
  /**
   * Metodo para saber si la lista es editable o no y setear los valores de los inputs
   */
  const iseditable = () => {
    if (Edit) {
      setIsPublic(List?.isPublic || true);
      settitle(List?.name || ""),
      setdescrpition(List?.description || ""),
      List?.items?.map((item) => addItemToList(item.name));
    }
  };
  //useEffect para setear los valores de los inputs
  useEffect(() => {
    iseditable();
  }, []);

  return (
    <View className="flex h-full w-full flex-col bg-light">
      <Header />
      <ScrollView className="w-full flex-1">
        <View className="items-center justify-center p-4">
          <View className="mb-4  w-full bg-light p-4">
            <Text className="text-gray-700 mb-2 text-xl font-bold">
              Titulo <Text className="text-pink">*</Text>
            </Text>
            <TextInput
              value={title}
              className="rounded-md bg-[#ffff]  px-4 py-2 shadow-md"
              placeholderTextColor="#F1999F"
              placeholder="Escribe el título aquí"
              onChangeText={(text) => settitle(text)}
            />
            <Text className="text-gray-700 mb-2 mt-3 text-xl font-bold">
              Descripción:
            </Text>
            <TextInput
              value={description}
              className="rounded-md bg-[#ffff]  px-4 py-2 shadow-md"
              placeholderTextColor="#F1999F"
              placeholder="Escribe una descripción aquí"
              maxLength={80}
              onChangeText={(text) => setdescrpition(text)}
            />
          </View>
          <View className="mb-4 w-full bg-light px-4 pt-2">
            <Text className="text-gray-700 mb-2 text-start text-xl font-bold">
              Permisos de edición:
            </Text>
            <View className="mb-2 rounded-md  bg-[#ffff] p-2 pt-4 shadow-md">
              <View>
                <TouchableOpacity
                  className="aling-items-center flex flex-row pb-3"
                  onPress={() => setIsPublic(true)}
                >
                  <View
                    className={`border-gray mr-4 h-6 w-6 rounded-full border-2 ${
                      isPublic ? "bg-pink" : "bg-grey"
                    }`}
                  />
                  <Text className="text-md">Permitir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="aling-items-center flex flex-row"
                  onPress={() => setIsPublic(false)}
                >
                  <View
                    className={`border-gray mr-4 h-6 w-6 rounded-full border-2  ${
                      isPublic ? "bg-gray" : "bg-pink"
                    }`}
                  />
                  <Text className="text-md pt-1">No permitir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="mb-4 w-full bg-light px-4 pt-2">
            <Text className="text-gray-700 mb-2 text-start text-xl font-bold">
              Productos favoritos:
            </Text>
            <View className="mb-2 rounded-md  bg-[#ffff] p-2 pt-4 shadow-md">
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
                        <View className="border-black h-5 w-5 flex-row items-center rounded-full border-[1px] bg-pink">
                          {checkedItems[item.name] && (
                            <Icon
                              name="check"
                              className="px-1"
                              size={15}
                              color="black"
                            />
                          )}
                        </View>
                        <Text className="px-2">{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View className="mb-4 w-full flex-row items-center px-4 pt-2">
            {/* Input para el nuevo ítem */}
            <TextInput
              className="mr-2 flex-1 rounded-md bg-[#ffff] px-4 py-2 shadow-md"
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
              <TouchableOpacity
                key={item}
                onPress={() => removeItemFromList(item)}
              >
                <View className="m-2 flex flex-row items-center justify-between rounded-full bg-pink px-3 py-2">
                  <Text className="px-1 font-bold text-white">{item}</Text>
                  <Icon name="times" size={12} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="mb-4 w-full bg-light px-4 pt-2">
          <Text className="text-gray-700 mb-2 text-start text-xl font-bold">
            Lista Recurrente:
          </Text>
          <SelectList
            setSelected={(val: React.SetStateAction<string>) =>
              setSelected(val)
            }
            data={frequency}
            save="value"
          />
        </View>
        <View className="mb-4 w-full flex-row px-4 pt-2">
          <TouchableOpacity
            onPress={Edit ? EditList : CreateList}
            className="w-full"
          >
            <View className="flex w-full flex-row items-center justify-start rounded-xl bg-[#F1999F] p-3">
              <Icon name="plus" size={20} color="white" className="mr-2" />
              <Text className="ml-2 pl-4 text-lg font-bold text-white">
                {Edit ? "Editar Lsita" : "Crear lista"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateListScreen;
