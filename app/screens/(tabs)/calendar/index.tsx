import React, { useContext, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import "./localeConfig";
import { format, startOfMonth } from "date-fns";
import { Calendar, DateData } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppStackParamList } from "../../../_App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import { trpc } from "../../../trpc";
import EventCard from "../../../components/calendar/EventCard";
import ReservationCard from "../../../components/calendar/ReservationCard";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
  Raleway_900Black,
} from "@expo-google-fonts/raleway";

type TabCalendarScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabCalendar">;
};

const CalendarScreen: React.FC<TabCalendarScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_900Black,
  });

  const { User } = useContext(UserContext) as UserContextType;
  const { data: allEvents } = trpc.event.getAllEvents.useQuery({
    groupId: User.groupId,
  });
  const { data: allReservations } = trpc.event.getAllReservations.useQuery({
    groupId: User.groupId,
  });
  const allCalendarItems = [...(allEvents || []), ...(allReservations || [])];

  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const marked = useMemo(() => {
    const markedDates: any = {};
    selectedDate &&
      (markedDates[selectedDate] = {
        selected: true,
        selectedColor: "#212529",
      });

    allCalendarItems &&
      allCalendarItems.forEach((event) => {
        const eventDate = format(new Date(event.startsAt), "yyyy-MM-dd");
        if (!markedDates[eventDate]) markedDates[eventDate] = {};
        markedDates[eventDate] = {
          marked: true,
          dotColor: selectedDate === eventDate ? "white" : "#FFA755",
          selected: selectedDate === eventDate,
          selectedColor: "#212529",
        };
        markedDates[today] = {
          customStyles: {
            text: {
              fontFamily: "Raleway_700Bold",
              color: today === selectedDate ? "white" : "#FFA755",
            },
          },
          selected: today === selectedDate,
          selectedColor: "#FFA755",
          marked: today === eventDate,
          dotColor: today === selectedDate ? "white" : "#FFA755",
        };
      });

    return markedDates;
  }, [selectedDate, today, allEvents]);

  const handleMonthChange = (months: DateData[]) => {
    const firstDay = format(
      startOfMonth(new Date(months[0].dateString)),
      "yyyy-MM-dd"
    );
    months.length > 0 && setSelectedDate(firstDay);
  };

  function goToCreateEvent() {
    navigation.navigate("CreateEvent", { edit: false, startsAt: selectedDate });
  }

  return (
    <View className="h-full bg-light">
      <TouchableOpacity
        onPress={goToCreateEvent}
        className="mb-2 mr-5 items-end"
      >
        <Icon name="shape-square-rounded-plus" size={24} color={"#FFA755"} />
      </TouchableOpacity>
      <Calendar
        monthFormat="MMMM yyyy"
        theme={{
          textDayFontFamily: "Raleway_400Regular",
          textDayHeaderFontFamily: "Raleway_400Regular",
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        hideArrows={true}
        markingType="custom"
        markedDates={marked}
        enableSwipeMonths={true}
        onVisibleMonthsChange={handleMonthChange}
        minDate="2016-01-01"
        maxDate="2030-12-31"
        firstDay={1}
      />
      <ScrollView>
        {allEvents?.map((event) => {
          const eventStartDate = new Date(event.startsAt);
          return (
            !isNaN(eventStartDate.getTime()) &&
            selectedDate === format(eventStartDate, "yyyy-MM-dd") && (
              <EventCard
                key={event.id}
                navigation={navigation}
                event={{
                  ...event,
                  startsAt: eventStartDate,
                  endsAt: event.endsAt ? new Date(event.endsAt) : null,
                }}
              />
            )
          );
        })}
        {allReservations?.map((reservation) => {
          const reservationDate = new Date(reservation.startsAt);
          return (
            !isNaN(reservationDate.getTime()) &&
            selectedDate === format(reservationDate, "yyyy-MM-dd") && (
              <ReservationCard
                key={reservation.id}
                navigation={navigation}
                reservation={{
                  ...reservation,
                  startsAt: reservationDate,
                  endsAt: reservation.endsAt
                    ? new Date(reservation.endsAt)
                    : null,
                }}
              />
            )
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
