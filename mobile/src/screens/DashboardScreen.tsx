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
import { useToast } from "../context/ToastContext";
import { ConnectionStatus } from "../components/ConnectionStatus";
import { ConfirmDialog } from "../components/ConfirmDialog";
import socketService from "../services/socket.service";
import api from "../services/api.service";
import type { Passenger, Driver, Location as LocationType } from "../types";
import { ROUTE_INFO, MAP_CONFIG, ROUTE_STOPS } from "../config/route.config";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { success, error: showError, info } = useToast();
  const [myLocation, setMyLocation] = useState<LocationType>(MAP_CONFIG.center);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
        showError("Necesitamos acceso a tu ubicación");
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setMyLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      success("Ubicación obtenida correctamente");
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      showError("No se pudo obtener tu ubicación");
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on("passenger:waiting", (data: Passenger) => {
      setPassengers((prev) => {
        const exists = prev.find((p) => p.id === data.id);
        if (!exists && user?.role === "driver") {
          info(`Nuevo pasajero esperando: ${data.username}`);
        }
        return [...prev.filter((p) => p.id !== data.id), data];
      });
    });

    socket.on("passenger:cancelled", (data: { passengerId: string }) => {
      setPassengers((prev) => prev.filter((p) => p.id !== data.passengerId));
    });

    socket.on("driver:location", (data: Driver) => {
      setDrivers((prev) => {
        const exists = prev.find((d) => d.id === data.id);
        if (!exists && user?.role === "passenger") {
          info(`Conductor disponible: ${data.username} (${data.availableSeats} asientos)`);
        }
        return [...prev.filter((d) => d.id !== data.id), data];
      });
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
      success("Ahora estás esperando un colectivo");
    } catch (error: any) {
      showError(error.response?.data?.message || "Error al marcar como esperando");
    }
  };

  const handleCancelWaiting = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelWaiting = async () => {
    try {
      await api.post("/passengers/cancel");
      setIsWaiting(false);
      setShowCancelConfirm(false);
      socketService.emit("passenger:cancel");
      info("Has cancelado la espera");
    } catch (error: any) {
      showError(error.response?.data?.message || "Error al cancelar");
      setShowCancelConfirm(false);
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

      success("Ubicación actualizada correctamente");
    } catch (error: any) {
      showError(error.response?.data?.message || "Error al actualizar ubicación");
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
      <ConnectionStatus />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Colectivos</Text>
          <Text style={styles.routeBadge}>
            Ruta {ROUTE_INFO.code}: {ROUTE_INFO.name}
          </Text>
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
        initialRegion={MAP_CONFIG.initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {ROUTE_STOPS.map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            coordinate={stop.coordinates}
            title={stop.name}
            description={stop.description}
            pinColor="#F4C430"
          />
        ))}
        <Marker
          coordinate={myLocation}
          title="Tu ubicación"
          pinColor="#E74C3C"
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

      <ConfirmDialog
        visible={showCancelConfirm}
        title="Cancelar espera"
        message="¿Estás seguro de que deseas cancelar tu espera? Los conductores ya no podrán verte en el mapa."
        confirmText="Sí, cancelar"
        cancelText="No, seguir esperando"
        onConfirm={confirmCancelWaiting}
        onCancel={() => setShowCancelConfirm(false)}
      />
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
  routeBadge: {
    fontSize: 11,
    color: "#F4C430",
    fontWeight: "600",
    marginTop: 2,
  },
  userBadge: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#2C3E50",
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
    backgroundColor: "#7F8C8D",
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
    fontSize: 14,
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
