import React from "react";
import { Text, View} from "react-native";
import { Link } from "@react-navigation/native";



export default function TabPaymentsScreen() {
  return (
    <View className="h-full bg-[#F8F3ED] flex flex-col">
      <Link to={{ screen: "Chat" }}>
        {/*PRUEBAS: cambiar Tabs por Register*/}
        <Text className="text-[#F1889F] underline">Únete</Text>
      </Link>

    </View>
  );
}


