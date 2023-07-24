import React, { useState } from "react";
import { Text, View, TextInput, Pressable} from "react-native";
import { trpc } from "../server/utils/trpc";
import Message from "../components/Message";
import { UserContext } from "../context/userContext";
import { UserContextType } from "../context/types";

const ChatScreen = () => {
  
  const inputStyle ="mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const utils = trpc.useContext();
  const namegroup = "miniconsejo";
  const [message, setmessage] = useState("");
  const {User} = React.useContext(UserContext) as UserContextType;
  const {data: groupmessages} = trpc.chat.getAllMessages.useQuery ({
    GroupId : "clk9yp8jj0000ucr4697vt5nq"
  });
  const mutation = trpc.chat.createmessage.useMutation({
    onSuccess() {
      utils.chat.getAllMessages.invalidate();
    },
  });
  function sendMessage() {
    mutation.mutateAsync({
      Text: message,
      Day: new Date(),
      GroupId: User.groupId,
      UserId: User.id,
    });
    setmessage("");
  }
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
              isMyMessage = {c.UserId == User.id ? true: false}
            />
          );
        })}
      </View>
      <View className=" flex flex-row  top-10 w-full justify-between bg-amber-200">
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="#95999C"
          value={message}
          onChangeText={setmessage}
          placeholder="escribe aqui tu mensaje"
        />
        <Text  onPress={sendMessage}>Enviar</Text>
      </View>
    </View>
  );
};


export default ChatScreen;
