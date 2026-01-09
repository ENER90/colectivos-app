export const ROUTE_INFO = {
  code: "501",
  name: "Alameda - San Bernardo",
  description: "Ruta desde Alameda (Amunátegui) hasta San Bernardo Centro",
};

export const MAP_CONFIG = {
  center: {
    latitude: -33.5180,
    longitude: -70.6693,
  },
  initialRegion: {
    latitude: -33.5180,
    longitude: -70.6693,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  },
  minZoom: 11,
  maxZoom: 18,
};

export const ROUTE_STOPS = [
  {
    name: "Alameda - Amunátegui",
    description: "Punto de inicio",
    coordinates: {
      latitude: -33.4489,
      longitude: -70.6693,
    },
  },
  {
    name: "Santo Domingo / Catedral",
    description: "Giro hacia Manuel Rodríguez",
    coordinates: {
      latitude: -33.4420,
      longitude: -70.6650,
    },
  },
  {
    name: "Manuel Rodríguez",
    description: "Ruta principal hacia el sur",
    coordinates: {
      latitude: -33.4650,
      longitude: -70.6600,
    },
  },
  {
    name: "La Cisterna",
    description: "Zona intermedia",
    coordinates: {
      latitude: -33.5320,
      longitude: -70.6620,
    },
  },
  {
    name: "San Bernardo Centro",
    description: "Destino final",
    coordinates: {
      latitude: -33.5920,
      longitude: -70.7000,
    },
  },
];
