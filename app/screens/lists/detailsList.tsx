import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { trpc } from "../../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { UserContextType } from "../../context/types";
import { UserContext } from "../../context/userContext";

type DetailsScreenProps = {
  route: RouteProp<AppStackParamList, "DetailsList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "DetailsList">;
};

const DetailsListScreen: React.FC<DetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const utils = trpc.useContext();
  const { List } = route.params;
  const { User } = useContext(UserContext) as UserContextType;
  console.log(List);

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

  const { mutate: closeList } = trpc.list.closeList.useMutation({
    onSuccess: () => {
      utils.list.getAllLists.invalidate();
      navigation.goBack();
    },
  });

  const { mutate: deleteList } = trpc.list.deletelist.useMutation({
    onSuccess: () => {
      utils.list.getAllLists.invalidate();
      navigation.goBack();
    },
  });
  const { mutate: updateProduct } = trpc.list.updateProduct.useMutation({
    onSuccess: (output) => {
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
      console.log(checkedItems);
      utils.list.getAllLists.invalidate();
    },
    onError: (error) => {
      console.log("Error during the update:", error);
    },
  });

  function checKItem(id: string, itemName: string, isPurchased: boolean) {
    updateProduct({ id, isPurchased });
  }

  function uncheckItem(id: string, itemName: string, isPurchased: boolean) {
    updateProduct({ id, isPurchased });
  }
  function popUpEvents(value: number) {
    const id = List.id;
    value == 1
      ? navigation.navigate("CreateList", { List: List, Edit: true })
      : deleteList({ id });
  }

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
                    uncheckItem(item.id, item.name, true);
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
      </ScrollView>
      <View className="w-full flex-row">
        {!List.isClosed ? (
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
        ) : (
          <View className="w-full">
            <Image
              source={require("../../../assets/images/ticket.jpg")}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default DetailsListScreen;
