# 🚀 Colectivos App

Real-time coordination app for taxi colectivos in Chile - Multi-platform frontend (Web + Mobile Native).

## 📂 Project Structure

```
colectivos-app/
├── web/          # Progressive Web App (React + TypeScript + Vite)
└── mobile/       # React Native App (Expo + TypeScript)
```

## 🌐 Web App (PWA)

Progressive Web App optimized for mobile browsers with real-time coordination features.

**Tech Stack:**
- React 19 + TypeScript
- Vite
- Socket.io Client
- React Router
- Geolocation API

**Setup:**
```bash
cd web
npm install
npm run dev
```

More details: [web/README.md](./web/README.md)

## 📱 Mobile App (Native)

Native mobile application built with Expo for iOS and Android.

**Tech Stack:**
- React Native
- Expo
- TypeScript
- Socket.io Client
- React Navigation
- Expo Location

**Setup:**
```bash
cd mobile
npm install
npx expo start
```

More details: [mobile/README.md](./mobile/README.md)

## 🔗 Backend API

Both apps connect to the same backend API:
- Repository: [colectivos-api](https://github.com/YOUR_USERNAME/colectivos-api)
- API Docs: See backend README

## 🚀 Features

- User authentication (passenger/driver)
- Real-time location sharing
- Interactive maps with demand visualization
- Passenger waiting status
- Driver availability updates
- Real-time notifications via WebSocket

## 📖 License

MIT
