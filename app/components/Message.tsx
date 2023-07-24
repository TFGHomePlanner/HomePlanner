import React from "react";
import { Text, View, Image} from "react-native";
import { format } from "date-fns";
function Message({
  text,
  day,
  Name,
  imageProfile,
  isMyMessage,
}: {
    text: string;
    day: string;
    Name: string;
    imageProfile: string;
    isMyMessage: boolean
  }) {
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
        className={`p-4 rounded-xl ${
          isMyMessage ? "bg-green-400 text-white ml-2" : "bg-blue-300 text-white mr-2"
        }`}
      >
        <Text className="text-left text-base overflow-hidden">{text}</Text>
        <Text className={`text-xs italic ${isMyMessage ? "text-right" : "text-left"}`}>{DayFormat + " " + Name}</Text>
      </View>
      
    </View>
  );
}
export default Message;
  