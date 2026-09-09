# Colectivos App

App de coordinación en tiempo real para taxis colectivos en Chile (web PWA + móvil nativo).

**Frontend:** React 19 · TypeScript · Vite · Expo / React Native · Socket.io  
**Backend:** [colectivos-api](https://github.com/ENER90/colectivos-api)

> Producto de dominio real: pasajeros y conductores, geolocalización y demanda en mapa.

## Project structure

```
colectivos-app/
├── web/      # PWA (React + TypeScript + Vite)
└── mobile/   # React Native (Expo + TypeScript)
```

## Features

- Auth por rol (pasajero / conductor)
- Ubicación en tiempo real
- Mapas con visualización de demanda
- Estado de espera del pasajero
- Disponibilidad del conductor
- Notificaciones vía WebSocket

## Web (PWA)

```bash
cd web
npm install
npm run dev
```

Stack: React 19, TypeScript, Vite, Socket.io Client, React Router, Geolocation API.  
Detalle: [web/README.md](./web/README.md)

## Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Stack: React Native, Expo, TypeScript, Socket.io Client, React Navigation, Expo Location.  
Detalle: [mobile/README.md](./mobile/README.md)

## Backend

Ambas apps usan la misma API:

- Repo: https://github.com/ENER90/colectivos-api
- Docs: ver README del backend

## Author

[René Del Valle Rodríguez](https://github.com/ENER90) · [LinkedIn](https://www.linkedin.com/in/renédelvalle)

## License

MIT
