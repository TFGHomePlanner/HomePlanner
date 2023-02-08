import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";

  return (
    <View className="flex-1 bg-darkBg justify-center items-center">
      <Image
        className="w-80 -mt-10 h-80"
        source={require("../../assets/logo-simple.png")}
      />
      <Text className="font-semibold text-2xl mb-8 -mt-10 text-lightBg">
        ¡Bienvenid@ de nuevo!
      </Text>
      <View className="w-56">
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={email}
          onChangeText={setEmail}
          placeholder="email"
        />
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={password}
          onChangeText={setPassword}
          placeholder="contraseña"
        />
        <Text className="text-xs my-2 text-lightBg">
          ¿Has olvidado tu contraseña?
        </Text>
        <TouchableOpacity
          className={`mt-6 py-1 rounded-full items-center border-[1px] border-darkGreen bg-darkGreen`}
        >
          <Text className="text-lg text-lightBg">Inicia sesión</Text>
        </TouchableOpacity>
        <Text className="self-center text-sm mt-2 text-lightBg">
          ¿Todavía no tienes cuenta?{" "}
          <Text className="text-pastelPink">Únete</Text>
        </Text>
      </View>
    </View>
  );
};
