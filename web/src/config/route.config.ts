// Configuración de la Ruta REAL: Alameda → San Bernardo (Colectivo 501)
// Recorrido: Alameda (Amunátegui) → Santo Domingo/Catedral → Manuel Rodríguez
// → Ruta 5 Sur (llenos) o Gran Avenida (buscando pasajeros) → San Bernardo

export interface RouteStop {
  name: string;
  coordinates: [number, number]; // [lat, lng] para Leaflet
  type: "terminal" | "major" | "minor";
  description: string;
  routeType?: "autopista" | "calzada" | "both";
}

export const ROUTE_STOPS: RouteStop[] = [
  {
    name: "Alameda con Amunátegui",
    coordinates: [-33.4450, -70.6640],
    type: "terminal",
    description: "Punto de partida",
    routeType: "both",
  },
  {
    name: "Santo Domingo / Catedral",
    coordinates: [-33.4400, -70.6620],
    type: "major",
    description: "Cruce hacia Manuel Rodríguez",
    routeType: "both",
  },
  {
    name: "Manuel Rodríguez",
    coordinates: [-33.4480, -70.6610],
    type: "major",
    description: "Vía principal sur",
    routeType: "both",
  },
  {
    name: "Entrada Ruta 5 Sur",
    coordinates: [-33.4850, -70.6650],
    type: "major",
    description: "Autopista (si van llenos)",
    routeType: "autopista",
  },
  {
    name: "Gran Avenida",
    coordinates: [-33.5300, -70.6620],
    type: "major",
    description: "Ruta lenta (buscando pasajeros)",
    routeType: "calzada",
  },
  {
    name: "Portales de la Reina",
    coordinates: [-33.5800, -70.6800],
    type: "major",
    description: "Entrada San Bernardo",
    routeType: "both",
  },
  {
    name: "Centro San Bernardo",
    coordinates: [-33.5950, -70.7000],
    type: "terminal",
    description: "Destino final",
    routeType: "both",
  },
];

export const ROUTE_CENTER: [number, number] = [-33.52, -70.67];

export const ROUTE_BOUNDS: [[number, number], [number, number]] = [
  [-33.61, -70.71], // suroeste
  [-33.43, -70.65], // noreste
];

export const MAP_CONFIG = {
  defaultZoom: 12,
  minZoom: 11,
  maxZoom: 16,
  center: ROUTE_CENTER,
  bounds: ROUTE_BOUNDS,
};

export const ROUTE_INFO = {
  name: "Alameda - San Bernardo",
  code: "501",
  distance: "18 km",
  durationFast: "25-30 min (Ruta 5)",
  durationSlow: "40-50 min (Gran Avenida)",
  via: "Manuel Rodríguez → Ruta 5 o Gran Avenida",
  fare: "$800",
  capacity: 4,
  description: "Sale de Alameda, dobla en Santo Domingo/Catedral, toma Manuel Rodríguez. Si va lleno → Ruta 5 (rápido). Si busca pasajeros → Gran Avenida (lento).",
};
