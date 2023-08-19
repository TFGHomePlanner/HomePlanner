import { Pressable, Text, TextInput, View, ScrollView, Image } from "react-native";
import React, { useContext, useState } from "react";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import Icon from "react-native-vector-icons/FontAwesome5";
import GroupCard from "../../components/groups/GroupCard";
import NoteCard from "../../components/NoteCard";
import { Profileinformation } from "../../components/Profileinformation";
import { pickImageAndUploadToS3 } from "../../components/ImagePickerC";
import { TouchableOpacity } from "react-native";


/**
 * @typedef {object} ProfileScreenProps
 * @property {NativeStackNavigationProp<AppStackParamList, "Profile">} navigation
 *
 */
type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Profile">;
};
/**
 * Interraz del perfil de usuario
 * @param {ProfileScreenProps} props
 * @param {NativeStackNavigationProp<AppStackParamList, "Profile">} props.navigation
 * @returns {JSX.Element} Interfaz de usuario del perfil
 */
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  //contexto de TRPC
  const utils = trpc.useContext();
  //contexto de usuario
  const { User } = useContext(UserContext) as UserContextType;
  const [imageURL, setSelectedImageUrl] = useState("");
  const { data: userGroups } = trpc.user.getUserGroups.useQuery({
    userId: User.id,
  });


  //Mutación de TRPC para unirse a un grupo
  const joingroup = trpc.group.joinGroup.useMutation({
    onSuccess() {
      utils.user.getUserGroups.invalidate();
    },
  });

  const [codeGroup, setCodeGroup] = useState("");
  const Edit = false;

  /**
   * Función que se encarga de navegar a la pantalla de creación de grupos.
   * @returns {void}
   */
  function goToCreateGroup() {
    navigation.navigate("CreateGroup");
  }
  /**
   * Función que se encarga de unirse a un grupo.
   * @returns {void}
   */
  function joinGroup() {
    //Llama mutación de TRPC para unirse a un grupo
    joingroup.mutateAsync({
      userId: User.id,
      codeGroup: codeGroup,
    });
  }
  //Método para obtener todas las notas del usuario
  const { data: userNotes } = trpc.user.getNotes.useQuery({
    userId: User.id,
  });

  const handleImageSelected = async () => {
    pickImageAndUploadToS3((imageUrl) => {
      setSelectedImageUrl(imageUrl);
    });
  };


  return (
    <ScrollView className="h-full bg-light px-6 pt-16">
      <Pressable onPress={navigation.goBack}>
        <Icon name="chevron-left" size={16} color={"#1E88E5"} />
      </Pressable>
      <View className="relative">
        <TouchableOpacity
          className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden" onPress={handleImageSelected}>
          {imageURL ? (
            <Image
              source={{ uri: imageURL }} // Cambia ImageBackground por Image
              style={{ width: "100%", height: "100%" }} // Asegura que la imagen ocupe todo el espacio
            />
          ) : (
            <Icon name="user-alt" size={16} color={"#1E88E5"}/>
          )}
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-blue-500 absolute top-0 right-0 flex items-center justify-center"
          onPress={handleImageSelected}>
          <Icon name="edit" size={16} color={"#1E88E5"}/>
        </TouchableOpacity>
      </View>
      <Pressable
        onPress={goToCreateGroup}
        className="my-4 flex-row space-x-2 rounded-lg bg-white p-4"
      >
        <Icon name="edit" size={16} color={"#1E88E5"} />
        <Text className="self-center text-blue">Nuevo grupo</Text>
      </Pressable>
      {userGroups ? (
        userGroups.map((group) => <GroupCard key={group.id} group={group} />)
      ) : (
        <View className="my-2">
          <Text>Todavía no tienes grupos</Text>
        </View>
      )}
      <View className="flex-row items-center space-x-2">
        <Text>Unirse a un grupo</Text>
        <TextInput
          className={"my-2 rounded-lg bg-white px-4 py-2 text-dark"}
          placeholderTextColor="#95999C"
          value={codeGroup}
          onChangeText={setCodeGroup}
          placeholder="Código de invitación"
        />
        <Pressable onPress={joinGroup} className="bg-gray rounded-full">
          <Icon name="paper-plane" size={20} />
        </Pressable>
      </View>
      <View className="mb-8 mt-4 flex justify-between">
        <Text className="text-lg font-bold">Notas privadas</Text>
        <View className="grid grid-cols-2">
          {userNotes ? (
            userNotes.map((note) => {
              return (
                <View className="mr-2" key={note.id}>
                  <NoteCard key={note.id} Note={note} navigation={navigation} />
                </View>
              );
            })
          ) : (
            <Text className="font-bold">No tienes notas</Text>
          )}
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate("UserNote", { Note: undefined, Edit: Edit })
          }
          className="bg-gray rounded-full p-2"
        >
          <Text className="text-md text-center font-light text-blue">
            Añadir nueva nota
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
