import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../server/trpc/router/_app";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000",
      }),
    ],  
  });
    
  const navigation = useNavigation();

  const handleLogin = () => {
    // Lógica de inicio de sesión
    // ...
    // Navegar a la pantalla de tabs después de iniciar sesión
    //  navigation.navigate("Tabs");
  };

  return (
    <View className="bg-darkBg flex-1 items-center justify-center">
      <Text className="text-lightBg -mt-10 mb-8 text-2xl font-semibold">
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
        <Text className="my-2 text-xs">¿Has olvidado tu contraseña?</Text>
        <TouchableOpacity
          className={
            "border-darkGreen bg-darkGreen mt-6 items-center rounded-full border-[1px] py-1"
          }
        >
          <Text className="text-lg">Inicia sesión</Text>
        </TouchableOpacity>
        <Text className="text-lightBg mt-2 self-center text-sm">
          ¿Todavía no tienes cuenta? <Text className="">Únete</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
