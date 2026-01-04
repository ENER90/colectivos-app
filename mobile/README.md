# 📱 Colectivos Mobile App (React Native)

Native mobile application for taxi colectivos coordination - Built with Expo.

## 🚀 Stack

- **React Native + Expo**
- **TypeScript**
- **Socket.io Client** (real-time communication)
- **React Navigation** (navigation)
- **Expo Location** (native GPS)
- **Axios** (HTTP client)

## ✨ Features

- User authentication (passenger/driver)
- Real-time location sharing via native GPS
- Interactive native maps
- Passenger waiting status
- Driver availability updates
- Real-time notifications via WebSocket
- Native mobile performance

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```

## 📱 Running the App

### Option 1: Expo Go (Easy)
1. Install **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npx expo start`
3. Scan the QR code with your phone

### Option 2: Android Emulator
```bash
npm run android
```

### Option 3: iOS Simulator (macOS only)
```bash
npm run ios
```

### Option 4: Web (for testing)
```bash
npm run web
```

## 🔧 Environment Variables

Create `.env` file or use `app.config.js`:

```javascript
export default {
  extra: {
    apiUrl: process.env.API_URL || "http://localhost:3005",
    socketUrl: process.env.SOCKET_URL || "http://localhost:3005",
  },
};
```

## 📦 Build for Production

```bash
# Build APK for Android
eas build --platform android

# Build IPA for iOS (requires Apple Developer account)
eas build --platform ios
```

## 📖 License

MIT
