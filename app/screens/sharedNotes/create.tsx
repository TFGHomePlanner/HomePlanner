import React, { useContext, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Header } from "../../components/Header";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  route,
}) => {
  const inputStyle =
    "mb-2 py-2 px-4 rounded-lg border-b-[1px] border-light text-dark";

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

  const Note = route.params.Note;

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateSharedNote>({
    resolver: zodResolver(CreateSharedNoteSchema),
    criteriaMode: "all",
    defaultValues: Note,
  });

  const onSubmit = (data: ICreateSharedNote) => {
    CreateSharedNoteSchema.parse(data);
    mutation.mutateAsync({
      ...data,
      userId: User.id,
      groupId: User.groupId || "",
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      className="h-full bg-light"
    >
      <Header />
      <View className="px-6">
        <View className="mb-4 flex flex-row justify-between">
          <Pressable
            onPress={navigation.goBack}
            className="flex-row items-center"
          >
            <Pressable onPress={navigation.goBack}>
              <Icon name="left" size={16} color={"#1E88E5"} />
            </Pressable>
            <Text className="text-blue">Notas</Text>
          </Pressable>
          <Pressable className="self-end" onPress={handleSubmit(onSubmit)}>
            <Text className="font-semibold text-blue">OK</Text>
          </Pressable>
        </View>
        <TextInput
          className={`${inputStyle} text-lg font-bold`}
          placeholder="Título *"
          placeholderTextColor="#95999C"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text>{errors.title.message}</Text>}
        <TextInput
          className={`${inputStyle}`}
          placeholder="¿Qué quieres compartir...?"
          placeholderTextColor="#95999C"
          value={text}
          onChangeText={setText}
          multiline={true}
        />
        {errors.text && <Text>{errors.text.message}</Text>}
      </View>
    </ScrollView>
  );
};

export default CreateSharedNoteScreen;
