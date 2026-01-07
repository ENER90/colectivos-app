# 📱 Configuración de la App Móvil

## Paso 1: Configurar URLs del Backend

Antes de correr la app, necesitas configurar las URLs del backend con tu IP local.

### Encontrar tu IP local:

**En Linux/Mac:**
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**En Windows:**
```bash
ipconfig | findstr IPv4
```

### Actualizar las URLs:

1. **Edita `src/services/api.service.ts`:**
```typescript
const API_URL = "http://TU_IP_AQUI:3005/api";
```

2. **Edita `src/services/socket.service.ts`:**
```typescript
const SOCKET_URL = "http://TU_IP_AQUI:3005";
```

Ejemplo: Si tu IP es `192.168.1.50`:
```typescript
const API_URL = "http://192.168.1.50:3005/api";
const SOCKET_URL = "http://192.168.1.50:3005";
```

## Paso 2: Iniciar el Backend

Asegúrate de que el backend esté corriendo:

```bash
cd ../../colectivos-api
npm run dev
```

Debe estar corriendo en: `http://localhost:3005`

## Paso 3: Iniciar la App Móvil

```bash
cd /home/ener/PROGRAMING/COLECTIVOS/colectivos-app/mobile
npm start
```

## Paso 4: Abrir en tu Dispositivo

### Opción A: Expo Go (Recomendado para desarrollo)

1. Instala **Expo Go** en tu dispositivo:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escanea el QR code que aparece en la terminal:
   - **Android**: Usa la app Expo Go
   - **iOS**: Usa la cámara (te redirigirá a Expo Go)

### Opción B: Emulador Android

```bash
npm run android
```

### Opción C: Simulador iOS (Solo Mac)

```bash
npm run ios
```

## ⚠️ Solución de Problemas

### Error: "Network request failed"

- Verifica que el backend esté corriendo
- Verifica que tu dispositivo esté en la misma red WiFi que tu computadora
- Verifica que las URLs en `api.service.ts` y `socket.service.ts` usen tu IP local

### Error de permisos de ubicación

- En Android: Ve a Configuración > Apps > Colectivos > Permisos
- En iOS: Ve a Configuración > Privacidad > Localización > Colectivos

### El mapa no se carga

Para Android necesitas configurar Google Maps API Key en `app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "TU_API_KEY_AQUI"
    }
  }
}
```

Obtén tu API Key en: https://console.cloud.google.com/

## 🎯 Próximos Pasos

1. Registra un usuario con rol "passenger"
2. Registra otro usuario con rol "driver" (en otro dispositivo o web)
3. Prueba marcar como esperando (pasajero)
4. Prueba actualizar ubicación (conductor)
5. Observa cómo aparecen en tiempo real en el mapa

¡Listo! 🚀
