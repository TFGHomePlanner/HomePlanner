import { Alert, Text, TouchableOpacity, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AppStackParamList } from "../../_App";
import { UserContextType } from "../../context/types";
import { UserContext } from "../../context/userContext";
import { trpc } from "../../trpc";
import { Header } from "../../components/Header";
import { format } from "date-fns";

type ReservationDetailScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "ReservationDetail">;
  route: RouteProp<AppStackParamList, "ReservationDetail">;
};

const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const Reservation = route.params.Reservation;
  const { User } = useContext(UserContext) as UserContextType;

  const canEdit = User.id === Reservation.createdBy.id || User.isAdmin;
  const utils = trpc.useContext();

  function goToEditReservation() {
    navigation.navigate("CreateReservation", { Reservation, edit: true });
  }

  const deleteMutation = trpc.event.deleteReservation.useMutation({
    onSuccess() {
      utils.event.getAllReservations.invalidate();
      navigation.navigate("Tabs");
    },
  });
  function deleteReservation() {
    deleteMutation.mutateAsync({ id: Reservation.id });
  }
  function handleDelete() {
    Alert.alert("Eliminar reserva", "", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteReservation(),
      },
    ]);
  }

  return (
    <View className="h-full bg-light">
      <Header />
      <View className="flex-1 px-6 pb-10">
        <View className="flex-1 space-y-4">
          {canEdit && (
            <Text
              onPress={goToEditReservation}
              className="self-end text-purple"
            >
              Editar
            </Text>
          )}
          <Text className="text-xl font-bold">
            Reserva de {Reservation.room}
          </Text>
          <Text className="self-end text-base">
            👤 {Reservation.createdBy.name}
          </Text>
          <View className="h-20 rounded-lg bg-white px-4 py-3">
            <Text>{Reservation.description}</Text>
          </View>
          {Reservation.allDay ? (
            <Text>⏳Todo el día</Text>
          ) : (
            <View className="space-y-1">
              <Text className="text-dark">
                Empieza a las {format(Reservation.startsAt.getTime(), "HH:mm")}{" "}
                h
              </Text>
              <Text className="text-dark">
                Acaba a las{" "}
                {format(Reservation.endsAt?.getTime() || 1, "HH:mm")} h
              </Text>
            </View>
          )}
        </View>
        {canEdit && (
          <TouchableOpacity onPress={handleDelete} className="self-center">
            <Text className="text-purple">Eliminar reserva</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ReservationDetailScreen;
