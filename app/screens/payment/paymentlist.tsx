import React from "react";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import { View, Text, ScrollView} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "../../components/Header";
import Icon from "react-native-vector-icons/FontAwesome5";
import PaymentCard from "../../components/payments/PaymentCard";


type PaymentListScreenProps = {
  route: RouteProp<AppStackParamList, "PaymentList">;
  navigation: NativeStackNavigationProp<AppStackParamList, "PaymentList">;
  };

const PaymentListScreen: React.FC<PaymentListScreenProps> = ({
  route,
  navigation,
}) => { 
  const Payment= route.params.Payments;
  return (
    <ScrollView>
      <View className="bg-light w.full h-full">
        <Header />
        <ScrollView className="flex flex-col h-full px-6">
          <View className="flex flex-col pt-2">
            <View className="flex flex-row justify-between">
              <Text className="text-xl font-bold">{Payment.title}</Text>
              <View className="flex flex-row">
                <Text className="text-2xl font-bold pr-2">{Payment.totalAmount.toString()}</Text>
                <Icon name="dollar-sign" className="pt-1"size={30} color="#21CF84" /> 
              </View>  
            </View>
            <Text className="italic text-md pb-2 ">{Payment.createdAt.toLocaleDateString()}</Text>
            <Text className="text-md text-lg">{Payment.description}</Text>
          </View>
          <View className="flex flex-col pt-2">
            {Payment.payments && Payment.payments.map((payment, index) => (
              <PaymentCard key={index} payment={payment} navigation={navigation} />
            ))
            }
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  ); 
};
export default PaymentListScreen;