import React, { useContext, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/AntDesign";
import { AppStackParamList } from "../../../_App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import "./localeConfig";

type TabCalendarScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "TabCalendar">;
};

const CalendarScreen: React.FC<TabCalendarScreenProps> = ({ navigation }) => {
  //const { User } = useContext(UserContext) as UserContextType;
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState<any>(today);
  const marked = useMemo(
    () => ({
      [date]: {
        selected: true,
        selectedColor: "#212529",
        selectedTextColor: "white",
      },
      [today]: {
        customStyles: {
          text: {
            fontWeight: "bold",
            color: date === today ? "white" : "#FFA755",
          },
        },
        selected: date === today,
        selectedColor: "#FFA755",
      },
    }),
    [date, today]
  );

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
          setDate(day.dateString);
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
