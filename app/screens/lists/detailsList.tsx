import React, {useState} from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {trpc} from "../../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

type DetailsScreenProps = {
  route: RouteProp<AppStackParamList, "DetailsList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "DetailsList">;
};

const DetailsListScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const utils = trpc.useContext();
  const { List } = route.params;
  console.log(List);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    const initialCheckedItems: { [key: string]: boolean } = {};
    List?.items.forEach((item) => {
      item.isPurchased ? initialCheckedItems[item.name] = true : initialCheckedItems[item.name] = false;
    });
    return initialCheckedItems;
  });

  const {mutate} = trpc.list.updateProduct.useMutation({
    onSuccess: (output) => {
      if (output.success == "added") {
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [output.product.name]: true,
        })); 
      }
      else {
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [output.product.name]: false,
        })
        );
      }
      console.log(checkedItems);
      utils.list.getAllLists.invalidate();
    },
    onError: (error) => {
      console.log("Error during the update:", error);
    },
  });

  function checKItem(id: string, itemName: string, isPurchased: boolean) {
    mutate({id, isPurchased});
  }

  function uncheckItem(id: string, itemName: string, isPurchased: boolean) { 
    mutate({id, isPurchased});
  }

  return (
    <View className="w-screen h-screen">
      <Text> Culo</Text>
      <ScrollView>
        <View>
          {List?.items.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => {
                if (checkedItems[item.name]) {
                  checKItem(item.id, item.name ,false);
                } else {
                  uncheckItem(item.id, item.name, true);
                }
              }}
            >
              <View className="flex flex-row pt-2">
                <View className = "bg-pink border-[1px] border-black h-5 w-5 flex-row rounded-full">
                  {checkedItems[item.name] && <Icon name="check" className="px-1" size={15} color="black" />}
                </View>
                <Text className = "px-2">{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailsListScreen;
  