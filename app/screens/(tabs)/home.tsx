import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { AppStackParamList } from "../../_App";
import { UserContext } from "../../context/userContext";
import { trpc } from "../../trpc";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "@ui-kitten/components";
import NoteCard from "../../components/sharedNotes/NoteCard";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabTasks">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: sharedNotes } = trpc.sharedNote.getAllNotes.useQuery({
    groupId: User.groupId || "",
  });

  function goToCreateNote() {
    navigation.navigate("CreateSharedNote", { edit: false });
  }

  function gotNoteDetail() {
    //navigation.navigate("NoteDetail", { edit: false });
  }

  return (
    <ScrollView
      className="h-full bg-light px-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4 items-end">
        <Pressable onPress={goToCreateNote}>
          <Icon name="shape-square-rounded-plus" size={24} color={"#1E88E5"} />
        </Pressable>
      </View>
      <View className="mb-2 flex flex-row flex-wrap justify-between">
        {sharedNotes &&
          sharedNotes.map((note) => <NoteCard key={note.id} note={note} />)}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
