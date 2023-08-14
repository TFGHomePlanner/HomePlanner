import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { trpc } from "../server/utils/trpc";
import Message from "../components/Message";
import { UserContext } from "../context/userContext";
import { UserContextType } from "../context/types";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/FontAwesome";

/**
 * Representa la interfaz en la que se muestran los mensajes del grupo.
 */
const ChatScreen = () => {
  //Constantes y variables de la pantalla.
  const navigation = useNavigation();
  const inputStyle = "mb-2 text-lg border-b-[1px] border-lightBg p-2 pl-8 text-lightBg";
  const utils = trpc.useContext();
  const namegroup = "miniconsejo";
  const [message, setmessage] = useState("");
  const { User } = React.useContext(UserContext) as UserContextType;
  const { data: groupmessages } = trpc.chat.getAllMessages.useQuery({
    groupId: User.groupId,
  });

  // Define el mutation para enviar mensajes.
  const mutation = trpc.chat.createmessage.useMutation({
    onSuccess() {
      utils.chat.getAllMessages.invalidate();
    },
  });

  // Funcion que se encarga de enviar un mensjae y guardalo en BD si no es vacío.
  function sendMessage() {
    if (message !== "" && message !== null) {
      console.log("hola");
      console.log(message);
      const currentDate = new Date();
      const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ssxxx");

      // Uso de mutatión para enviar el mensaje.
      mutation.mutateAsync({
        text: message,
        day: formattedDate,
        groupId: User.groupId,
        userId: User.id,
      });

      setmessage(""); //limpia el input del mensaje.
    }
  }

  // Function para navegar a la pantalla anterior.
  function goBack() {
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <View className="flex w-full flex-row items-center bg-[#f1889f] pt-6">
        {/* Back navigation */}
        <Pressable onPress={goBack} className="pl-3 pt-5">
          <Icon name="chevron-left" size={16} color="white" />
        </Pressable>
        {/* Header text */}
        <Text className="mr-4 flex-1 p-4 pt-8 text-center text-[18px] font-semibold text-white">
          Chat {namegroup}
        </Text>
      </View>
      {/* Scrollable messages */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-[#F8F3ED] px-4"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Display messages */}
        {groupmessages?.map((c) => (
          <Message
            key={c.id}
            text={c.text}
            day={c.day}
            name={c.user.name}
            imageProfile={c.user.imageprofile || ""}
            isMyMessage={c.userId === User.id}
          />
        ))}
      </ScrollView>
      {/* Message input and send button */}
      <View className="bg-gray flex flex-row items-center p-4">
        <TextInput
          className={`${inputStyle} mr-2 flex-1`}
          placeholderTextColor="#95999C"
          value={message}
          onChangeText={setmessage}
          placeholder="Write your message here"
        />
        <Pressable onPress={sendMessage} className="bg-gray rounded-full p-2">
          <Icon name="paper-plane" size={24} color="black" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
