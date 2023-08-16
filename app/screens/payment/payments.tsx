import React from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PaymentListScreen from "./paymentlist";
import { AppStackParamList } from "../../_App";



type PaymentScreenProps = {
    route: RouteProp<AppStackParamList, "Payments">;
    navigation: NativeStackNavigationProp<AppStackParamList, "Payments">;
  };

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const Tab = createMaterialTopTabNavigator();
  const Payments = route.params.Payments;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PaymentList"
        component={PaymentListScreen}
        initialParams={{ Payments: Payments, navigation: navigation }}
      />
    </Tab.Navigator>
   
  );

};

export default PaymentScreen;
 