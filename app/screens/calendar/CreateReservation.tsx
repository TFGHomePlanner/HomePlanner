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
import { trpc } from "../../trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Divider } from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";

type CreateReservationScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateReservation">;
  route: RouteProp<AppStackParamList, "CreateReservation">;
};

const CreateReservationScreen: React.FC<CreateReservationScreenProps> = ({
  navigation,
  route,
}) => {
  const inputStyle = "mb-4 bg-white rounded-lg space-y-3 p-4";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const edit = route.params.edit;
  const reservationToEdit = route.params.Reservation;

  const isEnabled =
    (reservationToEdit?.room ? reservationToEdit?.room !== "" : false) &&
    (reservationToEdit?.description
      ? reservationToEdit?.description !== ""
      : false);
  const [room, setRoom] = useState("");
  const [enabled, setEnabled] = useState(isEnabled);
  const [description, setDescription] = useState("");

  const [checked, setChecked] = React.useState(false);
  const onCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
    isChecked ? setMode("date") : setMode("datetime");
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time" | "datetime">(
    checked ? "date" : "datetime"
  );

  const [notes, setNotes] = useState("");

  const createMutation = trpc.event.createReservation.useMutation({
    onSuccess() {
      utils.event.getAllReservations.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const createReservation = () => {
    enabled &&
      createMutation.mutateAsync({
        room,
        description,
        allDay: checked,
        date,
        notes,
        groupId: User.groupId || "",
        userId: User.id,
      });
  };

  // COMPLETAR
  function loadReservation() {
    setRoom(reservationToEdit?.room ?? "");
    setDescription(reservationToEdit?.description ?? "");
    setChecked(reservationToEdit?.allDay ?? false);
    setDate(
      reservationToEdit?.date ? new Date(reservationToEdit?.date) : new Date()
    );
  }
  {
    edit && useEffect(() => loadReservation(), [edit]);
  }

  const updateMutation = trpc.event.updateReservation.useMutation({
    onSuccess() {
      utils.event.getAllEvents.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const updateReservation = () => {
    enabled &&
      updateMutation.mutateAsync({
        id: reservationToEdit?.id ?? "",
        room,
        description,
        allDay: checked,
        date,
        notes,
        userId: reservationToEdit?.createdBy.id ?? User.id,
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
          onPress={edit ? updateReservation : createReservation}
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <View className={`mb-6 ${!edit && "mt-4"} ${inputStyle}`}>
          <TextInput
            placeholderTextColor="#95999C"
            value={room}
            onChangeText={(newName) => {
              setRoom(newName);
              setEnabled(newName.trim() !== "");
            }}
            placeholder="Título *"
            maxLength={40}
            selectionColor={"#FFA755"}
          />
          <Divider />
          <TextInput
            placeholderTextColor="#95999C"
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            maxLength={40}
            selectionColor={"#FFA755"}
          />
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
              <TouchableOpacity
                onPress={() => setShow(true)}
                className="rounded-md bg-lightGray p-2"
              >
                <Text>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
            )}
            {Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                onChange={(event, selectedDate) => {
                  setDate(selectedDate || new Date());
                }}
                accentColor="#FFA755"
                locale="es-ES"
                mode={mode}
              />
            )}
            {Platform.OS === "android" && show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                onChange={(event, selectedDate) => {
                  setShow(false);
                  setDate(selectedDate || new Date());
                }}
                mode={mode}
              />
            )}
          </View>
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

export default CreateReservationScreen;
