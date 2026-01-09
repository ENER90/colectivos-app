import React, { useEffect, useState } from "react";
import { socketService } from "../services/socket.service";
import "./ConnectionStatus.css";

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socketService.isConnected());

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
    };
  }, []);

  if (isConnected) return null;

  return (
    <div className="connection-status offline">
      <div className="status-indicator"></div>
      <span>Sin conexión - Reconectando...</span>
    </div>
  );
};
