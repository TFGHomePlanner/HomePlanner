import React from "react";
import { Pressable, Text, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { NativeStackNavigationProp, } from "@react-navigation/native-stack";
import {INote} from "../common/validation/note";


type NoteCardProps = {
   navigation: NativeStackNavigationProp<any>;
   Note: INote;
};


const NoteCard: React.FC< NoteCardProps> = ({ navigation, Note }) => {

  function move() {
    navigation.navigate("UserNote", {Note: Note, Edit: true});
  }
  return (
    <Pressable onPress={move}>
      <View className="flex flex-col mb-4 items-start rounded-lg  shadow-md shadow-black bg-[#fbf9f7] p-4">
        <Text className="text-lg font-bold">{Note.title.length <15 ? Note.title: Note.text.slice(0, 13) + "..."}</Text>
        <Text className="text-sm">{Note.text.slice(0, 15) + "..."}</Text>
      </View>
    </Pressable>
  );
};
export default NoteCard;
  