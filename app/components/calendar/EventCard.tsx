import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IEvent } from "../../common/validation/event";
import { format } from "date-fns";

export default function EventCard({ event }: { event: IEvent }) {
  return (
    <TouchableOpacity className="mb-4 w-full flex-row space-x-1 rounded-lg p-5 pr-8">
      <View className="h-full w-[5] rounded-full bg-orange" />
      <View className="w-full space-y-2">
        <View className="flex-row justify-between">
          <Text className="font-medium text-dark"> {event.name}</Text>
          {event.allDay ? (
            <Text>Todo el día</Text>
          ) : (
            <Text>{format(event.startsAt.getTime(), "hh:mm")} h</Text>
          )}
        </View>
        {event.location && (
          <Text className="text-placeholderGray">📍{event.location}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
