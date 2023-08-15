import React from "react";
import { Text, View, Image} from "react-native";
import { format } from "date-fns";

function Message({
  text,
  day,
  name,
  imageProfile,
  isMyMessage,
}: {
    text: string;
    day: string;
    name: string;
    imageProfile: string;
    isMyMessage: boolean
  }) {
  // Formatear la fecha en un formato legible
  const DayFormat = format(new Date(day), "MMM d, yyyy HH:mm");
  return (
    <View className={`flex ${isMyMessage ? "flex-row-reverse" : "flex-row"} mb-4 items-start`}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          overflow: "hidden",
          marginRight: 8,
        }}
      >
        <Image
          source={require("../../assets/images/Perfil.jpg")}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View
        className={`p-3 rounded-xl w-auto ${
          isMyMessage ? "bg-slate-200 ml-7" : "bg-blue-300 text-white mr-7"}`}
      >
        <Text className="text-black text-left text-base overflow-hidden flex-shrink-0 flex-grow-0">
          {text}
        </Text>
        <Text className={`text-xs italic text-black ${isMyMessage ? "text-right" : "text-left"}`}>{DayFormat + " " + name}</Text>
      </View>
      
    </View>
  );
}
export default Message;
  