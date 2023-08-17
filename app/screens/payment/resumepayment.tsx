import React from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { View, Text, ScrollView } from "react-native";
import { Header } from "../../components/Header";
import { trpc } from "../../server/utils/trpc";


type ResumePaymentsScreenScreenProps = {
    route: RouteProp<AppStackParamList, "ResumePayments">;
    navigation: NativeStackNavigationProp<AppStackParamList, "ResumePayments">;
    };
  
const ResumePaymentScreenScreen: React.FC<ResumePaymentsScreenScreenProps> = ({
  route,
  navigation,
}) => {

  const {data: resume} = trpc.payment.paymentsresume.useQuery(
    {
      idPaymentSection: route.params.Payments.id,
    }
  );

  return (
    <View className="flex-1 bg-light">
      <Header />
      <View className="flex-1 p-4">
        <Text>ResumePaymentScreenScreen</Text>
        <ScrollView className="mt-4">
          {resume?.map((saldo, index) => (
            <View
              key={index}
              className={`flex-row items-center justify-between p-2 border-b border-gray-300 ${
                saldo.cantidad >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <Text>{saldo.nombre}</Text>
              <Text className="text-lg">{saldo.cantidad}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default ResumePaymentScreenScreen;