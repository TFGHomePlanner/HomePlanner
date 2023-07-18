import React from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "@react-navigation/native";

export default function TabTasksScreen() {
  return (
    <View className="h-full bg-[#F8F3ED] p-8">
      <View className="mb-6 gap-y-3">
        <Pressable className="h-10 w-full justify-center rounded-md bg-[#7B61FF] pl-8">
          <Link to={{ screen: "CreateTask" }}>
            <Text className="text-base text-[#F8F3ED]">Nueva tarea</Text>
          </Link>
        </Pressable>
        <Pressable className="h-10 w-full justify-center rounded-md bg-[#212529] pl-8">
          <Text className="text-base text-[#F8F3ED]">Mis tareas</Text>
        </Pressable>
      </View>
      <View className="mb-6 gap-y-3">
        <Pressable className="h-10 w-full justify-center rounded-md border-2 border-[#7B61FF] pl-8">
          <Text className="text-base">Tareas sin asignar</Text>
        </Pressable>
        <Pressable className="h-10 w-full justify-center rounded-md border-2 border-[#7B61FF] pl-8">
          <Text className="text-base">Grupo cocina</Text>
        </Pressable>
      </View>
      <Text className="text-lg">Otras tareas</Text>
    </View>
  );
}
