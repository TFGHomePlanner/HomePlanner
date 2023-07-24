import React from "react";
import { Text, View} from "react-native";

function Message({
  text,
  day,
  userId,
  Name,
  imageProfile,
  isMyMessage,
}: {
    text: string;
    day: string;
    userId: string;
    Name: string;
    imageProfile: string;
    isMyMessage: boolean
  }) {
  if (isMyMessage)
  {
    return (
      <View className="flex w-full mt-2 space-x-3 max-w-xs">
        <View className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></View>
        <View>
          <View className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
            <Text className="text-sm">{text}</Text>
          </View>
          <Text className="text-xs text-gray-500 leading-none">{day}</Text>
        </View>
      </View>
    );
  }
  else {
    return (
      <View className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
        <View>
          <View className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
            <Text className="text-sm">{text}</Text>
          </View>
          <Text className="text-xs text-gray-500 leading-none">{day}</Text>
        </View>
        <View className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></View>
      </View>
    );
  }
  
} 
export default Message;
  