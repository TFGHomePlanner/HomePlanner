import React, { useContext, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { trpc } from "../../../trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../_App";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import { SelectList } from "react-native-dropdown-select-list";
import { Divider } from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";

type CreateEventScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateEvent">;
  route: RouteProp<AppStackParamList, "CreateEvent">;
};

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  navigation,
  route,
}) => {
  const inputStyle = "mb-4 bg-white rounded-lg space-y-3 p-4";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const startsAt = route.params.startsAt;

  const edit = route.params.edit;
  const eventToEdit = route.params.Event;

  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(
    eventToEdit?.name ? eventToEdit?.name !== "" : false
  );
  const [location, setLocation] = useState("");
  const [locationVisible, setLocationVisible] = useState(true);

  const [selectedType, setSelectedType] = useState("Evento");
  const typeOptions = ["Evento", "Recordatorio", "Reserva"];
  function onTypeChange(type: string) {
    setSelectedType(type);
    setLocationVisible(type === "Evento");
    type === "Reserva" &&
      navigation.navigate("CreateReservation", {
        edit: false,
        startsAt: startsAt,
      });
  }

  const [visibleTime, setVisibleTime] = useState(true);
  const [checked, setChecked] = useState(false);
  const onCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
    Platform.OS === "ios"
      ? isChecked
        ? setMode("date")
        : setMode("datetime")
      : setVisibleTime(!isChecked);
  };

  const { data: calendars } = trpc.event.getAllCalendars.useQuery({
    groupId: User.groupId,
  });
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const calendarOptions = calendars?.map((calendar) => ({
    key: calendar.id,
    value: calendar.name,
  }));

  const [initialDate, setInitialDate] = useState(
    new Date(startsAt || Date.now())
  );
  const [finalDate, setFinalDate] = useState(initialDate);
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [mode, setMode] = useState<"date" | "time" | "datetime">(
    checked ? "date" : "datetime"
  );

  const [notes, setNotes] = useState("");

  const createMutation = trpc.event.create.useMutation({
    onSuccess() {
      utils.event.getAllEvents.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const createEvent = () => {
    enabled &&
      createMutation.mutateAsync({
        name,
        isEvent: selectedType === "Evento",
        location: location,
        allDay: checked,
        startsAt: initialDate,
        endsAt: finalDate,
        calendarId: selectedCalendar === "" ? undefined : selectedCalendar,
        notes,
        groupId: User.groupId || "",
        userId: User.id,
      });
  };

  function loadEvent() {
    setName(eventToEdit?.name ?? "");
    setSelectedType(eventToEdit?.isEvent ? "Evento" : "Recordatorio");
    setLocation(eventToEdit?.location ?? "");
    setSelectedCalendar(eventToEdit?.calendar?.id ?? "");
    setInitialDate(
      eventToEdit?.startsAt ? new Date(eventToEdit?.startsAt) : new Date()
    );
    setFinalDate(
      eventToEdit?.endsAt ? new Date(eventToEdit?.endsAt) : new Date()
    );
    setNotes(eventToEdit?.notes ?? "");
    setChecked(eventToEdit?.allDay ?? false);
  }
  {
    edit && useEffect(() => loadEvent(), [edit]);
  }

  const updateMutation = trpc.event.update.useMutation({
    onSuccess() {
      utils.event.getAllEvents.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const updateEvent = () => {
    enabled &&
      updateMutation.mutateAsync({
        id: eventToEdit?.id ?? "",
        name,
        isEvent: eventToEdit?.isEvent || false,
        location,
        allDay: checked,
        startsAt: initialDate,
        endsAt: finalDate,
        calendarId: selectedCalendar,
        notes,
        userId: eventToEdit?.createdBy.id ?? User.id,
        groupId: User.groupId || "",
      });
  };

  return (
    <View className="h-screen bg-light px-6 py-16">
      <View className="mb-4 flex flex-row justify-between">
        <TouchableOpacity onPress={navigation.goBack}>
          <Text className="text-orange">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!enabled}
          className="self-end"
          onPress={edit ? updateEvent : createEvent}
        >
          <Text
            className={`${
              enabled ? "text-orange" : "text-darkGray"
            } font-semibold`}
          >
            {edit ? "OK" : "Añadir"}
          </Text>
        </TouchableOpacity>
      </View>
      {!edit && (
        <View className="z-20 flex-row items-center">
          <Text className="mr-3">Tipo</Text>
          <SelectList
            data={typeOptions}
            setSelected={onTypeChange}
            dropdownStyles={{
              borderColor: "#3A3A3C",
              backgroundColor: "#3A3A3C",
              opacity: 0.85,
              position: "absolute",
              top: 20,
              width: 180,
              borderRadius: 15,
            }}
            defaultOption={{ key: typeOptions[0], value: "Evento" }}
            dropdownTextStyles={{
              color: "#FFFF",
              fontSize: 14,
            }}
            save="key"
            search={false}
            boxStyles={{
              height: 30,
              width: 140,
              borderColor: "#FFFF",
              backgroundColor: "#FFFF",
              alignSelf: "flex-end",
              borderRadius: 50,
              paddingVertical: 6,
              shadowColor: "#212529c",
              shadowOpacity: 0.2,
              shadowOffset: {
                width: 0,
                height: 6,
              },
            }}
          />
        </View>
      )}
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <View className={`mb-6 ${!edit && "mt-4"} ${inputStyle}`}>
          <TextInput
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={(newName) => {
              setName(newName);
              setEnabled(newName.trim() !== "");
            }}
            placeholder="Título *"
            maxLength={40}
            selectionColor={"#FFA755"}
          />
          {locationVisible && (
            <View className="space-y-3">
              <Divider />
              <TextInput
                placeholderTextColor="#95999C"
                value={location}
                onChangeText={setLocation}
                placeholder="Ubicación"
                maxLength={40}
                selectionColor={"#FFA755"}
              />
            </View>
          )}
        </View>
        <View className="mb-4 rounded-lg border-light bg-white text-base text-dark">
          <View className="my-3 flex-row items-center justify-between rounded-lg bg-white px-4">
            <Text>Todo el día</Text>
            <Switch
              className="-mb-1"
              trackColor={{ false: "#929193", true: "#FFA755" }}
              onValueChange={onCheckedChange}
              value={checked}
            />
          </View>
          <Divider />
          <View className="my-2 flex-row items-center justify-between rounded-lg px-4">
            <Text>Empieza</Text>
            {Platform.OS === "android" && (
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  className="rounded-md bg-lightGray p-2"
                >
                  <Text>{initialDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {visibleTime && (
                  <TouchableOpacity
                    onPress={() => setShowTime(true)}
                    className="rounded-md bg-lightGray p-2"
                  >
                    <Text>
                      {initialDate.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={initialDate}
                onChange={(event, selectedDate) => {
                  setInitialDate(selectedDate || new Date());
                }}
                accentColor="#FFA755"
                locale="es-ES"
                mode={mode}
              />
            )}
            {Platform.OS === "android" && show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={initialDate}
                onChange={(event, selectedDate) => {
                  setShow(false);
                  setInitialDate(selectedDate || new Date());
                }}
                mode={"date"}
              />
            )}
            {Platform.OS === "android" && showTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={initialDate}
                onChange={(event, selectedDate) => {
                  setShowTime(false);
                  setInitialDate(selectedDate || new Date());
                }}
                mode={"time"}
              />
            )}
          </View>
          {selectedType === "Evento" && (
            <View>
              <Divider />
              <View className="my-2 flex-row items-center justify-between rounded-lg px-4">
                <Text>Acaba</Text>
                {Platform.OS === "android" && (
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      className="rounded-md bg-lightGray p-2"
                    >
                      <Text>{finalDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {visibleTime && (
                      <TouchableOpacity
                        onPress={() => setShowTime(true)}
                        className="rounded-md bg-lightGray p-2"
                      >
                        <Text>
                          {finalDate.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {Platform.OS === "ios" && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={finalDate}
                    onChange={(event, selectedDate) => {
                      setFinalDate(selectedDate || new Date());
                    }}
                    accentColor="#FFA755"
                    locale="es-ES"
                    mode={mode}
                  />
                )}
                {Platform.OS === "android" && show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={finalDate}
                    onChange={(event, selectedDate) => {
                      setShow(false);
                      setFinalDate(selectedDate || new Date());
                    }}
                    mode={"date"}
                  />
                )}
                {Platform.OS === "android" && showTime && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={finalDate}
                    onChange={(event, selectedDate) => {
                      setShowTime(false);
                      setFinalDate(selectedDate || new Date());
                    }}
                    mode={"time"}
                  />
                )}
              </View>
            </View>
          )}
        </View>
        <View className="z-20 mb-4 flex-row items-center justify-between rounded-lg bg-white pl-4">
          <Text>Calendario</Text>
          {calendarOptions ? (
            <SelectList
              data={calendarOptions}
              setSelected={setSelectedCalendar}
              dropdownStyles={{
                borderColor: "#3A3A3C",
                backgroundColor: "#3A3A3C",
                opacity: 0.85,
                position: "absolute",
                right: 14,
                top: 30,
                width: 180,
                borderRadius: 15,
              }}
              dropdownTextStyles={{
                color: "#FFFF",
                fontSize: 14,
              }}
              save="key"
              search={false}
              boxStyles={{
                height: 42,
                width: 140,
                borderColor: "#FFFF",
                alignSelf: "flex-end",
              }}
              placeholder="Seleccionar"
            />
          ) : (
            <Text>Cargando...</Text>
          )}
        </View>
        <ScrollView className="h-36 rounded-lg bg-white px-4 py-2">
          <TextInput
            selectionColor={"#FFA755"}
            className="text-base text-dark"
            placeholderTextColor="#95999C"
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas"
            multiline={true}
            maxLength={200}
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
