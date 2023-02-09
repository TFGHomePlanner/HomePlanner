import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function StartScreen({ navigation }: { navigation: any }) {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const buttonStyle = "mt-6 py-2 rounded-full items-center border-[1px]";

  return (
    <View className="flex-1 bg-darkBg justify-center items-center">
      <Image className="w-64 h-64" source={require("../../assets/logo.png")} />
      <Text className="font-semibold text-2xl mb-6 -mt-6 text-lightBg">
        Organiza tu hogar
      </Text>
      <View className="w-56">
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className={`${buttonStyle} border-lightBg`}
        >
          <Text className="text-lg text-lightBg">Inicia sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${buttonStyle} border-darkGreen bg-darkGreen`}
        >
          <Text className="text-lg text-lightBg">Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
