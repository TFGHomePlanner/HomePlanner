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

/**
 * Propiedades necesarias para la pantalla de creación de una tarea.
 * @typedef {Object} EventDetailScreenProps
 * @property {NativeStackNavigationProp<AppStackParamList, "CreateTask">} navigation - Propiedad de navegación que permite interactuar con la navegación de la aplicación.
 * @property {RouteProp<AppStackParamList, "CreateTask">} route - Propiedad que contiene los parámetros pasados a la pantalla a través de la navegación.
 */
type CreateTaskScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "CreateTask">;
  route: RouteProp<AppStackParamList, "CreateTask">;
};

/**
 * Pantalla que muestra el formulario para crear una tarea.
 * @remarks
 * Permite visualizar rellenar los campos para crear una nueva tarea.
 * @param {CreateTaskScreenProps} props Propiedades del componente.
 * @returns {JSX.Element} Pantalla de la creación de una tarea.
 */
const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({
  navigation,
  route,
}) => {
  // Estilo para los campos de entrada
  const inputStyle =
    "mb-4 bg-white rounded-lg space-y-3 text-base border-light p-4 text-dark";

  /**
   * Contexto del usuario actual.
   * @type {UserContextType}
   */
  const { User } = useContext(UserContext) as UserContextType;
  /**
   * Contexto global de trpc para acceder a utilidades y datos relacionados con eventos.
   */
  const utils = trpc.useContext();

  /**
   * Opciones de frecuencia de una tarea para añadir al campo desplegable.
   */
  const frequencyOptions = [
    { key: Frequency.never, value: "Nunca" },
    { key: Frequency.oncePerDay, value: "Cada día" },
    { key: Frequency.oncePerWeek, value: "Cada semana" },
    { key: Frequency.oncePerMonth, value: "Cada mes" },
  ];
  /**
   * Verifica si se está editando la tarea actual.
   */
  const edit = route.params.edit;
  const taskToEdit = route.params.Task;

  /**
   * Estado local del nombre de la tarea en el campo de entrada.
   */
  const [name, setName] = useState("");
  /**
   * Estado local que guarda si se han completado los campos necesarios
   * para crear/editar la tarea.
   */
  const [enabled, setEnabled] = useState(
    taskToEdit?.name ? taskToEdit?.name !== "" : false
  );
  /**
   * Estado local de la descripción de la tarea en el campo de entrada.
   */
  const [description, setDescription] = useState("");
  /**
   * Estado local de la frecuencia seleccionada en el campo desplegable.
   */
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>(
    Frequency.never
  );

  /**
   * Método que obtiene los usuarios del grupo actual.
   */
  const { data: users } = trpc.group.getUsers.useQuery({ id: User.groupId });
  /**
   * Estado local del usuario encargado de la tarea
   * seleccionado en el campo desplegable.
   */
  const [selectedUser, setSelectedUser] = useState("");
  /**
   * Opciones de los usuarios del grupo para añadir al campo desplegable.
   */
  const userOptions = users?.map((user) => ({
    key: user.id,
    value: user.name,
  }));

  /**
   * Método que obtiene los grupos de tareas del grupo de usuarios actual.
   */
  const { data: groups } = trpc.task.getAllTaskGroups.useQuery({
    groupId: User.groupId,
  });
  /**
   * Estado local del grupo de tareas seleccionado en el campo desplegable.
   */
  const [selectedGroup, setSelectedGroup] = useState("");
  /**
   * Opciones de los grupos de tareas para añadir al campo desplegable.
   */
  const groupOptions = groups?.map((group) => ({
    key: group.id,
    value: group.name,
  }));

  /**
   * Estado local que guarda si la tarea se debe añadir al calendario,
   * según el estado del switch.
   */
  const [checked, setChecked] = React.useState(false);
  /**
   * Método para cambiar el estado del switch.
   */
  const onCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  /**
   * Estado local de la fecha seleccionada en el campo de fecha.
   */
  const [date, setDate] = useState(new Date());
  /**
   * Estado local que guarda si el calendario debe mostrarse u ocultarse.
   */
  const [show, setShow] = useState(false);

  /**
   * Mutación para crear una tarea, invalidar la caché de tareas
   * para refrescar los datos y navegar a la pantalla principal.
   */
  const createMutation = trpc.task.create.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });

  /**
   * Función para crear una nueva tarea con los datos necesarios.
   */
  const createTask = () => {
    enabled &&
      createMutation.mutateAsync({
        name,
        description,
        frequency: selectedFrequency,
        startsAt: date,
        groupId: User.groupId || "",
        userId: selectedUser === "" ? undefined : selectedUser,
        taskGroupId: selectedGroup === "" ? undefined : selectedGroup,
        createdBy: User.id,
      });
  };

  /**
   * Función para cargar los datos de la tarea que se está editando actualmente.
   */
  function loadTask() {
    setName(taskToEdit?.name ?? "");
    setDescription(taskToEdit?.description ?? "");
    setSelectedFrequency(taskToEdit?.frequency ?? "never");
    setSelectedGroup(taskToEdit?.taskGroupId ?? "");
    setSelectedUser(taskToEdit?.assignedTo?.id ?? "");
    setDate(taskToEdit?.startsAt ? new Date(taskToEdit?.startsAt) : new Date());
  }
  /**
   * Cargar los datos de la tarea si se encuentra en modo edición.
   */
  {
    edit && useEffect(() => loadTask(), [edit]);
  }

  /**
   * Mutación para editar una tarea, invalidar la caché de tareas
   * para refrescar los datos y navegar a la pantalla principal.
   */
  const updateMutation = trpc.task.update.useMutation({
    onSuccess() {
      utils.task.getAllTasks.invalidate();
      navigation.navigate("Tabs");
    },
  });
  /**
   * Función para editar la tarea recibida con los datos necesarios.
   */
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

  // JSX y componentes visuales de la pantalla.
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
            selectionColor={"#7B61FF"}
            value={name}
            onChangeText={(newName) => {
              setName(newName);
              setEnabled(newName.trim() !== "");
            }}
            placeholder="Título *"
            maxLength={30}
          />
          <Divider />
          <TextInput
            placeholderTextColor="#95999C"
            selectionColor={"#7B61FF"}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            multiline={true}
            maxLength={200}
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
