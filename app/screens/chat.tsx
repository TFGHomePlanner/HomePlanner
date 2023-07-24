import React, { useState } from "react";
import { Text, View, TextInput, ScrollView, Pressable } from "react-native";
import { trpc } from "../server/utils/trpc";
import Message from "../components/Message";
import { UserContext } from "../context/userContext";
import { UserContextType } from "../context/types";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/FontAwesome";
const ChatScreen = () => {
  
  const inputStyle ="mb-2 text-lg border-b-[1px] border-lightBg p-2 pl-8 text-lightBg";
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
    const currentDate = new Date();
    const formattedDate = format(currentDate,  "yyyy-MM-dd'T'HH:mm:ssxxx");
    mutation.mutateAsync({
      Text: message,
      Day: formattedDate,
      GroupId: User.groupId,
      UserId: User.id,
    });
    setmessage("");
  }
  return (
    <View className="h-full  flex flex-col">
      {/* Cabecera */}
      <View className="w-full bg-[#f1889f]">
        <Text className=" font-semibold text-center text-[18px] text-white p-4 pt-8">Chat {namegroup}</Text>
      </View>
      <ScrollView className="bg-[#F8F3ED]"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} // Añade esta línea
        keyboardShouldPersistTaps="handled" // Permite el manejo de taps en el teclado
      >
        {groupmessages?.map((c) => {
          return (
            <Message
              key={c.Id}
              text={c.Text}
              day={c.Day}
              Name={c.User.name}
              imageProfile={c.User.imageprofile || ""}
              isMyMessage={c.UserId === User.id ? true : false}
            />
          );
        })}
      </ScrollView>
      <View className="flex flex-row items-center bg-gray p-4">
        <TextInput
          className={`${inputStyle} flex-1 mr-2`}
          placeholderTextColor="#95999C"
          value={message}
          onChangeText={setmessage}
          placeholder="escribe aqui tu mensaje"
        />
        <Pressable onPress={sendMessage} className="p-2 rounded-full bg-gray">
          <Icon name="paper-plane" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};


export default ChatScreen;
