import React, { useState, useContext } from "react";
import { Text, TextInput, View} from "react-native";
import { Link} from "@react-navigation/native";
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
  const {User, updateUser } = React.useContext(UserContext) as UserContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-2 text-lg border-b-[1px] border-lightBg p-2 text-lightBg";
  const { mutate } = trpc.user.login.useMutation({
    onSuccess: (output) => {
      if (output.success) {
        const NewUser: IUser = {
          id: output.user.id,
          groupId : "",
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
    <View className="bg-darkBg flex-1 items-center justify-center">
      <Text className="text-lightBg -mt-10 mb-8 text-2xl font-semibold">
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
        <Text className="text-lightBg mt-2 text-sm">
          ¿Todavía no tienes cuenta?{" "}
          <Link to={{ screen: "Tabs" }}>
            {/*PRUEBAS: cambiar Tabs por Register*/}
            <Text className="text-[#F1889F] underline">Únete</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
