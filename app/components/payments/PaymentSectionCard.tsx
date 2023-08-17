import React from "react";
import { Pressable, Text, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IPaymentSection } from "../../common/validation/payment";

/**
 * @typedef {object} ListCardProps Props necesarios para el componente ListCard
 * @property {NativeStackNavigationProp<AppStackParamList, "DetailsList">} navigation Permite la navegación entre pantallas
 * @property {IList} list Lista que se está editando
 * 
 */
type PaymentSectionCardProps = {
   navigation: NativeStackNavigationProp<any>;
   paymentSection: IPaymentSection;
};


const PaymentSectionCard: React.FC< PaymentSectionCardProps> = ({ navigation, paymentSection }) => {

  
  function move() {
    navigation.navigate("PaymentList", {Payments: paymentSection});
  }
  return (
    <Pressable onPress={move}>
      <View className="flex flex-col mb-4 items-start rounded-lg  shadow-md shadow-black bg-[#fbf9f7] p-4">
        <View className="flex justify-between w-full flex-row">
          <View className = "flex flex-row">
            <Icon name="dollar-sign" size={20} color="#21CF84" /> 
            <Text className="ml-2 -mt-1 text-lg font-bold text-black">{paymentSection.title}</Text>
          </View>
          <Text className="font-bold text-lg">{paymentSection.totalAmount.toString() + "€"}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500">{paymentSection.description ? paymentSection.description.slice(0, 30) + "..." : ""}</Text>
        </View>
        <Text className="mt-3  mb-1 text-sm italic text-placeholderGray">{paymentSection.createdAt.toLocaleDateString()}</Text>
      </View>
    </Pressable>
  );
};
export default PaymentSectionCard;
  