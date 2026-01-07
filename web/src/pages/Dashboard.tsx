import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import { useAuth } from "../context/AuthContext";
import { socketService } from "../services/socket.service";
import type { Driver, Passenger, Location } from "../types";
import { ROUTE_STOPS, MAP_CONFIG, ROUTE_INFO } from "../config/route.config";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

const passengerIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const myLocationIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const stopIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [0, -28],
  shadowSize: [33, 33],
});

const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [error, setError] = useState("");
  const [availableSeats, setAvailableSeats] = useState(4);

  const defaultCenter: [number, number] = MAP_CONFIG.center;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getLocation();
    setupSocketListeners();
    loadInitialData();

    return () => {
      cleanupSocketListeners();
    };
  }, [user, navigate]);

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (user?.role === "driver") {
        // Cargar pasajeros esperando
        const response = await fetch("http://localhost:3005/api/passengers/waiting", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.passengers) {
          setPassengers(data.passengers);
        }
      } else if (user?.role === "passenger") {
        // Cargar conductores activos
        const response = await fetch("http://localhost:3005/api/drivers/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.drivers) {
          setDrivers(data.drivers);
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("No se pudo obtener tu ubicación");
          setMyLocation({
            latitude: defaultCenter[0],
            longitude: defaultCenter[1],
          });
        }
      );
    } else {
      setError("Geolocalización no disponible");
      setMyLocation({
        latitude: defaultCenter[0],
        longitude: defaultCenter[1],
      });
    }
  };

  const setupSocketListeners = () => {
    if (user?.role === "driver") {
      socketService.on("passenger:new-waiting", handleNewPassenger);
      socketService.on("passenger:cancelled", handlePassengerCancelled);
    } else if (user?.role === "passenger") {
      socketService.on("driver:location-updated", handleDriverUpdate);
    }

    socketService.on("passenger:waiting-success", () => {
      setIsWaiting(true);
    });

    socketService.on("passenger:cancel-success", () => {
      setIsWaiting(false);
    });

    socketService.on("driver:location-update-success", () => {
      console.log("Location updated");
    });
  };

  const cleanupSocketListeners = () => {
    socketService.off("passenger:new-waiting");
    socketService.off("passenger:cancelled");
    socketService.off("driver:location-updated");
    socketService.off("passenger:waiting-success");
    socketService.off("passenger:cancel-success");
    socketService.off("driver:location-update-success");
  };

  const handleNewPassenger = (data: Passenger) => {
    setPassengers((prev) => {
      const exists = prev.find((p) => p.id === data.id);
      if (exists) return prev;
      return [...prev, data];
    });
  };

  const handlePassengerCancelled = (data: { passengerId: string }) => {
    setPassengers((prev) => prev.filter((p) => p.id !== data.passengerId));
  };

  const handleDriverUpdate = (data: Driver) => {
    setDrivers((prev) => {
      const index = prev.findIndex((d) => d.id === data.id);
      if (index >= 0) {
        const newDrivers = [...prev];
        newDrivers[index] = data;
        return newDrivers;
      }
      return [...prev, data];
    });
  };

  const handleMarkAsWaiting = () => {
    if (!myLocation) {
      setError("Ubicación no disponible");
      return;
    }

    socketService.emit("passenger:waiting", {
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
    });
  };

  const handleCancelWaiting = () => {
    socketService.emit("passenger:cancel");
  };

  const handleUpdateLocation = () => {
    if (!myLocation) {
      setError("Ubicación no disponible");
      return;
    }

    socketService.emit("driver:location-update", {
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
      availableSeats,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!myLocation) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Obteniendo ubicación...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Colectivos</h1>
          <span className="route-badge">Ruta {ROUTE_INFO.code}: {ROUTE_INFO.name}</span>
          <span className="user-badge">
            {user?.role === "driver" ? "Conductor" : "Pasajero"} - {user?.username}
          </span>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-content">
        <div className="map-container">
          <MapContainer
            center={MAP_CONFIG.center}
            zoom={MAP_CONFIG.defaultZoom}
            minZoom={MAP_CONFIG.minZoom}
            maxZoom={MAP_CONFIG.maxZoom}
            maxBounds={MAP_CONFIG.bounds}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap center={[myLocation.latitude, myLocation.longitude]} />

            {/* Paraderos de la ruta */}
            {ROUTE_STOPS.map((stop, index) => (
              <Marker key={`stop-${index}`} position={stop.coordinates} icon={stopIcon}>
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <strong style={{ color: "#F4C430" }}>{stop.name}</strong>
                    <br />
                    <span style={{ fontSize: "0.85em", color: "#7F8C8D" }}>
                      {stop.description}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Mi ubicación */}
            <Marker position={[myLocation.latitude, myLocation.longitude]} icon={myLocationIcon}>
              <Popup>
                <strong>Tu ubicación</strong>
              </Popup>
            </Marker>

            {/* Pasajeros esperando (solo visible para conductores) */}
            {user?.role === "driver" &&
              passengers.map((passenger) => (
                <Marker
                  key={passenger.id}
                  position={[passenger.location.latitude, passenger.location.longitude]}
                  icon={passengerIcon}
                >
                  <Popup>
                    <strong>Pasajero: {passenger.username}</strong>
                    <br />
                    Esperando...
                  </Popup>
                </Marker>
              ))}

            {/* Conductores activos (solo visible para pasajeros) */}
            {user?.role === "passenger" &&
              drivers.map((driver) => (
                <Marker
                  key={driver.id}
                  position={[driver.location.latitude, driver.location.longitude]}
                  icon={driverIcon}
                >
                  <Popup>
                    <strong>Conductor: {driver.username}</strong>
                    <br />
                    Asientos disponibles: {driver.availableSeats}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <div className="controls-panel">
          {user?.role === "passenger" && (
            <div className="passenger-controls">
              <h3>Control de Pasajero</h3>
              {!isWaiting ? (
                <button onClick={handleMarkAsWaiting} className="btn-action btn-waiting">
                  📍 Marcar como esperando
                </button>
              ) : (
                <div>
                  <div className="status-waiting">
                    <span className="pulse"></span>
                    Esperando conductor...
                  </div>
                  <button onClick={handleCancelWaiting} className="btn-action btn-cancel">
                    ❌ Cancelar espera
                  </button>
                </div>
              )}
              <div className="info-box">
                <p>
                  <strong>Conductores cercanos:</strong> {drivers.length}
                </p>
              </div>
            </div>
          )}

          {user?.role === "driver" && (
            <div className="driver-controls">
              <h3>Control de Conductor</h3>
              <div className="form-group">
                <label>Asientos disponibles</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(Number(e.target.value))}
                />
              </div>
              <button onClick={handleUpdateLocation} className="btn-action btn-update">
                📍 Actualizar ubicación
              </button>
              <div className="info-box">
                <p>
                  <strong>Pasajeros esperando:</strong> {passengers.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
