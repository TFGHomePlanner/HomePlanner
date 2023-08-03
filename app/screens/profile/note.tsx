import React, {useContext, useEffect, useState} from "react";
import {View, Text, ScrollView, TouchableOpacity, Image, TextInput} from "react-native";
import {trpc} from "../../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { Menu, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import { UserContextType } from "../../context/types";
import { UserContext } from "../../context/userContext";

type NotesScreenProps = {
  route: RouteProp<AppStackParamList, "UserNote">;
  navigation: NativeStackNavigationProp<AppStackParamList, "UserNote">;
};

const UserNoteScreen: React.FC<NotesScreenProps> = ({ route, navigation }) => {
  const utils = trpc.useContext();
  const {User} = useContext(UserContext) as UserContextType;
  const Note = route.params.Note;
  const Edit = route.params.Edit;
  const [title, setTitle]= useState("");
  const [text, setText] = useState("");
  const createMutation = trpc.user.createNote.useMutation({
    onSuccess() {
      utils.user.getNotes.invalidate();
      navigation.goBack();
    }
  });
  const updateMutation = trpc.user.updateNote.useMutation({
    onSuccess() {
      utils.user.getNotes.invalidate();
      navigation.goBack();
    }
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
    if(Note) {
      updateMutation.mutateAsync({
        id: Note?.id,
        title: title,
        text: text,
      });
    }
  }

  useEffect(() => {iseditable();}, []);
    
  return (
    <View className="flex flex-col justify-start h-full bg-light">
      <Header />
      <TextInput
        className="bg-light text-black text-2xl font-bold p-4 w-full border-b-2 border-black"
        placeholder="Titulo"
        placeholderTextColor="black"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="bg-light text-black text-lg p-4 w-full flex-1" 
        multiline={true}
        placeholder="Escribe una nota"
        placeholderTextColor="black"
        value={text}
        onChangeText={setText}
      />
      { (text.length > 0 && title.length> 0) &&
        <TouchableOpacity onPress={Edit ? EditNote : createNote} className="bg-dark mx-4 mb-10 rounded-md items-center justify-center">
          <View className="bg-black p-3 rounded-xl flex flex-row items-center justify-center w-full">
            <Text className="text-lg font-bold ml-2 text-white">Guardar</Text>
          </View>
        </TouchableOpacity>
      }
    
    </View>
  );
};
export default UserNoteScreen;