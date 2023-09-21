import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AppStackParamList } from "../../_App";
import { UserContext } from "../../context/userContext";
import { trpc } from "../../trpc";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoteCard from "../../components/sharedNotes/NoteCard";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabHome">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: sharedNotes } = trpc.sharedNote.getAllNotes.useQuery({
    groupId: User.groupId || "",
  });

  function goToCreateNote() {
    navigation.navigate("CreateSharedNote", { edit: false });
  }

  return (
    <View className="flex h-full flex-1 bg-light">
      <ScrollView
        className="h-full flex-1 bg-light px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="my-3 flex-row items-center justify-between">
          <Text className="font-ralewayBold text-lg">Notas compartidas</Text>
          <TouchableOpacity onPress={goToCreateNote}>
            <Icon
              name="shape-square-rounded-plus"
              size={24}
              color={"#1E88E5"}
            />
          </TouchableOpacity>
        </View>
        {sharedNotes?.length !== 0 ? (
          <View className="w-full rounded-xl bg-white p-4">
            {sharedNotes?.map((note, index) => (
              <NoteCard
                key={note.id}
                navigation={navigation}
                note={{
                  ...note,
                  createdAt: new Date(note.createdAt),
                }}
                isLastNote={index === sharedNotes.length - 1}
              />
            ))}
          </View>
        ) : (
          <Text className="font-sans">Cargando...</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        className="flex w-full items-end justify-end px-6 pb-4"
      >
        <View className="flex w-full items-end justify-end py-4">
          <Icon name="comment" size={30} color="black" className="mt-2 pt-2" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
