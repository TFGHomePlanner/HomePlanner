import { Pressable, Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { trpc } from "../../trpc";
import UserProvider, { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import Icon from "react-native-vector-icons/FontAwesome5";
import GroupCard from "../../components/groups/GroupCard";
import NoteCard from "../../components/NoteCard";
import { Profileinformation } from "../../components/Profileinformation";
import ImagePickerC from "../../components/ImagePickerC";

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Profile">;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

  const utils = trpc.useContext();
  const [edit, setEdit] = useState(false);
  const { User } = useContext(UserContext) as UserContextType;
  const { data: userGroups } = trpc.user.getUserGroups.useQuery({
    userId: User.id,
  });

  const {data: UserProfile} = trpc.user.getUserByID.useQuery({id: User.id});



  const joingroup = trpc.group.joinGroup.useMutation({
    onSuccess() {
      utils.user.getUserGroups.invalidate();
    }
  });

  const [codeGroup, setCodeGroup] = useState("");
  const Edit = false;
  function goToCreateGroup() {
    navigation.navigate("CreateGroup");
  }

  function joinGroup() {
    joingroup.mutateAsync({
      userId: User.id,
      codeGroup: codeGroup,
    });
  }
  const {data: userNotes} = trpc.user.getNotes.useQuery({
    userId: User.id,
  });

  console.log(userNotes);
  return (
    <ScrollView> 
      <View className="h-full bg-light px-6 pt-16">
        <View className="mb-8 mt-4">
          <ImagePickerC id={User.id} table="users" />   
          <Profileinformation />
        </View>
        <Pressable onPress={navigation.goBack}>
          <Icon name="left" size={16} color={"#7B61FF"} />
        </Pressable>
        <Pressable
          onPress={goToCreateGroup}
          className="mt-4 flex-row space-x-2 rounded-lg bg-white p-4"
        >
          <Icon name="PEN" size={20} color={"#7B61FF"} />
          <Text className="self-center text-purple">Nuevo grupo</Text>
        </Pressable>
        <View className="my-6">
          {userGroups ? (
            userGroups.map((group) => <GroupCard key={group.id} group={group} />)
          ) : (
            <Text>Todavía no tienes grupos</Text>
          )}
        </View>
        <View className="flex flex-row items-center justify-center">
          <Text>Unirse a un grupo</Text>
          <TextInput
            className={
              "my-2 rounded-lg border-b-[1px] border-light bg-white px-4 py-2 text-dark"
            }
            placeholderTextColor="#95999C"
            value={codeGroup}
            onChangeText={setCodeGroup}
            placeholder="Código de invitación"
          />
          <Pressable onPress={joinGroup} className="p-2 rounded-full bg-gray">
            <Icon name="paper-plane" size={24} color="black" />
          </Pressable>
        </View>
        <View className="flex justify-between mb-8 mt-4">
          <Text className="font-bold text-lg">Notas Privadas </Text>
          <View className="grid grid-cols-2">
            {
              userNotes ? (
                userNotes.map((note) =>  { return (
                  <View className="mr-2" key={note.id}>
                    <NoteCard key={note.id} Note={note} navigation={navigation} />
                  </View>
                );
                })
              ): 
                <Text className="font-bold">No tienes notas</Text>
            }
          </View>
          <Pressable onPress={() => navigation.navigate("UserNote", {Note: undefined, Edit: Edit})} className="p-2 rounded-full bg-gray">
            <Text className="text-blue font-light text-md text-center">Añadir nueva nota</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
