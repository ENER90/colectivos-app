// Configuración de la Ruta Mapocho-Alameda-San Bernardo

export interface RouteStop {
  name: string;
  coordinates: [number, number]; // [lat, lng] para Leaflet
  type: "terminal" | "major" | "minor";
  description: string;
}

export const ROUTE_STOPS: RouteStop[] = [
  {
    name: "Estación Mapocho",
    coordinates: [-33.4269, -70.6567],
    type: "terminal",
    description: "Terminal norte",
  },
  {
    name: "Plaza Italia",
    coordinates: [-33.4372, -70.6399],
    type: "major",
    description: "Plaza Baquedano",
  },
  {
    name: "República",
    coordinates: [-33.4500, -70.6529],
    type: "major",
    description: "Alameda con República",
  },
  {
    name: "Estación Central",
    coordinates: [-33.4569, -70.6783],
    type: "major",
    description: "Estación de Trenes",
  },
  {
    name: "Lo Ovalle",
    coordinates: [-33.4750, -70.6850],
    type: "major",
    description: "Entrada Autopista",
  },
  {
    name: "Gran Avenida",
    coordinates: [-33.5100, -70.6830],
    type: "major",
    description: "San Miguel",
  },
  {
    name: "El Parrón",
    coordinates: [-33.5400, -70.6900],
    type: "major",
    description: "La Cisterna",
  },
  {
    name: "La Portada",
    coordinates: [-33.5700, -70.6950],
    type: "major",
    description: "San Bernardo",
  },
  {
    name: "Plaza San Bernardo",
    coordinates: [-33.5950, -70.7000],
    type: "terminal",
    description: "Terminal sur",
  },
];

export const ROUTE_CENTER: [number, number] = [-33.51, -70.68];

export const ROUTE_BOUNDS: [[number, number], [number, number]] = [
  [-33.62, -70.75], // suroeste
  [-33.42, -70.62], // noreste
];

export const MAP_CONFIG = {
  defaultZoom: 12,
  minZoom: 11,
  maxZoom: 16,
  center: ROUTE_CENTER,
  bounds: ROUTE_BOUNDS,
};

export const ROUTE_INFO = {
  name: "Mapocho - Alameda - San Bernardo",
  code: "501",
  distance: "20 km",
  duration: "30-45 min",
  via: "Alameda, Autopista Central",
  fare: "$800",
  capacity: 4,
};
