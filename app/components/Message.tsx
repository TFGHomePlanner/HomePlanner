import React from "react";
import { Text, View} from "react-native";

function Message({
  text,
  day,
  userId,
  Name,
  imageProfile,
}: {
    text: string;
    day: string;
    userId: string;
    Name: string;
    imageProfile: string;
  }) {
  return (
    <View className="bg-pink flex-col">
      <Text className="bg-red">
        {text}
      </Text>
    </View>
   
  );
} 
export default Message;
  