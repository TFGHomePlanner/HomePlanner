import React, { useContext, useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Header } from "../../components/Header";
import { trpc } from "../../server/utils/trpc";
import {calculateTransactionsToBalance}  from "../../common/helper";
import { Divider } from "@ui-kitten/components";
import Icon from "react-native-vector-icons/FontAwesome5";

export type Transaction = {
  deudor: string;
  acreedor: string;
  monto: number;
};

type ResumePaymentsScreenScreenProps = {
  route: RouteProp<AppStackParamList, "ResumePayments">;
  navigation: NativeStackNavigationProp<AppStackParamList, "ResumePayments">;
};

const ResumePaymentScreenScreen: React.FC<ResumePaymentsScreenScreenProps> = ({
  route,
  navigation,
}) => {
  const { data: resume } = trpc.payment.paymentsresume.useQuery({
    idPaymentSection: route.params.Payments.id,
  });
  const mutation = trpc.payment.closeSection.useMutation({
    onSuccess: () => {
      setIsClosed(true);
      handleCalculateTransactions();
    }
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClosed, setIsClosed] = useState<boolean>(route.params.Payments.isClosed);

  const handleCalculateTransactions = () => {
    const saldosUsuarios: Record<string, number> = {};
    if (!resume) {
      return;
    }
  
    resume.forEach((saldo) => {
      const nombre = saldo.nombre ?? "";
      saldosUsuarios[nombre] = saldo.cantidad;
    });
   
    const calculatedTransactions = calculateTransactionsToBalance(saldosUsuarios);
    setTransactions(calculatedTransactions);
  };
  
  useEffect(() => {
    if(isClosed){
      handleCalculateTransactions();
    }});
  
  function closePaymentSection() {
    mutation.mutateAsync({
      idPaymentSection: route.params.Payments.id,
    });
  }

  return (
    <View className="bg-light flex-1">
      <Header />
      <View className="flex-1 bg-light p-6">
        <ScrollView className="flex-1">
          <Text className="text-xl pb-2 font-semibold">Resumen</Text>
          <View className="flex-col bg-white rounded-lg pt-4 justify-between p-2  border-1 border-#21CF84">
            {resume?.map((saldo, index) => (
              <View  key={index} className="flex-col  justify-between pt-2">
                <View  className="flex-row items-center justify-between p-2">
                  <Text className="text-base font-semibold">{saldo.nombre}</Text>
                  <Text className={` text-base font-semibold  ${saldo.cantidad == 0 ? "text-black" : saldo.cantidad > 0 ? "text-green" : "text-red" } pb-2`}>{saldo.cantidad}</Text>
                </View>
                {index != resume.length - 1 && (
                  <Divider/>
                )
                }
              </View>
            ))}
          </View>
          {!isClosed && (
            <Pressable onPress={closePaymentSection}  className=" w-full self-end items-end ml-2 pt-4">
              <View className="flex flex-row justify-center items-center bg-dark rounded-full py-4 px-6 shadow-md shadow-black self-end">
                <Text className="text-white text.lg pr-2">Calcular pagos</Text>
                <Icon name="eye" size={20} color="#21CF84" />
              </View>
            </Pressable>
          )}
          {transactions.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text>Transacciones para equilibrar los saldos:</Text>
              {transactions.map((transaccion, index) => (
                <Text key={index}>
                  {transaccion.deudor} paga a {transaccion.acreedor}: {transaccion.monto}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
        
      </View>
    </View>
  );
};

export default ResumePaymentScreenScreen;
