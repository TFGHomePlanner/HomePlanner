import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "@react-navigation/native";
import { trpc } from "../server/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../_App";
import { UserContext } from "../context/userContext";
import { IUser, UserContextType } from "../context/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
  Raleway_900Black,
} from "@expo-google-fonts/raleway";
import { Belleza_400Regular } from "@expo-google-fonts/belleza";

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
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_900Black,
    Belleza_400Regular,
  });

  const { updateUser } = React.useContext(UserContext) as UserContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputStyle =
    "mb-3 border-[1px] font-sans rounded-xl w-full border-darkGray bg-lightGray p-2 text-dark";

  // Mutación de TRPC para iniciar sesión
  const { mutate } = trpc.user.login.useMutation({
    onSuccess: async (output) => {
      if (output.success) {
        const userId: IUser = {
          id: output.user.id,
          groupId: "",
          isAdmin: false,
        };
        try {
          await AsyncStorage.setItem("userData", JSON.stringify(userId));
        } catch (error) {
          console.error(
            "Error al guardar los datos del usuario en la caché:",
            error
          );
        }
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
      className="h-full w-full bg-light"
    >
      <View className="flex-1 items-center justify-center px-12">
        <Text className="font-belleza text-5xl text-dark">HOME</Text>
        <Text className="mb-10 font-sans text-xl text-dark">P L A N N E R</Text>
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
          secureTextEntry={true}
        />
        <Text className="mb-2 self-end font-ralewayMedium text-xs font-semibold text-blue">
          ¿Has olvidado tu contraseña?
        </Text>
        <TouchableOpacity
          onPress={handleLogin}
          className="mt-6 w-full rounded-lg bg-blue p-2"
        >
          <Text className="text-center font-ralewayMedium text-base text-light">
            Iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="mb-12 text-center font-sans text-placeholderGray">
        ¿Todavía no tienes cuenta?{" "}
        <Link to={{ screen: "Register" }}>
          <Text className="font-ralewayMedium text-blue">Únete</Text>
        </Link>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
