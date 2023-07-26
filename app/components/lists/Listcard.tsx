import React from "react";
import { Text, View} from "react-native";
import { IList } from "../../common/validation/list";
import Icon from "react-native-vector-icons/FontAwesome5";
function ListCard({list,}: {list : IList}) {
  const firstFiveItems = list.items.slice(0, 4);
  return (
    <View className="flex flex-col mb-4 items-start rounded-lg  shadow-md shadow-black bg-[#fbf9f7] p-4">

      <View className="flex items-center justify-end w-full flex-row">
        <Icon name="store" size={20} color="black" /> 
        <Text className="ml-2 text-lg font-bold text-[#F1889f]">{list.Name}</Text>
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
  
  );
}
export default ListCard;
  