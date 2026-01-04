export interface User {
  id: string;
  username: string;
  email: string;
  role: "passenger" | "driver" | "admin";
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
  timestamp: string;
}

export interface Driver {
  id: string;
  username: string;
  location: Location;
  availableSeats: number;
  timestamp: string;
}

export interface DriverStatus {
  latitude: number;
  longitude: number;
  availableSeats: number;
}
