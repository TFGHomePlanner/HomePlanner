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

type EventDetailScreenProps = {
  navigation: NativeStackNavigationProp<AppStackParamList, "EventDetail">;
  route: RouteProp<AppStackParamList, "EventDetail">;
};
/**
 * Pantalla que muestra los detalles de un evento.
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
   */
  const { User } = useContext(UserContext) as UserContextType;

  /**
   * Indica si el usuario actual tiene permiso para editar el evento.
   */
  const canEdit = User.id === Event.createdBy.id || User.isAdmin;
  const utils = trpc.useContext();

  /**
   * Navega a la pantalla de creación/edición de eventos.
   */
  function goToEditEvent() {
    navigation.navigate("CreateEvent", { Event: Event, edit: true });
  }

  const deleteMutation = trpc.event.delete.useMutation({
    onSuccess() {
      utils.event.getAllEvents.invalidate();
      utils.event.getAllCalendarEvents.invalidate();
      navigation.navigate("Tabs");
    },
  });

  function deleteEvent() {
    deleteMutation.mutateAsync({ id: Event.id });
  }

  function handleDelete() {
    Alert.alert("Eliminar evento", "", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "Eliminar", style: "destructive", onPress: () => deleteEvent() },
    ]);
  }

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
