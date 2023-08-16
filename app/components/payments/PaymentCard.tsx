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


const PaymentCard: React.FC< PaymentCardProps> = ({ navigation, payment }) => {

  function move() {
    navigation.navigate("Payment", { Payment: payment });
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
  