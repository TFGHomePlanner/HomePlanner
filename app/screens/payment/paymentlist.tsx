import React from "react";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type PaymentListScreenProps = {
    route: RouteProp<AppStackParamList, "PaymentList">;
    navigation: NativeStackNavigationProp<AppStackParamList, "PaymentList">;
  };

const PaymentListScreen: React.FC<PaymentListScreenProps> = ({
  route,
  navigation,
}) => { 
  const Payment = route.params.Payment;
  return (
    <View>
      <Text>Detalles de pago</Text>
    </View>
  );
};
export default PaymentListScreen;