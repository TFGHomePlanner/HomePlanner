import React from "react";
import { Text, View, TextInput, Pressable} from "react-native";
import { trpc } from "../server/utils/trpc";
import Message from "../components/Message";


const ChatScreen = () => {

  const utils = trpc.useContext();
  const namegroup = "miniconsejo";
    
  const {data: groupmessages} = trpc.chat.getAllMessages.useQuery ({
    GroupId : "clk9yp8jj0000ucr4697vt5nq"
  });
  console.log(groupmessages); 
  const mutation = trpc.chat.createmessage.useMutation({
    onSuccess() {
      utils.chat.getAllMessages.invalidate();
    },
  });
  return (
    <View className="h-full bg-[#F8F3ED] flex flex-col">
      {/* Cabecera */}
      <View className="w-full bg-[#f1889f]">
        <Text className=" font-semibold text-center text-[18px] text-white p-4 pt-8">Chat {namegroup}</Text>
      </View>
      <View className=" w-full bg-[#F8F3ED] ">
        {groupmessages?.map((c) => {
          return (
            <Message
              key = {c.Id}
              text={c.Text}
              day = {c.Day}
              userId= {c.UserId}
              Name = {c.User.name}
              imageProfile = {c.User.imageprofile || ""}
            />
          );
        })}
      </View>
      <View className=" flex flex-row  top-10 w-full justify-between bg-amber-200">
        <TextInput><Text>Escribe aquí tu mensaje</Text></TextInput>
        <Pressable className="border-blue-300 bs"><Text>Enviar</Text></Pressable>
      </View>
    </View>
  );
};


export default ChatScreen;
