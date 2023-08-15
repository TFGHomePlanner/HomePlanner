import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "@react-navigation/native";
import { trpc } from "../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../_App";
import { UserContext } from "../context/userContext";
import { IUser, UserContextType } from "../context/types";

/**
 * @typedef {object} LoginScreenProps
 * @property {NativeStackNavigationProp<AppStackParamList, "Login">} navigation
 *  */
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "Login">;
};
/**
 * Interfaz de usuario que permite iniciar sesión
 * @param {LoginScreenProps} props
 * @param {NativeStackNavigationProp<AppStackParamList, "Login">} props.navigation
 * @returns {JSX.Element} Interfaz de usuario que permite iniciar sesión
 */
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { updateUser } = React.useContext(UserContext) as UserContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-3 border-[1px] rounded-xl border-darkGray bg-lightGray p-2 text-dark";

  // Mutación de TRPC para iniciar sesión
  const { mutate } = trpc.user.login.useMutation({
    onSuccess: (output) => {
      if (output.success) {
        const userId: IUser = {
          id: output.user.id,
          groupId: "",
          isAdmin: false,
        };
        updateUser(userId);
        navigation.navigate("GroupSelection");
      } else console.log(output.message);
    },
    onError: (error) => {
      console.log("Error during login:", error);
    },
  });

  /**
   * Función que se encarga de iniciar sesión
   * @returns {void}
   */
  const handleLogin = () => {
    //LLamada mutation de trpc
    mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 items-center justify-center bg-light"
    >
      <Text className="-mt-10 mb-8 text-2xl font-semibold text-dark">
        homeplanner
      </Text>
      <View className="w-72">
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="#929193"
          value={email}
          onChangeText={setEmail}
          placeholder="email"
        />
        <TextInput
          className={`${inputStyle}`}
          placeholderTextColor="#929193"
          value={password}
          onChangeText={setPassword}
          placeholder="contraseña"
        />
        <Text className="mb-2 self-end text-xs font-semibold text-blue">
          ¿Has olvidado tu contraseña?
        </Text>
        <Pressable
          onPress={handleLogin}
          className="my-4 w-full rounded-lg bg-blue p-2"
        >
          <Text className="text-center font-medium text-light">
            Iniciar sesión
          </Text>
        </Pressable>
        <Text className="mt-2 text-sm text-placeholderGray">
          ¿Todavía no tienes cuenta?{" "}
          <Link to={{ screen: "Register" }}>
            <Text className="font-semibold text-blue">Únete</Text>
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
