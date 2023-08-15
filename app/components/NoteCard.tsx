import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { INote } from "../common/validation/note";

/**
 * @typedef {object} NoteCardProps Props necesarios para el componente NoteCard
 * @property {NativeStackNavigationProp<any>} navigation Permite la navegación entre pantallas
 * @property {INote} Note Nota que se está editando
 */
type NoteCardProps = {
  navigation: NativeStackNavigationProp<any>;
  Note: INote;
};
/**
 * Componente que muestra una nota
 * @param {NoteCardProps} props Propiedades del componente
 * @returns {JSX.Element} NoteCard componente de la nota 
 */
const NoteCard: React.FC<NoteCardProps> = ({ navigation, Note }) => {
  function move() {
    // Navegar a la pantalla de edición de notas
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
