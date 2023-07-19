import React from "react";
import { Text, View, TextInput, Pressable} from "react-native";
import { trpc } from "../../../server/utils/trpc";
import Message from "../../../components/Message";

const utils = trpc.useContext();
const namegroup = "miniconsejo";

const { data: groupmessages } = trpc.chat.getAllMessages.useQuery ({
  groupId : "clk8kh4rx0003ucqko2cm5q85"
});

const mutation = trpc.chat.createmessage.useMutation({
  onSuccess() {
    utils.chat.getAllMessages.invalidate();
  },
});
 

export default function TabPaymentsScreen() {
  return (
    <View className="h-full bg-[#F8F3ED] flex flex-col">
      {/* Cabecera */}
      <View className="w-full bg-[#f1889f]">
        <Text className=" font-semibold text-center text-[18px] text-white p-4">Chat {namegroup}</Text>
      </View>
      <View className=" w-full bg-orange-400">
        {/**groupmessages?.map((c) => {
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
        })**/<Text>namegroup</Text>}
      </View>
      <View className="min-h-screen flex flex-row  top-10 w-full justify-between bg-amber-200">
        <TextInput><Text>Escribe aquí tu mensaje</Text></TextInput>
        <Pressable className="border-blue-300 bs"><Text>Enviar</Text></Pressable>
      </View>
    </View>
  );
}


