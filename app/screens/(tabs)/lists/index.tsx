
import React from "react";
import AddIcon from "react-native-vector-icons/FontAwesome5";
import { Text, View, ScrollView } from "react-native";
import { trpc } from "../../../server/utils/trpc";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import ListCard from "../../../components/lists/Listcard";

export default function TabListsScreen() {
  const {User} = React.useContext (UserContext) as UserContextType;
  const {data: activelist} = trpc.list.getAllLists.useQuery ({
    groupId: User.groupId,
    isClosed: false,
  });
  const {data: closedlist} = trpc.list.getAllLists.useQuery ({
    groupId: User.groupId,
    isClosed: true,
  });

  return (
    <View className="bg-[#F8F3ED] p-4 w-full h-full">
      <View className="bg-[#F1889f] p-3 rounded-xl flex flex-row items-center justify-start w-full">
        <AddIcon name="plus" size={20} color="white" className="mr-2" />
        <Text className="text-lg font-bold ml-2 text-white pl-4">Nueva lista</Text>
      </View>
      {/* ScrollView */}
      <ScrollView className="p-1">
        
        <Text className="text-lg font-bold mb-2">Listas</Text>
        {activelist?.map((list) => {
          return (
            <ListCard
              key={list.id}
              list={list}
            />
          );
        })}
        <Text className="text-lg font-bold mb-2">Listas cerradas</Text>
        {closedlist?.map((list) => {
          return (
            <ListCard
              key={list.id}
              list={list}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

