import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {trpc} from "../server/utils/trpc";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const data = trpc.user.login.useMutation({
    onSuccess() {
      setEmail("si");
      console.log("si");
    },
    onError(){
      console.log("no");
      setEmail("no");
    }
  });
  const handleLogin = () => {
    data.mutate();
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
        <Pressable onPress={handleLogin}>
          <Text>Iniciar sesión 2</Text>
        </Pressable>
        <Text className="my-2 text-xs">¿Has olvidado tu contraseña?</Text>
        <Link to={{ screen: "Tabs" }}>
          <Text>Iniciar sesión</Text>
        </Link>
        <Text className="text-lightBg mt-2 self-center text-sm">
          ¿Todavía no tienes cuenta? <Text className="">Únete</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
