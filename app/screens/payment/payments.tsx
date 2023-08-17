import React from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PaymentListScreen from "./paymentlist";
import { App, AppStackParamList } from "../../_App";
import { IPaymentSection } from "../../common/validation/payment";


type PaymentScreenProps = {
    route: RouteProp<AppStackParamList, "Payments">;
    navigation: NativeStackNavigationProp<AppStackParamList, "Payments">;
  };

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  route,
  navigation,

}) => {
  const Tab = createMaterialTopTabNavigator<AppStackParamList>();
  const Payments = route.params.Payments;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PaymentList"
        component={PaymentListScreen}
        initialParams={{ Payments: Payments}}
      />
    </Tab.Navigator>
   
  );

};

export default PaymentScreen;
 