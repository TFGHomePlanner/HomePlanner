import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../_App";
import { Header } from "../../components/Header";
import { trpc } from "../../trpc";
import { UserContext } from "../../context/userContext";
import { UserContextType } from "../../context/types";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

/**
 * Propiedades necesarias para la pantalla de detalles de evento.
 * @typedef {Object} EventDetailScreenProps
 * @property {NativeStackNavigationProp<AppStackParamList, "EventDetail">} navigation - Propiedad de navegación que permite interactuar con la navegación de la aplicación.
 * @property {RouteProp<AppStackParamList, "EventDetail">} route - Propiedad que contiene los parámetros pasados a la pantalla a través de la navegación.
 */
type EventDetailScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "EventDetail">;
  route: RouteProp<AppStackParamList, "EventDetail">;
};
/**
 * Pantalla que muestra los detalles de un evento.
 * @remarks
 * Permite visualizar los detalles de un evento específico,
 * incluyendo información como el nombre, la ubicación y la fecha de inicio.
 * @param {EventDetailScreenProps} props Propiedades del componente.
 * @returns {JSX.Element} Pantalla de los detalles de un evento.
 */
const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  navigation,
  route,
}) => {
  /**
   * Objeto que representa los detalles del evento.
   */
  const Event = route.params.Event;

  /**
   * Contexto del usuario actual.
   * @type {UserContextType}
   */
  const { User } = useContext(UserContext) as UserContextType;

  /**
   * Indica si el usuario actual tiene permiso para editar el evento.
   * @type {boolean}
   */
  const canEdit = User.id === Event.createdBy.id || User.isAdmin;

  /**
   * Contexto global de trpc para acceder a utilidades y datos relacionados con eventos.
   */
  const utils = trpc.useContext();

  /**
   * Navega a la pantalla de creación/edición de eventos.
   * @function
   */
  function goToEditEvent() {
    navigation.navigate("CreateEvent", { Event: Event, edit: true });
  }

  /**
   * Método para eliminar un evento, invalidar la caché de eventos
   * para refrescar los datos y navegar a la pantalla principal.
   */
  const deleteMutation = trpc.event.delete.useMutation({
    onSuccess() {
      utils.event.getAllEvents.invalidate();
      utils.event.getAllCalendarEvents.invalidate();
      navigation.navigate("Tabs");
    },
  });

  /**
   * Elimina el evento actual.
   */
  function deleteEvent() {
    deleteMutation.mutateAsync({ id: Event.id });
  }

  /**
   * Maneja el proceso de eliminación del evento, mostrando un cuadro de confirmación.
   */
  function handleDelete() {
    Alert.alert("Eliminar evento", "", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEvent(),
      },
    ]);
  }

  // JSX y componentes visuales de la pantalla.
  return (
    <View className="h-full bg-light">
      <Header />
      <View className="flex-1 px-6 pb-10">
        <View className="flex-1 space-y-4">
          {canEdit && (
            <Text onPress={goToEditEvent} className="self-end text-purple">
              Editar
            </Text>
          )}
          <Text className="text-xl font-bold">{Event.name}</Text>
          {Event.location && <Text>{Event.location}</Text>}
          {Event.startsAt instanceof Date && (
            <Text>Empieza el {Event.startsAt.toLocaleDateString()}</Text>
          )}
        </View>
        {canEdit && (
          <TouchableOpacity onPress={handleDelete} className="self-end">
            <Icon name="trash-outline" color={"#7B61FF"} size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EventDetailScreen;
