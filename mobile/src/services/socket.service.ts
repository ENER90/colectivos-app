import { io, Socket } from "socket.io-client";

// Cambia esta URL a tu IP local o servidor
const SOCKET_URL = "http://192.168.1.97:3005";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket conectado:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket desconectado");
    });

    this.socket.on("error", (error: any) => {
      console.error("❌ Socket error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
