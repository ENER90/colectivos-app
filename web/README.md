# 🌐 Colectivos Web App (PWA)

Progressive Web App for taxi colectivos coordination - Optimized for mobile browsers.

## 🚀 Stack

- **React 19 + TypeScript**
- **Vite** (build tool)
- **Socket.io Client** (real-time communication)
- **React Router** (navigation)
- **Geolocation API** (browser location)

## ✨ Features

- User authentication (passenger/driver)
- Real-time location sharing via browser GPS
- Interactive map with demand visualization
- Passenger waiting status
- Driver availability updates
- Real-time notifications
- PWA installable on mobile home screen

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Run development server
npm run dev
```

App runs on `http://localhost:5173`

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3005
VITE_SOCKET_URL=http://localhost:3005
```

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🚀 Deployment

Deploy to Vercel, Netlify, or GitHub Pages:

```bash
npm run build
# Deploy the 'dist' folder
```

## 📖 License

MIT
