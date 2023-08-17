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
import { RouteProp } from "@react-navigation/native";

type CreateTaskScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateTask">;
  route: RouteProp<AppStackParamList, "CreateTask">;
};

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({
  navigation,
  route,
}) => {
  const inputStyle =
    "mb-4 bg-white rounded-lg space-y-3 text-base border-light p-4 text-dark";

  const { User } = useContext(UserContext) as UserContextType;
  const utils = trpc.useContext();

  const frequencyOptions = [
    { key: Frequency.never, value: "Nunca" },
    { key: Frequency.oncePerDay, value: "Cada día" },
    { key: Frequency.oncePerWeek, value: "Cada semana" },
    { key: Frequency.oncePerMonth, value: "Cada mes" },
  ];
  const edit = route.params.edit;
  const taskToEdit = route.params.Task;

  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(
    taskToEdit?.name ? taskToEdit?.name !== "" : false
  );
  const [description, setDescription] = useState("");
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

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const createMutation = trpc.task.create.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });
  const createTask = () => {
    enabled &&
      createMutation.mutateAsync({
        name,
        description,
        frequency: selectedFrequency,
        startsAt: date,
        groupId: User.groupId || "",
        userId: selectedUser == "" ? undefined : selectedUser,
        taskGroupId: selectedGroup == "" ? undefined : selectedGroup,
        createdBy: User.id,
      });
  };

  function loadTask() {
    setName(taskToEdit?.name ?? "");
    setDescription(taskToEdit?.description ?? "");
    setSelectedFrequency(taskToEdit?.frequency ?? "never");
    setSelectedGroup(taskToEdit?.taskGroupId ?? "");
    setSelectedUser(taskToEdit?.assignedTo?.id ?? "");
    setDate(taskToEdit?.startsAt ? new Date(taskToEdit?.startsAt) : new Date());
    // Falta el check de añadir al calendario
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
        id: taskToEdit?.id ?? "",
        name,
        description,
        frequency: selectedFrequency,
        startsAt: date,
        groupId: User.groupId || "",
        userId: selectedUser,
        taskGroupId: selectedGroup,
        createdBy: taskToEdit?.createdBy ?? User.id,
      });
  };

  return (
    <View className="h-screen bg-light px-6 py-16">
      <View className="flex flex-row justify-between">
        <Pressable onPress={navigation.goBack}>
          <Text className="text-purple">Cancelar</Text>
        </Pressable>
        <Text className="mr-4 self-center">Nueva tarea</Text>
        <TouchableOpacity
          disabled={!enabled}
          className="self-end"
          onPress={edit ? updateTask : createTask}
        >
          <Text
            className={`${
              enabled ? "text-purple" : "text-darkGray"
            } font-semibold`}
          >
            {edit ? "       OK" : "Añadir"}
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
          />
          <Divider />
          <TextInput
            placeholderTextColor="#95999C"
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            multiline={true}
          />
        </View>
        <CreateTaskGroupScreen />
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
        <View className="z-10 mb-4 flex-row items-center justify-between rounded-lg bg-white pl-4">
          <Text>Repetir tarea</Text>
          <SelectList
            data={frequencyOptions}
            setSelected={setSelectedFrequency}
            save="key"
            defaultOption={{ value: "Nunca", key: Frequency.never }}
            search={false}
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
            boxStyles={{
              height: 42,
              width: 140,
              borderColor: "#FFFF",
              alignSelf: "flex-end",
            }}
          />
        </View>
        <View className="mb-4 rounded-lg border-light bg-white text-base text-dark">
          <View className="my-2 flex-row items-center justify-between rounded-lg bg-white px-4">
            <Text>Empieza</Text>
            {Platform.OS === "android" && (
              <Pressable
                onPress={() => setShow(true)}
                className="rounded-md bg-lightGray p-2"
              >
                <Text>{date.toLocaleDateString()}</Text>
              </Pressable>
            )}
            {Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                onChange={(event, selectedDate) => {
                  setDate(selectedDate || new Date());
                }}
                accentColor="#7B61FF"
                locale="es-ES"
                positiveButton={{ label: "OK", textColor: "#7B61FF" }}
              />
            )}
            {Platform.OS === "android" && show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                positiveButton={{ label: "OK", textColor: "#7B61FF" }}
                negativeButton={{ label: "Cancelar", textColor: "#7B61FF" }}
                onChange={(event, selectedDate) => {
                  setShow(false);
                  setDate(selectedDate || new Date());
                }}
              />
            )}
          </View>
          <Divider />
          <View className="z-10 flex-row items-center justify-between rounded-lg bg-white pl-4">
            <Text>Asignar encargado</Text>
            {userOptions ? (
              <SelectList
                data={userOptions}
                setSelected={setSelectedUser}
                save="key"
                search={false}
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
          <Divider />
          <View className="my-3 flex-row items-center justify-between rounded-lg bg-white px-4">
            <Text>Añadir al calendario</Text>
            <Switch
              className="-mb-1"
              trackColor={{ false: "#929193", true: "#7B61FF" }}
              onValueChange={onCheckedChange}
              value={checked}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateTaskScreen;
