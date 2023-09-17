import React, {useState} from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../_App";
import { View, Text, ScrollView, TextInput, TouchableOpacity} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { SelectList } from "react-native-dropdown-select-list";
import { Divider } from "@ui-kitten/components";
import { trpc } from "../../server/utils/trpc";
import Icon from "react-native-vector-icons/FontAwesome5";
import { pickImageAndUploadToS3 } from "../../components/ImagePickerC";
import Snackbar from "react-native-snackbar";


/**
 * Propiedades para la pantalla de creación de pagos.
 * 
 */
type CreatePaymentScreenProps = {
    route: RouteProp<AppStackParamList, "CreatePayment">;
    navigation: NativeStackNavigationProp<AppStackParamList, "CreatePayment">;
  };


const CreatePaymentScreen: React.FC<CreatePaymentScreenProps> = ({
  route,
  navigation,
}) => {

  const utils = trpc.useContext();
  const [title, setTitle] = useState<string>("");
  const [price, setprice] = useState<string>("0");
  const [total, settotal] = useState<number>(0);
  const [imageUrl, setimageUrl] = useState<string>("");
  const PaymentSection = route.params.Payments;
  const Users = PaymentSection.participants;
  
  const [participantsAmounts, setParticipantsAmounts] = useState<{[userId: string]: string }>({});


  const handleImageSelected = async () => {
    pickImageAndUploadToS3((imageUrl) => {
      setimageUrl(imageUrl);
    });
  };

  const handleParticipantAmountChange = async (userId: string, amount: string) => {
    console.log("userId: " + userId + " amount: " + amount);
  
    // Actualiza el estado de participantsAmounts
    setParticipantsAmounts((prevCheckedItems) => ({
      ...prevCheckedItems,
      [userId]: amount,
    }));
  
    // Calcula el total usando el valor actualizado de participantsAmounts
    const updatedParticipantsAmounts: { [userId: string]: string } = {
      ...participantsAmounts,
      [userId]: amount,
    };
    total1(updatedParticipantsAmounts); // Pasa el valor actualizado como argumento
  };
  
  function total1(updatedParticipantsAmounts: { [userId: string]: string }) {
    const newTotal = Object.values(updatedParticipantsAmounts)
      .filter((amt) => amt !== "")
      .map((amt) => parseFloat(amt))
      .reduce((acc, amt) => acc + amt, 0);
    console.log("newTotal: " + newTotal);
    settotal(newTotal);
    console.log("total: " + newTotal);
  }
  
  

  const [selectedUser, setSelectedUser] = useState("");
  const userOptions = PaymentSection.participants.map((user) => ({
    key: user.id,
    value: user.name,
  }));

  
  const mutattion = trpc.payment.createPayment.useMutation({
    onSuccess: () => {
      utils.payment.getPaymentsSection.invalidate();
      navigation.goBack();
    },
  });
  
  function createPayment() {
    if(isCorrectdate()) {
      const debtorUsersArray = Object.entries(participantsAmounts).map(([userId, amount]) => ({
        amount: parseFloat(amount),
        debtorId: userId,
      
      }));
      console.log(title);

      mutattion.mutate({
        title: title,
        payingUserId: selectedUser,
        amount: parseFloat(price),
        paymentSectionId: PaymentSection.id,
        debtorUsers: debtorUsersArray,
      });
    }
  }

  function isCorrectdate() {
    let error = ""; 
    if(title == "" || title == null) {
      error = "El título no puede estar vacío";
    }
    else if (price == "" || price == null) {
      error = "El precio no puede estar vacío";
    }
    else if (total != parseFloat(price)) {
      error = "El total no coincide con la suma de los participantes";
    }
    if (error != "") {
     
      return false;
    }
    else { return true; }
  }

  
  return (
    <View className="flex flex-1 flex-col w-full h-full bg-light">
      <Header />
      <ScrollView className="flex flex-1 pb-10 space-y-2 px-6">
        <View className="flex flex-row justify-between mr-10"> 
          <View className="w-full">
            <View className="flex flex-row pt-2 pr-1 items-center">
              <Text className="text-lg font-semibold">Título: </Text>
              <TextInput
                className="flex flex-row w-36 border-b-2 border-[#21CF84] bg-light  text-dark"
                value={title}
                onChangeText={setTitle}
                maxLength={20}
              />
            </View>
            <View className="flex flex-row pt-2 items-center">
              <Text className="text-lg font-semibold pr-2">Total: </Text>
              <TextInput
                className="flex flex-row w-36 border-b-2 border-[#21CF84] bg-light  text-dark"
                value={price.toString()}
                onChangeText={(text) => {
                  let numericValue = text.replace(/[^0-9,.]/g, ""); // Permitir solo números, comas y puntos
                  const parts = numericValue.split(/[,.]/);
                  if (parts.length > 1) {
                    // Si hay más de un punto o coma, reemplazar solo el último
                    numericValue = parts.slice(0, -1).join("") + "." + parts[parts.length - 1];
                  }
                  setprice(numericValue);
                }}
                maxLength={20}
                keyboardType="numeric"
              />
              <Text className="text-lg font-semibold">€</Text>
            </View>
          </View>
          <View className="flex flex-row justify-center mt-8">
            <TouchableOpacity className="h-8 w-8 bg-light items-center" onPress={handleImageSelected}>
              <Icon name="paperclip" size={30} color={imageUrl !="" ? "#21CF84" : "#212529"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="fflex flex-row pt-2 items-center z-10">
          <Text className="text-lg font-semibold pr-4">Pagado por:</Text>
          <SelectList
            data={userOptions}
            setSelected={setSelectedUser}
            save="key"
            search={false}
            dropdownStyles={{
              borderColor: " #212529",
              backgroundColor: "#3A3A3C",
              opacity: 0.85,
              position: "absolute",
              right: 0,
              top: 34,
              width: 180,
              borderRadius: 12,
              zIndex: 5
            }}
            dropdownTextStyles={{ color: "#FFFF", fontWeight: "500" }}
            boxStyles={{
              height: 42,
              width: 140,
              borderColor: "#212529",
              alignSelf: "flex-end",
              zIndex: 5,
            }}
            placeholder="Seleccionar"
          />
        </View>
        <View className="flex flex-row justify-between pt-8">
          <Text className="text-xl font-bold pt-2">Participantes:</Text>
          <Text className="text-lg font-semibold pt-2">{total + "/" + price}</Text>
        </View>
        {Users.map((user) => (
          <View key={user.id} className="flex flex-col pt-2">
            <View className="flex flex-row justify-between pt-2">
              <Text className="text-lg font-semibold">{user.name}</Text>
              <View className="flex flex-row justify-start">
                <TextInput
                  className="flex flex-row w-20 border-b-2 border-[#21CF84] bg-light  text-dark"
                  value={participantsAmounts[user.id]}
                  onChangeText={(text) => {
                    let numericValue = text.replace(/[^0-9,.]/g, ""); // Permitir solo números, comas y puntos
                    const parts = numericValue.split(/[,.]/);
            
                    if (parts.length > 1) {numericValue = parts.slice(0, -1).join("") + "." + parts[parts.length - 1];}

                    (numericValue === "" || numericValue === "0" ? handleParticipantAmountChange(user.id, ""): handleParticipantAmountChange(user.id, numericValue)); 
                  }}
                  maxLength={20}
                  keyboardType="numeric"
                />
                <Text className="text-lg font-semibold">€</Text>
              </View>
            </View>
            <Divider />
          </View>

        ))}
       
      </ScrollView>
      <TouchableOpacity
        onPress={createPayment}
        className="flex flex-row justify-center pb-4 px-6 w-full"
      >
        <View className="flex w-full flex-row justify-center rounded-xl bg-dark py-4 mb-8 space-x-2 ">
          <Icon name="plus" size={20} color="#21CF84" className="pt-2 mt-2"/>
          <Text className=" text-lg font-bold text-green"> Crear Pago</Text>
        </View> 
      </TouchableOpacity>
      
    </View>
  );
};
  
export default CreatePaymentScreen;