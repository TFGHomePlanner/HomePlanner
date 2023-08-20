import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { trpc } from "../../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { UserContextType } from "../../context/types";
import { UserContext } from "../../context/userContext";
import { pickImageAndUploadToS3 } from "../../components/ImagePickerC";

/**
 * @typedef {object} DetailsScreenProps Props necesarios para el componente DetailsScreen
 * @property {RouteProp<AppStackParamList, "DetailsList">} route Contiene los parametros que se le pasan a la ruta
 * @property {NativeStackNavigationProp<AppStackParamList, "DetailsList">} navigation Permite la navegación entre pantallas
 */
type DetailsScreenProps = {
  route: RouteProp<AppStackParamList, "DetailsList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "DetailsList">;
};
/**
 * Interfaz que muestra los detalles de una lista de la compra 
 * @param {DetailsScreenProps} props Propiedades del componente 
 */
const DetailsListScreen: React.FC<DetailsScreenProps> = ({
  route,
  navigation,
}) => {
  // Hook para obtener el contexto de TRPC
  const utils = trpc.useContext();

  // Obtener los datos de la lista de la ruta
  const { List } = route.params;
  const [isphoto, setisphoto] = useState<boolean>(List.imageURl ? true : false);
  // Obtener el contexto de usuario
  const { User } = useContext(UserContext) as UserContextType;
  
  /**
   * Función quedetermina si el usuario puede editar la lista
   * @returns {boolean} Devuelve true si el usuario puede editar la lista, false en caso contrario
   */
  function canEdit() {
    if (List.isClosed) return false;
    else if (!List.isPublic) return List.creatorId == User?.id || User.isAdmin;
    else return true;
  }

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    () => {
      const initialCheckedItems: { [key: string]: boolean } = {};
      List?.items.forEach((item) => {
        item.isPurchased
          ? (initialCheckedItems[item.name] = true)
          : (initialCheckedItems[item.name] = false);
      });
      return initialCheckedItems;
    }
  );

  // Mutación para cerrar la lista
  const { mutate: closeList } = trpc.list.closeList.useMutation({
    onSuccess: () => {
      // Invalidar la caché y regresar a la pantalla anterior
      utils.list.getAllLists.invalidate();
      navigation.goBack();
    },
  });
    // Mutación para eliminar la lista
  const { mutate: deleteList } = trpc.list.deletelist.useMutation({
    onSuccess: () => {
      // Invalidar la caché y regresar a la pantalla anterior
      utils.list.getAllLists.invalidate();
      navigation.goBack();
    },
  });

  // Mutación para actualizar la imagen de perfil
  const  mutation = trpc.list.uploadImage.useMutation({
    onSuccess: () => {
      setisphoto(true);
      utils.list.getAllLists.invalidate();
    },

  });
  // Mutación para actualizar un producto
  const { mutate: updateProduct } = trpc.list.updateProduct.useMutation({
    onSuccess: (output) => {
      // Actualizar el estado de los elementos marcados
      if (output.success == "added") {
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [output.product.name]: true,
        }));
      } else {
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [output.product.name]: false,
        }));
      }
      // Invalidar la caché
      utils.list.getAllLists.invalidate();
    },
    onError: (error) => {
      console.log("Error during the update:", error);
    },
  });
  /**
   * Metodo que se encarga de llamar al método de BD para actualizar el estado del producto.
   * @param id identificador del producto
   * @param itemName nombre del producto 
   * @param isPurchased booleano que indica si el producto está comprado o no
   */
  function checKItem(id: string, itemName: string, isPurchased: boolean) {
    updateProduct({ id, isPurchased });
  }
  /**
   * Funcion que se encarga de mostrar el popUp para editar o eliminar la lista
   * @param value valor que indica si se quiere editar o eliminar la lista
   */
  function popUpEvents(value: number) {
    const id = List.id;
    value == 1
      ? navigation.navigate("CreateList", { List: List, Edit: true })
      : deleteList({ id });
  }

  const handleImageSelected = async () => {
    pickImageAndUploadToS3((imageUrl) => {
      mutation.mutateAsync({
        id: List.id,
        imageUrl: imageUrl,   
      });
    });
  };

  return (
    <View className="h-screen w-screen px-6 pt-10">
      <View className="flex flex-row items-center justify-between px-4 py-2">
        <Text className="flex-1 text-center text-2xl font-bold text-pink">
          {List.name}
        </Text>
        {canEdit() && (
          <Menu onSelect={(value) => popUpEvents(value)}>
            <MenuTrigger>
              <Icon name="ellipsis-v" size={24} color="#F1889F" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption value={1} text="Editar" />
              <MenuOption value={2} text="Eliminar" />
            </MenuOptions>
          </Menu>
        )}
      </View>
      <View className="">
        <Text className="text-sm">{List.description}</Text>
      </View>
      <ScrollView>
        <View>
          {List?.items.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => {
                if (!List.isClosed) {
                  if (checkedItems[item.name]) {
                    checKItem(item.id, item.name, false);
                  } else {
                    checKItem(item.id, item.name, true);
                  }
                }
              }}
            >
              <View className=" flex flex-row pt-4">
                <View className="border-black h-7 w-7 flex-row rounded-md border-[1px] bg-pink">
                  {checkedItems[item.name] && (
                    <Icon
                      name="check"
                      className="px-1"
                      size={25}
                      color="black"
                    />
                  )}
                </View>
                <Text className="px-2 text-xl">{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {List.isClosed && List.imageURl && (
          <View className="w-full h-200 pt-4">
            <Text className="text-center text-xl font-bold text-balck"> Ticket de compra</Text>
            <Image
              className="w-full h-200"
              source={{ uri: List.imageURl }}
              style={{ width: "100%", height: 400 }}
            />
          </View>
        )}
      </ScrollView>
      <View className="w-full flex-col">
        {!List.isClosed && (
          <View className="w-full">
            <TouchableOpacity onPress={handleImageSelected} className=" items-center w-full flex flex-row bg-white rounded-lg border-b-dark border-2 justify-start mb-4 space-y-2">
              <View className = "rounded-lg w-10 h-10 bg-bgGray items-center mr-2">
                {!isphoto ?  
                  <Icon name="plus" size={40} color="black"/> :
                  <Icon name="pen" size={30} color="black"/>     
                }
              </View>
              <View className="flex flex-row justify-start w-full">
                <Text className="font-semibol text-lg">{isphoto ? "Actualizar ticket": "Añadir ticket"}</Text>
                {isphoto && <Icon name="check" size={30} color="green"/> }
              </View>
             
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeList({ id: List.id });
              }}
              className="mb-6 w-full"
            >
              <View className="flex w-full flex-row items-center justify-center rounded-xl bg-pink p-3">
                <Icon name="lock" size={20} color="white" className="mr-2" />
                <Text className="mx-2 px-4 text-center text-lg font-bold text-white">
                Cerrar lista
                </Text>
                <Icon name="lock" size={20} color="white" className="mr-2" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default DetailsListScreen;
