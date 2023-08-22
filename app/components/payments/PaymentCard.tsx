import React from "react";
import { Pressable, Text, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IPayment } from "../../common/validation/payment";

/**
 * @typedef {object} ListCardProps Props necesarios para el componente ListCard
 * @property {NativeStackNavigationProp<AppStackParamList, "DetailsList">} navigation Permite la navegación entre pantallas
 * @property {IList} list Lista que se está editando
 * 
 */
type PaymentCardProps = {
   navigation: NativeStackNavigationProp<any>;
   payment: IPayment;
};

/**
 * COmponete que se encarga de mostrar un pago en forma de tarjeta con la
 * información más relevante del mismo.
 *
 * @param {NativeStackNavigationProp<AppStackParamList, "DetailsList">} props.navigation Permite la navegación entre pantallas
 * @param {IList} props.list Lista que se está editando
 * @returns {React.FC} Componente ListCard
 */
const PaymentCard: React.FC< PaymentCardProps> = ({ navigation, payment }) => {

  /**
   * Función que se encarga de navegar a la pantalla de detalles de la lista
   * @returns {void}
   */
  function move() {
    navigation.navigate("PaymentDetails", { Payment: payment });
  }

  return (
    <Pressable onPress={move}>
      <View className="flex flex-col mb-4 items-start rounded-lg  shadow-md shadow-black bg-dark p-4">
        <View className="flex justify-between w-full flex-row">
          <View className = "flex flex-row">
            <Icon name="dollar-sign" size={20} color="#21CF84" /> 
            <Text className="ml-2 -mt-1 text-lg font-bold text-white">{payment.title}</Text>
          </View>
          <Text className="font-bold text-lg text-white">{payment.amount.toString() + "€"}</Text>
        </View>
        <View>
          <Text className="text-sm text-white" >{"Pagado por" + payment.payingUser.name}</Text>
        </View>
        <Text className="mt-3  mb-1 text-sm italic text-placeholderGray">{payment.createdAt.toLocaleDateString()}</Text>
      </View>
    </Pressable>
  );
};
export default PaymentCard;
  