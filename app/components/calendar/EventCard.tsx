import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IEvent } from "../../common/validation/event";
import { format } from "date-fns";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type EventCardProps = {
  navigation: NativeStackNavigationProp<any>;
  event: IEvent;
};

const EventCard: React.FC<EventCardProps> = ({ navigation, event }) => {
  function goToEventDetail() {
    navigation.navigate("EventDetail", { Event: event });
  }
  return (
    <TouchableOpacity
      onPress={goToEventDetail}
      className="w-full flex-row space-x-1 rounded-lg px-4 py-3 pr-8"
    >
      <View className="h-full w-[5] rounded-full bg-orange" />
      <View className="w-full space-y-2">
        <View className="flex-row justify-between">
          <Text className="font-medium text-dark"> {event.name}</Text>
          {event.allDay ? (
            <Text>Todo el día</Text>
          ) : (
            <Text>{format(event.startsAt.getTime(), "HH:mm")} h</Text>
          )}
        </View>
        {event.location && (
          <Text className="text-placeholderGray">📍{event.location}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
