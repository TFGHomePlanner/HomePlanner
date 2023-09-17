import { Alert, Text, TouchableOpacity, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { AppStackParamList } from "../../_App";

type ReservationDetailScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "ReservationDetail">;
  route: RouteProp<AppStackParamList, "ReservationDetail">;
};

const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({
  navigation,
  route,
}) => {
  return <Text>hola</Text>;
};

export default ReservationDetailScreen;
