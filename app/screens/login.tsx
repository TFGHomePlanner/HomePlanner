import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { trpc } from "../server/utils/trpc";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const { mutate } = trpc.user.login.useMutation({
    onSuccess: (output) => {
      if (output) {
        console.log(email + " " + password + " " + "login success");
      }
    },
    onError(output) {
      console.log(output + " " + password + " " + "login error");
    },
  });
  const handleLogin = () => {
    mutate({ email, password });
  };

  return (
    <View className="bg-darkBg flex-1 items-center justify-center">
      <Text className="text-lightBg -mt-10 mb-8 text-2xl font-semibold">
        ¡Bienvenid@ de nuevo!
      </Text>
      <View className="w-60">
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="#95999C"
          value={email}
          onChangeText={setEmail}
          placeholder="email"
        />
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="#95999C"
          value={password}
          onChangeText={setPassword}
          placeholder="contraseña"
        />
        <Pressable onPress={handleLogin}>
          <Text>Iniciar sesión 2</Text>
        </Pressable>
        <Text className="my-2 text-xs">¿Has olvidado tu contraseña?</Text>
        <Link to={{ screen: "Tabs" }}>
          <Text className="text-lg ">Iniciar sesión</Text>
        </Link>
        <Text className="text-lightBg mt-2 text-sm">
          ¿Todavía no tienes cuenta?{" "}
          <Text className="text-[#F1889F] underline">Únete</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
