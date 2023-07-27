import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Link } from "@react-navigation/native";
import { trpc } from "../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../_App";
import { UserContext } from "../context/userContext";
import { IUser, UserContextType } from "../context/types";

// Define el tipo de props para el componente LoginScreen
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { updateUser } = React.useContext(UserContext) as UserContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-3 text-lg border-[1px] rounded-xl border-dark p-2 text-dark";
  const { mutate } = trpc.user.login.useMutation({
    onSuccess: (output) => {
      if (output.success) {
        const NewUser: IUser = {
          id: output.user.id,
          groupId: "clkikj9r90003uchwblr4xlht",
        };
        updateUser(NewUser);
        console.log(NewUser);
        navigation.navigate("Tabs");
      } else console.log(output.message);
    },
    onError: (error) => {
      console.log("Error during login:", error);
    },
  });
  const handleLogin = () => {
    mutate({ email, password });
  };

  return (
    <View className="flex-1 items-center justify-center bg-light">
      <Text className="-mt-10 mb-8 text-2xl font-semibold text-dark">
        ¡Bienvenid@ de nuevo!
      </Text>
      <View className="w-72">
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
        <Text className="my-2 text-xs">¿Has olvidado tu contraseña?</Text>
        <Text onPress={handleLogin}>Iniciar sesión</Text>
        <Text className="mt-2 text-sm text-dark">
          ¿Todavía no tienes cuenta?{" "}
          <Link to={{ screen: "Tabs" }}>
            {/*PRUEBAS: cambiar Tabs por Register*/}
            <Text className="text-pink underline">Únete</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
