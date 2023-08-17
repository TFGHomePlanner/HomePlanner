import React from "react";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import { View, Text, ScrollView, Pressable} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "../../components/Header";
import Icon from "react-native-vector-icons/FontAwesome5";
import PaymentCard from "../../components/payments/PaymentCard";
import { trpc } from "../../server/utils/trpc";



type PaymentListScreenProps = {
  route: RouteProp<AppStackParamList, "PaymentList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "PaymentList">;
  };

const PaymentListScreen: React.FC<PaymentListScreenProps> = ({
  route,
  navigation,
}) => { 
  const PaymentSection= route.params.Payments;
  const {data: payments} = trpc.payment.getPaymentsSection.useQuery({
    paymentSectionId: PaymentSection.id,
  } );
  function createnew () {
    navigation.navigate("CreatePayment", {Payments: PaymentSection});
  }

  function gotoresume() {
    navigation.navigate("ResumePayments", {Payments: PaymentSection});
  }
  return (
    <View className="bg-light w.full h-full">
      <Header />
      <ScrollView className="flex flex-col h-full px-6">
        <View className="flex flex-col pt-2">
          <View className="flex flex-row justify-between">
            <Text className="text-xl font-bold">{PaymentSection.title}</Text>
            <View className="flex flex-row">
              <Text className="text-2xl font-bold pr-2">{PaymentSection.totalAmount.toString()}</Text>
              <Icon name="dollar-sign" className="pt-1"size={30} color="#21CF84" /> 
            </View>  
          </View>
          <Text className="italic text-md pb-2 ">{PaymentSection.createdAt.toLocaleDateString()}</Text>
          <Text className="text-md text-lg">{PaymentSection.description}</Text>
        </View>
        <View className="flex flex-col pt-2">
          <Pressable onPress={createnew}>
            <View className=" mb-4 flex justify-between w-full flex-row rounded-lg  shadow-md shadow-black bg-dark p-4">
              <View className = "flex flex-row">
                <Icon name="plus" size={20} color="#21CF84" /> 
                <Text className="ml-2 -mt-1 text-lg font-bold text-white">Crear nuevo pago</Text>
              </View>
            </View>
          </Pressable>
          {payments && payments.map((payment, index) => (
            <PaymentCard key={index} payment={{
              ...payment,
              createdAt: new Date(payment.createdAt),
            }} navigation={navigation} />
          ))
          }
        </View>
      </ScrollView>
      <View className="flex flex-row justify-center items-center bg-light">
        <Pressable onPress={gotoresume} className=" w-full self-end items-end mr-4 mb-6">
          <View className="flex flex-row justify-center items-center bg-dark rounded-full w-56 h-14 shadow-md shadow-black slef-end">
            <Text className="text-white text.lg">Ver resumen</Text>
            <Icon name="arrow-right" size={20} color="#21CF84" />
          </View>
        </Pressable>
      </View>
    </View>
  ); 
};
export default PaymentListScreen;