import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { View, Text} from "react-native";
import { RouteProp } from "@react-navigation/native";


/**
 * Propiedades para la pantalla de creación de pagos.
 * 
 */
type CreatePaymentScreenProps = {
    route: RouteProp<AppStackParamList, "CreatePayment">;
    navigation: NativeStackNavigationProp<AppStackParamList, "CreatePayment">;
  };


const CreatePaymentScreen: React.FC<CreatePaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const PaymentSection = route.params.PaymentSection;
  const Users = PaymentSection.users;
  return (
    <View>
      <Text>Payment</Text>
    </View>
  );
};
  
export default CreatePaymentScreen;