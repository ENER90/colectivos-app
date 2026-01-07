export interface User {
  id: string;
  username: string;
  email: string;
  role: "passenger" | "driver";
  status: "online" | "offline";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Passenger {
  id: string;
  username: string;
  location: Location;
  createdAt: string;
}

export interface Driver {
  id: string;
  username: string;
  location: Location;
  availableSeats: number;
  status: "available" | "busy";
}

export interface DriverStatus {
  location: Location;
  availableSeats: number;
  status: "available" | "busy";
}
