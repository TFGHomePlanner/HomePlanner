import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IReservation } from "../../common/validation/event";
import { format } from "date-fns";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ReservationCardProps = {
  navigation: NativeStackNavigationProp<any>;
  reservation: IReservation;
};

const ReservationCard: React.FC<ReservationCardProps> = ({
  navigation,
  reservation,
}) => {
  function goToReservationDetail() {
    navigation.navigate("ReservationDetail", { Reservation: reservation });
  }
  return (
    <TouchableOpacity
      onPress={goToReservationDetail}
      className="mb-4 w-full flex-row space-x-1 rounded-lg p-5 pr-8"
    >
      <View className="h-full w-[5] rounded-full bg-orange" />
      <View className="w-full space-y-2">
        <View className="flex-row justify-between">
          <Text className="font-medium text-dark"> {reservation.room}</Text>
          {reservation.allDay ? (
            <Text>Todo el día</Text>
          ) : (
            <Text>{format(reservation.startsAt.getTime(), "hh:mm")} h</Text>
          )}
        </View>
        <Text className="text-placeholderGray">📍{reservation.room}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReservationCard;
