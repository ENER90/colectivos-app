# Colectivos - Aplicación Móvil

Aplicación móvil React Native/Expo para conectar pasajeros y conductores de taxis colectivos en tiempo real.

## 🚀 Características

- **Autenticación completa** (Login y Registro)
- **Geolocalización en tiempo real** con React Native Maps
- **Comunicación en tiempo real** con Socket.io
- **Vista de pasajeros** para marcar espera y ver conductores cercanos
- **Vista de conductores** para actualizar ubicación y ver pasajeros esperando
- **Diseño uniforme** con paleta amarillo taxi

## 📱 Instalación

### Prerrequisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app en tu dispositivo móvil (iOS/Android)

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar el backend:**
   - Edita `src/services/api.service.ts` y `src/services/socket.service.ts`
   - Cambia `localhost` por la IP de tu computadora (ejemplo: `192.168.1.10`)
   ```typescript
   const API_URL = "http://192.168.1.10:3005/api";
   const SOCKET_URL = "http://192.168.1.10:3005";
   ```

3. **Iniciar el servidor de desarrollo:**
```bash
npm start
```

4. **Ejecutar en tu dispositivo:**
   - Escanea el QR code con Expo Go (Android)
   - Escanea con la cámara (iOS, luego abre en Expo Go)

## 🛠️ Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo Expo
- `npm run android` - Ejecuta en emulador Android
- `npm run ios` - Ejecuta en simulador iOS
- `npm run web` - Ejecuta en navegador web

## 📂 Estructura del proyecto

```
mobile/
├── src/
│   ├── screens/         # Pantallas de la app
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── services/        # Servicios (API, Socket)
│   │   ├── api.service.ts
│   │   └── socket.service.ts
│   ├── context/         # Context API (Auth)
│   │   └── AuthContext.tsx
│   └── types/           # TypeScript interfaces
│       └── index.ts
├── App.tsx              # Entrada principal
├── app.json             # Configuración Expo
└── package.json
```

## 🗺️ Configuración de mapas

### Android

1. Obtén una API Key de Google Maps en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita las APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
3. Edita `app.json` y reemplaza `YOUR_GOOGLE_MAPS_API_KEY`

### iOS

Los mapas de iOS funcionan sin API Key adicional.

## 🔐 Permisos

La app solicita los siguientes permisos:

- **Ubicación**: Para mostrar tu ubicación y encontrar conductores/pasajeros cercanos

## 🎨 Diseño

La app usa una paleta de colores uniforme:

- **Primario**: `#F4C430` (Amarillo taxi)
- **Texto**: `#2C3E50` (Gris oscuro)
- **Secundario**: `#7F8C8D` (Gris medio)
- **Fondo**: `#F5F5F5` (Gris claro)

## 📝 Notas

- Para desarrollo, usa tu IP local en lugar de `localhost`
- Asegúrate de que el backend esté corriendo en `http://<tu-ip>:3005`
- En producción, actualiza las URLs a tu servidor en la nube

## 🚧 Próximas funcionalidades

- Notificaciones push
- Chat en tiempo real
- Historial de viajes
- Sistema de calificación
- Pagos integrados
