
import React, {useState} from "react";
import AddIcon from "react-native-vector-icons/FontAwesome5";
import { Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { trpc } from "../../../server/utils/trpc";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import PaymentSectionCard from "../../../components/payments/PaymentSectionCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Pressable } from "react-native";

type TabPaymentsScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabPayments">;
};

const TabPaymentsScreen : React.FC<TabPaymentsScreenProps> = ({ navigation }) =>  {
  const utils = trpc.useContext();
  const mutation = trpc.payment.createPaymentSection.useMutation({
    onSuccess: () => {utils.payment.getAllPaymentsSections.invalidate();}
  }
  );
  const {User} = React.useContext (UserContext) as UserContextType;
  const [newSection, setNewSection] = useState (false);
  const [title, settitle] = useState ("");
  const [description, setdescription] = useState ("");
  const {data: paymentSections} = trpc.payment.getAllPaymentsSections.useQuery ({
    groupId: User.groupId,
  });

  /** 
   * Función que se encarga de navegar a la pantalla de creación de secciones.
   * @returns {void}
   * */
  function createNewSection() {
    setNewSection(!newSection);
  }


  function saveNewSection() {
    if (title && description) {
      mutation.mutateAsync({
        title,
        description,
        groupId: User.groupId,
      });
    
      setNewSection(false);
      setdescription("");
      settitle("");
    }
  }

  return (
    <View className="bg-[#F8F3ED] p-4 w-full h-full">
      <TouchableOpacity onPress={createNewSection}>
        <View className="bg-green marker:p-3 rounded-xl flex flex-row items-center justify-start w-full">
          {!newSection && <AddIcon name="plus" size={20} color="white" className="mr-2" />}
          <Text className="text-lg font-bold ml-2 text-white pl-4">{!newSection ? "Crear nueva sección" : "Cancelar"}</Text>
        </View>
      </TouchableOpacity>
      {/* ScrollView */}
      <ScrollView showsVerticalScrollIndicator={false} className="p-1 pt-4"> 
        {newSection && 
         <View className="flex flex-col mb-4 items-start rounded-lg shadow-md shadow-black bg-[#fbf9f7] p-4">
           <View className = "flex flex-row">
             <Icon name="dollar-sign" size={20} color="#21CF84" /> 
             <Text className="ml-2 -mt-1 text-lg font-bold text-black">Nueva sección</Text>
           </View>
           <TextInput
             className="mt-4 order-[1px] rounded-xl w-72- border-darkGray bg-lightGray p-2 text-dark"
             placeholderTextColor="#929193"
             value={title}
             onChangeText={settitle}
             placeholder="título sección *"
           />
           <View className = "mt-2 flex-row justify-between w-full items-center">
             <TextInput
               className="border-[1px] rounded-xl w-52 border-darkGray bg-lightGray p-2 text-dark"
               placeholderTextColor="#929193"
               value={description}
               onChangeText={setdescription}
               placeholder="descripción *"
               multiline={true}
             />
             <Pressable onPress={saveNewSection} className="bg-green rounded-full h-9 w-20 justify-center">
               <Text className="text-white text-center font-bold">Guardar</Text>
             </Pressable>
           </View>
         </View>
        }
        {paymentSections ? paymentSections.map((p) => (
          <PaymentSectionCard key={p.id} 
            paymentSection={{
              ...p,
              createdAt: new Date(p.createdAt),
              payments: p.payments.map((payment) => ({
                ...payment,
                createdAt: new Date(payment.createdAt),
              })),
            }}
            navigation={navigation} />
        )) :<Text className="text-lg font-bold mb-2">No hay ninguna sección de pagos</Text>
        }
      </ScrollView>
    </View>
  );
};
export default TabPaymentsScreen;