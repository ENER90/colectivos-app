import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "../context/AuthContext";
import socketService from "../services/socket.service";
import api from "../services/api.service";
import type { Passenger, Driver, Location as LocationType } from "../types";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [myLocation, setMyLocation] = useState<LocationType>({
    latitude: -33.4489,
    longitude: -70.6693,
  });
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
    setupSocketListeners();

    return () => {
      socketService.off("passenger:waiting");
      socketService.off("passenger:cancelled");
      socketService.off("driver:location");
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setMyLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on("passenger:waiting", (data: Passenger) => {
      setPassengers((prev) => [...prev.filter((p) => p.id !== data.id), data]);
    });

    socket.on("passenger:cancelled", (data: { passengerId: string }) => {
      setPassengers((prev) => prev.filter((p) => p.id !== data.passengerId));
    });

    socket.on("driver:location", (data: Driver) => {
      setDrivers((prev) => [...prev.filter((d) => d.id !== data.id), data]);
    });
  };

  const handleMarkAsWaiting = async () => {
    try {
      await api.post("/passengers/waiting", { location: myLocation });
      setIsWaiting(true);
      socketService.emit("passenger:waiting", {
        location: myLocation,
        username: user?.username,
      });
      Alert.alert("Éxito", "Marcado como esperando");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Error al marcar como esperando");
    }
  };

  const handleCancelWaiting = async () => {
    try {
      await api.post("/passengers/cancel");
      setIsWaiting(false);
      socketService.emit("passenger:cancel");
      Alert.alert("Éxito", "Espera cancelada");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Error al cancelar");
    }
  };

  const handleUpdateLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setMyLocation(newLocation);

      await api.post("/drivers/status", {
        location: newLocation,
        availableSeats,
        status: "available",
      });

      socketService.emit("driver:location", {
        location: newLocation,
        availableSeats,
        username: user?.username,
      });

      Alert.alert("Éxito", "Ubicación actualizada");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Error al actualizar ubicación");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: () => logout() },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F4C430" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Colectivos</Text>
          <Text style={styles.userBadge}>
            {user?.role === "driver" ? "Conductor" : "Pasajero"} - {user?.username}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={myLocation}
          title="Tu ubicación"
          pinColor="#F4C430"
        />

        {user?.role === "driver" &&
          passengers.map((passenger) => (
            <Marker
              key={passenger.id}
              coordinate={{
                latitude: passenger.location.latitude,
                longitude: passenger.location.longitude,
              }}
              title={`Pasajero: ${passenger.username}`}
              description="Esperando..."
              pinColor="#3498DB"
            />
          ))}

        {user?.role === "passenger" &&
          drivers.map((driver) => (
            <Marker
              key={driver.id}
              coordinate={{
                latitude: driver.location.latitude,
                longitude: driver.location.longitude,
              }}
              title={`Conductor: ${driver.username}`}
              description={`Asientos: ${driver.availableSeats}`}
              pinColor="#2ECC71"
            />
          ))}
      </MapView>

      <View style={styles.controls}>
        {user?.role === "passenger" && (
          <View>
            {!isWaiting ? (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleMarkAsWaiting}
              >
                <Text style={styles.buttonText}>Marcar como esperando</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View style={styles.waitingBadge}>
                  <Text style={styles.waitingText}>⏳ Esperando conductor...</Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.buttonDanger]}
                  onPress={handleCancelWaiting}
                >
                  <Text style={styles.buttonText}>Cancelar espera</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Conductores cercanos: {drivers.length}
              </Text>
            </View>
          </View>
        )}

        {user?.role === "driver" && (
          <View>
            <Text style={styles.label}>Asientos disponibles:</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={String(availableSeats)}
              onChangeText={(text) => setAvailableSeats(Number(text) || 0)}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleUpdateLocation}
            >
              <Text style={styles.buttonText}>Actualizar ubicación</Text>
            </TouchableOpacity>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Pasajeros esperando: {passengers.length}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7F8C8D",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  userBadge: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
  controls: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  label: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonPrimary: {
    backgroundColor: "#F4C430",
  },
  buttonDanger: {
    backgroundColor: "#E74C3C",
  },
  buttonText: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "bold",
  },
  waitingBadge: {
    backgroundColor: "#F4C430",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  waitingText: {
    color: "#2C3E50",
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoText: {
    color: "#2C3E50",
    fontSize: 14,
  },
});
