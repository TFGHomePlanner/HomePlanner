import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/AntDesign";
import { LocaleConfig } from "react-native-calendars";

export default function Calen0darScreen() {
  LocaleConfig.locales["es"] = {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthNamesShort: [
      "Ene.",
      "Feb.",
      "Mar.",
      "Abr.",
      "May.",
      "Jun.",
      "Jul.",
      "Ago.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dic.",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
  };
  LocaleConfig.defaultLocale = "es";

  const [date, setDate] = useState<any>();
  const today = new Date().toISOString().split("T")[0];
  const marked = useMemo(
    () => ({
      [date]: {
        selected: true,
        selectedColor: "#212529",
        selectedTextColor: "white",
      },
      [today]: {
        selected: date === today,
        selectedColor: "#FFA755",
        selectedTextColor: "white",
      },
    }),
    [date, today]
  );

  return (
    <ScrollView
      className="h-full bg-light"
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity className="mb-4 mr-4 items-end">
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
    </ScrollView>
  );
}
