import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ISharedNote } from "../../common/validation/sharedNote";
import { Divider } from "@ui-kitten/components";
import format from "date-fns/format";

type NoteCardProps = {
  navigation: NativeStackNavigationProp<any>;
  note: ISharedNote;
  isLastNote: boolean;
};

const NoteCard: React.FC<NoteCardProps> = ({
  navigation,
  note,
  isLastNote,
}) => {
  function goToNoteDetail() {
    navigation.navigate("NoteDetail", {
      Note: { ...note, createdAt: note.createdAt.toISOString() },
    });
  }
  const formattedDate = format(note.createdAt, "dd/M/yy");
  return (
    <Pressable onPress={goToNoteDetail}>
      <Text className="font-semibold">{note.title}</Text>
      <View className="mt-1 flex-row items-center space-x-2">
        <Text className="text-placeholderGray">{formattedDate}</Text>
        {note.text && (
          <Text
            numberOfLines={1}
            className="flex-shrink truncate text-placeholderGray"
          >
            {note.text}
          </Text>
        )}
      </View>
      {isLastNote ? null : (
        <View className="my-3">
          <Divider />
        </View>
      )}
    </Pressable>
  );
};

export default NoteCard;
