import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { INote } from "../common/validation/note";

type NoteCardProps = {
  navigation: NativeStackNavigationProp<any>;
  Note: INote;
};

const NoteCard: React.FC<NoteCardProps> = ({ navigation, Note }) => {
  function move() {
    navigation.navigate("UserNote", { Note: Note, Edit: true });
  }
  return (
    <Pressable onPress={move}>
      <View className="shadow-black mb-4 flex flex-col items-start  rounded-lg bg-[#fbf9f7] p-4 shadow-md">
        <Text className="text-lg font-bold">
          {Note.title.length < 20
            ? Note.title
            : Note.title.slice(0, 20) + "..."}
        </Text>
        <Text className="text-sm">{Note.text.slice(0, 30) + "..."}</Text>
      </View>
    </Pressable>
  );
};
export default NoteCard;
