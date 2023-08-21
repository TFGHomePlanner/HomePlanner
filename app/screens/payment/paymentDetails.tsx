import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { AppStackParamList } from "../../_App";
import { RouteProp } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { Divider } from "@ui-kitten/components";




type PaymentDetailsScreenProps = {
  route: RouteProp<AppStackParamList, "PaymentDetails">;
  
};

const PaymentDetailScreen: React.FC<PaymentDetailsScreenProps> = ({
  route,

}) => {
  const PaymentDetail = route.params.Payment;
  const  [showImage, setShowImage] = useState(false);
   
  return (
    <View className="w-full h-full flex flex-col bg-light">
      <Header />
      <ScrollView className="w-full h-full px-6 flex flex-col pt-4">
        <View className="flex flex-row justify-between">
          <Text className="text-3xl font-bold text-green">{PaymentDetail.title}</Text>
          <Text className="text-3xl font-bold text-black">{PaymentDetail.amount + "€"}</Text>
        </View>
        <Divider/>
        <View className="flex flex-row justify-between pt-2 space-x-2 items-center">
          <View className="flex flex-row justify-start space-x-2 items-center">
            <Text className="text-lg text-placeholderGray">Pagado por</Text>  
            <Text className="text-lg font-semibold">{PaymentDetail.payingUser.name}</Text>
          </View>
          <Text className=" text-md text-placeholderGray pt-2">{PaymentDetail.createdAt.toLocaleDateString()}</Text>
        </View>
        
        
        <Text className="text-2xl mb-2 font-semibold pt-3">A pagar</Text>
       
        <View className="w-full rounded-xl bg-white p-4">
          {PaymentDetail.debtorUsers && PaymentDetail.debtorUsers.map((debtor, index) => {
            return (
              <View key={debtor.debtor.id} className=" flex flex-col  pt-2">
                <View className="flex flex-row justify-between">
                  <Text className=" text-lg font-semibold">{debtor.debtor.name}</Text>
                  <Text className="text-green font-bold text-lg">{debtor.amount + "€"}</Text>
                </View>
                {index === PaymentDetail.debtorUsers.length - 1 ? null : (
                  <View className="my-4">
                    <Divider />
                  </View>
                )}
              </View>
            );
          })} 
        </View>    
        {PaymentDetail.imageURL &&  
        <TouchableOpacity onPress={() => setShowImage(!showImage)}>
          <Text className="text-lg font-semibold pt-4">{showImage ? "Ocultar factura"  :  "Mostrar factura" }</Text>
        </TouchableOpacity>
        }
        {showImage && PaymentDetail.imageURL && (
          <View className="w-full h-200 pt-4">
            <Image
              className="w-full h-200"
              source={{ uri: PaymentDetail.imageURL }}
              style={{ width: "100%", height: 400 }}
            />
          </View>
        )}


          
      </ScrollView>
    </View>
  );
};

export default PaymentDetailScreen;
