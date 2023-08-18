import React, { useContext, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
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
import { Frequency } from "@prisma/client";
import { UserContext } from "../../../context/userContext";
import { UserContextType } from "../../../context/types";
import { SelectList } from "react-native-dropdown-select-list";
import { Divider } from "@ui-kitten/components";
import CreateTaskGroupScreen from "../../../components/tasks/CreateTaskGroup";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { RouteProp } from "@react-navigation/native";

type CreateEventScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateEvent">;
  //route: RouteProp<AppStackParamList, "CreateEvent">;
};

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  navigation,
}) => {
  const inputStyle =
    "mb-4 bg-white rounded-lg space-y-3 text-base p-4 text-dark";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const frequencyOptions = [
    { key: Frequency.never, value: "Nunca" },
    { key: Frequency.oncePerDay, value: "Cada día" },
    { key: Frequency.oncePerWeek, value: "Cada semana" },
    { key: Frequency.oncePerMonth, value: "Cada mes" },
  ];
  //const edit = route.params.edit;
  const edit = false; // CAMBIAR
  //const eventToEdit = route.params.Event;

  const [name, setName] = useState("");
  /*const [enabled, setEnabled] = useState(
    eventToEdit?.name ? eventToEdit?.name !== "" : false
  );*/
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>(
    Frequency.never
  );

  const { data: users } = trpc.group.getUsers.useQuery({ id: User.groupId });
  const [selectedUser, setSelectedUser] = useState("");
  const userOptions = users?.map((user) => ({
    key: user.id,
    value: user.name,
  }));

  const { data: groups } = trpc.task.getAllTaskGroups.useQuery({
    groupId: User.groupId,
  });
  const [selectedGroup, setSelectedGroup] = useState("");
  const groupOptions = groups?.map((group) => ({
    key: group.id,
    value: group.name,
  }));

  const [checked, setChecked] = React.useState(false);
  const onCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  const [initialDate, setInitialDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [notes, setNotes] = useState("");

  // CAMBIAR
  const createMutation = trpc.task.create.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const createEvent = () => {
    enabled &&
      createMutation.mutateAsync({
        name,
        description: location,
        frequency: selectedFrequency,
        startsAt: initialDate,
        groupId: User.groupId || "",
        userId: selectedUser == "" ? undefined : selectedUser,
        taskGroupId: selectedGroup == "" ? undefined : selectedGroup,
        createdBy: User.id,
      });
  };

  /*function loadEvent() {
    setName(taskToEdit?.name ?? "");
    setDescription(taskToEdit?.description ?? "");
    setSelectedFrequency(taskToEdit?.frequency ?? "never");
    setSelectedGroup(taskToEdit?.taskGroupId ?? "");
    setSelectedUser(taskToEdit?.assignedTo?.id ?? "");
    setDate(taskToEdit?.startsAt ? new Date(taskToEdit?.startsAt) : new Date());
  }
  {
    edit && useEffect(() => loadTask(), [edit]);
  }

  const updateMutation = trpc.task.update.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const updateTask = () => {
    enabled &&
      updateMutation.mutateAsync({
        id: eventToEdit?.id ?? "",
        name,
        description,
        frequency: selectedFrequency,
        startsAt: date,
        groupId: User.groupId || "",
        userId: selectedUser,
        taskGroupId: selectedGroup,
        createdBy: eventToEdit?.createdBy ?? User.id,
      });
  };*/

  return (
    <View className="h-screen bg-light px-6 py-16">
      <View className="flex flex-row justify-between">
        <Pressable onPress={navigation.goBack}>
          <Text className="text-orange">Cancelar</Text>
        </Pressable>
        <TouchableOpacity
          disabled={!enabled}
          className="self-end"
          onPress={createEvent} //{edit ? updateEvent : createEvent}
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
        <View className={`my-6 ${inputStyle}`}>
          <TextInput
            placeholderTextColor="#95999C"
            value={name}
            onChangeText={(newName) => {
              setName(newName);
              setEnabled(newName.trim() !== "");
            }}
            placeholder="Título *"
            maxLength={40}
            cursorColor={"#FFA755"}
          />
          <Divider />
          <TextInput
            placeholderTextColor="#95999C"
            value={location}
            onChangeText={setLocation}
            placeholder="Ubicación"
            maxLength={40}
            cursorColor={"#FFA755"}
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
          <View className="my-2 flex-row items-center justify-between rounded-lg bg-white px-4">
            <Text>Empieza</Text>
            {Platform.OS === "android" && (
              <Pressable
                onPress={() => setShow(true)}
                className="rounded-md bg-lightGray p-2"
              >
                <Text>{initialDate.toLocaleDateString()}</Text>
              </Pressable>
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
                positiveButton={{ label: "OK", textColor: "#FFA755" }}
              />
            )}
            {Platform.OS === "android" && show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={initialDate}
                positiveButton={{ label: "OK", textColor: "#FFA755" }}
                negativeButton={{ label: "Cancelar", textColor: "#FFA755" }}
                onChange={(event, selectedDate) => {
                  setShow(false);
                  setInitialDate(selectedDate || new Date());
                }}
              />
            )}
          </View>
          <Divider />
          <View className="my-2 flex-row items-center justify-between rounded-lg bg-white px-4">
            <Text>Acaba</Text>
            {Platform.OS === "android" && (
              <Pressable
                onPress={() => setShow(true)}
                className="rounded-md bg-lightGray p-2"
              >
                <Text>{finalDate.toLocaleDateString()}</Text>
              </Pressable>
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
                positiveButton={{ label: "OK", textColor: "#FFA755" }}
              />
            )}
            {Platform.OS === "android" && show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={finalDate}
                positiveButton={{ label: "OK", textColor: "#FFA755" }}
                negativeButton={{ label: "Cancelar", textColor: "#FFA755" }}
                onChange={(event, selectedDate) => {
                  setShow(false);
                  setFinalDate(selectedDate || new Date());
                }}
              />
            )}
          </View>
        </View>
        <View className="z-20 mb-4 flex-row items-center justify-between rounded-lg bg-white pl-4">
          <Text>Grupo de tareas</Text>
          {groupOptions ? (
            <SelectList
              data={groupOptions}
              setSelected={setSelectedGroup}
              dropdownStyles={{
                borderColor: "#3A3A3C",
                backgroundColor: "#3A3A3C",
                opacity: 0.85,
                position: "absolute",
                right: 14,
                top: 24,
                width: 180,
                borderRadius: 12,
              }}
              dropdownTextStyles={{ color: "#FFFF", fontWeight: "500" }}
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
        <ScrollView className="h-36 rounded-lg bg-white">
          <TextInput
            cursorColor={"#FFA755"}
            className="p-4 text-base text-dark"
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
