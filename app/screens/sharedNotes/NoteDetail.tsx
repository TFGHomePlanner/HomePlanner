import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { trpc } from "../../trpc";

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

  const utils = trpc.useContext();
  const deleteMutation = trpc.sharedNote.deleteNote.useMutation({
    onSuccess() {
      utils.sharedNote.getAllNotes.invalidate();
      navigation.navigate("Tabs");
    },
  });

  function deleteNote() {
    deleteMutation.mutateAsync({ id: Note.id });
  }

  function handleDelete() {
    Alert.alert("Eliminar nota", "", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "Eliminar", style: "destructive", onPress: () => deleteNote() },
    ]);
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
          {Note.text && <Text className="text-dark">{Note.text}</Text>}
          {Note.createdAt && (
            <Text className="text-placeholderGray">
              Creada el {new Date(Note.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
        {canEdit && (
          <TouchableOpacity onPress={handleDelete} className="self-end">
            <Icon name="trash-outline" color={"#1E88E5"} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NoteDetailScreen;
