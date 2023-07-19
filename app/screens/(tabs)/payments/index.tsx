import React from "react";
import { Text, View} from "react-native";
import { trpc } from "../../../server/utils/trpc";
import Message from "../../../components/Message";
const namegroup = "miniconsejo";

const { data: groupmessages } = trpc.chat.getAllMessages.useQuery ({
  groupId : "clk8kh4rx0003ucqko2cm5q85"
});
 

export default function TabPaymentsScreen() {
  return (
    <View className="h-full bg-[#F8F3ED]">
      {/* Cabecera */}
      <View className="w-full bg-[#f1889f]">
        <Text className="font-semibold text-center text-[18px] text-white p-4">Chat {namegroup}</Text>
      </View>
      <View>
        {groupmessages?.map((c) => {
          return (
            <Message
              key = {c.userId}
              text={c.text}
              day = {c.day}
              userId= {c.userId}
              Name = {c.User.name}
              imageProfile = {c.User.imageUrl}
            />
          );
        })}
      </View>
     
    </View>
  );
}


