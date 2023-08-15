import { Pressable, Text, View } from "react-native";
import React, { useContext } from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NoteDetailScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "NoteDetail">;
  route: RouteProp<AppStackParamList, "NoteDetail">;
};
/**
 * Pantalla que muestra los detalles de una nota compartida.
 */
const NoteDetailScreen: React.FC<NoteDetailScreenProps> = ({
  navigation,
  route,
}) => {
  /**
   * Objeto que representa los detalles de la nota.
   */
  const Note = route.params.Note;

  /**
   * Contexto del usuario actual.
   */
  const { User } = useContext(UserContext) as UserContextType;

  /**
   * Indica si el usuario actual tiene permiso para editar la tarea.
   */
  const canEdit = User.id === Note.userId || User.isAdmin;

  /**
   * Navega a la pantalla de creación/edición de notas compartidas.
   */
  function goToCreateNote() {
    navigation.navigate("CreateSharedNote", { Note: Note, edit: true });
  }

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="flex-1 px-6 pb-10">
        <View className="flex-1 space-y-4">
          {canEdit && (
            <Text onPress={goToCreateNote} className="self-end text-blue">
              Editar
            </Text>
          )}
          <Text className="text-xl font-bold">{Note.title}</Text>
          {Note.text && <Text>{Note.text}</Text>}
          {Note.createdAt instanceof Date && (
            <Text>
              Creada el {new Date(Note.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
        {canEdit && (
          <Pressable className="self-end">
            <Icon name="trash-outline" color={"#1E88E5"} size={24} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default NoteDetailScreen;
