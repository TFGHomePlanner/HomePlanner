import React, { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import {
  CreateSharedNoteSchema,
  ICreateSharedNote,
} from "../../common/validation/sharedNote";

/**
 * Propiedades para la pantalla de creación de notas compartidas.
 */
type CreateSharedNoteScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateSharedNote">;
  route: RouteProp<AppStackParamList, "CreateSharedNote">;
};

/**
 * Pantalla de creación de notas compartidas.
 */
const CreateSharedNoteScreen: React.FC<CreateSharedNoteScreenProps> = ({
  navigation,
}) => {
  const inputStyle = "mb-2 rounded-lg px-3 text-dark";

  /**
   * Contexto del usuario actual.
   */
  const { User } = useContext(UserContext) as UserContextType;

  /**
   * Utilidades de trpc para gestionar grupos y usuarios.
   */
  const utils = trpc.useContext();

  /**
   * Estado local para el título de la nota.
   */
  const [title, setTitle] = useState("");

  /**
   * Estado local para el contenido de la nota.
   */
  const [text, setText] = useState("");

  /**
   * Mutación para crear una nota compartida.
   */
  const mutation = trpc.sharedNote.createNote.useMutation({
    onSuccess() {
      utils.sharedNote.getAllNotes.invalidate();
      navigation.navigate("Tabs");
    },
  });

  //const Note = route.params.Note;

  const onSubmit = async (data: ICreateSharedNote) => {
    const validationResult = CreateSharedNoteSchema.safeParse(data);
    if (validationResult.success) {
      try {
        mutation.mutateAsync({
          ...data,
          userId: User.id,
          groupId: User.groupId || "",
        });
      } catch (error) {
        console.error("Error en la creación:", error);
      }
    } else {
      navigation.navigate("Tabs");
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      className="h-full bg-light px-3 py-14"
    >
      <View className="mb-2 flex flex-row justify-between">
        <Pressable
          onPress={navigation.goBack}
          className="flex-row items-center"
        >
          <Icon name="left" size={16} color={"#1E88E5"} />
          <Text className="text-base text-blue">Notas</Text>
        </Pressable>
        <TouchableOpacity
          className="self-end"
          onPress={() =>
            onSubmit({
              title,
              text,
              userId: User.id,
              groupId: User.groupId || "",
            })
          }
        >
          <Text className="text-base font-semibold text-blue">OK</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        className={`${inputStyle} h-12 text-lg font-bold`}
        placeholder="Título *"
        placeholderTextColor="#95999C"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className={`${inputStyle}`}
        placeholder="¿Qué quieres compartir...?"
        placeholderTextColor="#95999C"
        value={text}
        onChangeText={setText}
        multiline={true}
        maxLength={200}
      />
    </ScrollView>
  );
};

export default CreateSharedNoteScreen;
