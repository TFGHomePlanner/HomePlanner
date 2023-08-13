import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NoteCard from "../../components/sharedNotes/NoteCard";

export default function TabHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <Text>NOTAS COMPARTIDAS</Text>
      <NoteCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F3ED",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
