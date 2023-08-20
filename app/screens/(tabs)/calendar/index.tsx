import React, { useContext, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/AntDesign";
import { AppStackParamList } from "../../../_App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import "./localeConfig";
import { trpc } from "../../../trpc";

type TabCalendarScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabCalendar">;
};

const CalendarScreen: React.FC<TabCalendarScreenProps> = ({ navigation }) => {
  const { User } = useContext(UserContext) as UserContextType;
  const { data: allEvents } = trpc.event.getAllEvents.useQuery({
    groupId: User.groupId,
  });

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const marked = useMemo(() => {
    const markedDates: any = {};

    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: "#212529",
        selectedTextColor: "white",
      };
    }

    markedDates[today] = {
      customStyles: {
        text: {
          fontWeight: "bold",
          color: selectedDate === today ? "white" : "#FFA755",
        },
      },
      selected: selectedDate === today,
      selectedColor: "#FFA755",
    };

    if (allEvents) {
      allEvents.forEach((event) => {
        const eventDate = new Date(event.startsAt).toISOString().split("T")[0];
        if (!markedDates[eventDate]) {
          markedDates[eventDate] = {};
        }
        markedDates[eventDate].marked = true;
      });
    }

    return markedDates;
  }, [selectedDate, today, allEvents]);

  function goToCreateEvent() {
    navigation.navigate("CreateEvent", { edit: false });
  }

  return (
    <View className="h-full bg-light">
      <TouchableOpacity
        onPress={goToCreateEvent}
        className="mb-4 mr-4 items-end"
      >
        <Icon name="plus" size={24} color={"#FFA755"} />
      </TouchableOpacity>
      <Calendar
        style={{ padding: 10 }}
        monthFormat="MMMM yyyy"
        onDayPress={(day) => {
          console.log("seleccionado: " + day.dateString);
          setSelectedDate(day.dateString);
        }}
        hideArrows={true}
        markingType="custom"
        markedDates={marked}
        enableSwipeMonths={true}
        minDate="2016-01-01"
        maxDate="2030-12-31"
        firstDay={1}
      />
    </View>
  );
};

export default CalendarScreen;
