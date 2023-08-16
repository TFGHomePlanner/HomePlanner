import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Header } from "../../components/Header";


/**
 * @typedef {object} DetailsScreenProps Props necesarios para el componente DetailsScreen
 * @property {RouteProp<AppStackParamList, "DetailsList">} route Contiene los parametros que se le pasan a la ruta
 * @property {NativeStackNavigationProp<AppStackParamList, "DetailsList">} navigation Permite la navegación entre pantallas
 */
type PaymentScreenProps = {
  route: RouteProp<AppStackParamList, "Payment">;
  navigation: NativeStackNavigationProp<AppStackParamList, "Payment">;
};

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const PaymentDetail = route.params.Payment;
  return (
    <View className="w-full h-full felx felx-col">
      <Header />
      <ScrollView className="w-full h-full p-2 flex flex-col">
        <Text>{"Pagado por" + PaymentDetail?.payingUser.name} </Text>  
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
