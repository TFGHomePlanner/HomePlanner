import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { trpc } from "../../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { UserContextType } from "../../context/types";
import { UserContext } from "../../context/userContext";

type NotesScreenProps = {
  route: RouteProp<AppStackParamList, "UserNote">;
  navigation: NativeStackNavigationProp<AppStackParamList, "UserNote">;
};

const UserNoteScreen: React.FC<NotesScreenProps> = ({ route, navigation }) => {
  const utils = trpc.useContext();
  const { User } = useContext(UserContext) as UserContextType;
  const Note = route.params.Note;
  const Edit = route.params.Edit;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
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

  function iseditable() {
    if (Edit) {
      setTitle(Note?.title || "");
      setText(Note?.text || "");
    }
  }
  function createNote() {
    createMutation.mutateAsync({
      userId: User.id,
      title: title,
      text: text,
    });
  }
  function EditNote() {
    if (Note) {
      updateMutation.mutateAsync({
        id: Note?.id,
        title: title,
        text: text,
      });
    }
  }

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
