import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { trpc } from "../../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { UserContextType } from "../../context/types";
import { UserContext } from "../../context/userContext";
/**
 * @typedef {object} NotesScreenProps
 * @property {RouteProp<AppStackParamList, "UserNote">} route
 * @property {NativeStackNavigationProp<AppStackParamList, "UserNote">} navigation
 * @property {boolean} Edit
 * @property {Note} Note
 *  
 */
type NotesScreenProps = {
  route: RouteProp<AppStackParamList, "UserNote">;
  navigation: NativeStackNavigationProp<AppStackParamList, "UserNote">;
};
/**
 * Interfaz de usuario que permite crear o editar una nota
 * @param {NotesScreenProps} props
 * @param {RouteProp<AppStackParamList, "UserNote">} props.route
 * @param {NativeStackNavigationProp<AppStackParamList, "UserNote">} props.navigation
 * @param {boolean} props.Edit
 * @param {Note} props.Note
 * @returns {JSX.Element} Interfaz de usuario que permite crear o editar una nota 
 */
const UserNoteScreen: React.FC<NotesScreenProps> = ({ route, navigation }) => {
  //contexto de TRPC
  const utils = trpc.useContext();
  //contexto de usuario
  const { User } = useContext(UserContext) as UserContextType;

  const Note = route.params.Note;
  const Edit = route.params.Edit;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  //Mutaciones de TRRPC para actualizar o crear una nota
  const createMutation = trpc.user.createNote.useMutation({
    onSuccess() {
      utils.user.getNotes.invalidate();
      navigation.goBack();
    },
  });
  const updateMutation = trpc.user.updateNote.useMutation({
    onSuccess() {
      utils.user.getNotes.invalidate();
      navigation.goBack();
    },
  });
  /**
   * Función que indica si la nota es editable y actuliza variables de estado
   * @returns {void}
   */
  function iseditable() {
    if (Edit) {
      setTitle(Note?.title || "");
      setText(Note?.text || "");
    }
  }
  /**
   * Función que permite crear una nota
   * @returns {void}
   */
  function createNote() {
    createMutation.mutateAsync({
      userId: User.id,
      title: title,
      text: text,
    });
  }
  /**
   * Función que permite editar una nota
   * @returns {void}
   */
  function EditNote() {
    if (Note) {
      updateMutation.mutateAsync({
        id: Note?.id,
        title: title,
        text: text,
      });
    }
  }
  //Efecto que se ejecuta al renderizar el componente
  useEffect(() => {
    iseditable();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex h-full flex-col justify-start bg-light"
    >
      <Header />
      <TextInput
        className="text-black border-black w-full border-b-2 bg-light p-4 text-2xl font-bold"
        placeholder="Titulo"
        placeholderTextColor="black"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="text-black w-full flex-1 bg-light p-4 text-lg"
        multiline={true}
        placeholder="Escribe una nota"
        placeholderTextColor="black"
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity
        disabled={title == "" || text == ""}
        onPress={Edit ? EditNote : createNote}
        className="mx-4 mb-10 items-center justify-center rounded-md bg-dark"
      >
        <View className="bg-black flex w-full flex-row items-center justify-center rounded-xl p-3">
          <Text className="ml-2 text-lg font-bold text-white">Guardar</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
export default UserNoteScreen;
