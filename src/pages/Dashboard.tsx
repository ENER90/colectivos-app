import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Dashboard - Colectivos App</h1>
        <button onClick={logout} style={{ padding: "10px 20px" }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Información del Usuario</h2>
        <p>
          <strong>Usuario:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Rol:</strong> {user?.role}
        </p>
      </div>

      <div>
        <h2>Mapa en Tiempo Real</h2>
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <p>Mapa será integrado aquí (Mapbox/Leaflet)</p>
        </div>
      </div>

      {user?.role === "passenger" && (
        <div style={{ marginTop: "20px" }}>
          <button style={{ padding: "15px 30px", fontSize: "16px" }}>
            Marcar como esperando
          </button>
        </div>
      )}

      {user?.role === "driver" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Estado del Conductor</h3>
          <p>Asientos disponibles: 4</p>
          <button style={{ padding: "15px 30px", fontSize: "16px", marginRight: "10px" }}>
            Actualizar ubicación
          </button>
          <button style={{ padding: "15px 30px", fontSize: "16px" }}>
            Ver pasajeros cercanos
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
