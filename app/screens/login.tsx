import { Link } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";

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
        <Link
          href="/modal"
          asChild
          className={
            "border-darkGreen bg-darkGreen mt-6 items-center rounded-full border-[1px] py-1"
          }
        >
          <Pressable>
            <Text>Iniciar sesión</Text>
          </Pressable>
        </Link>
        <Text className="text-lightBg mt-2 self-center text-sm">
          ¿Todavía no tienes cuenta? <Text className="">Únete</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
