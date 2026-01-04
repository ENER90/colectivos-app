# 🚀 Colectivos App

Real-time coordination app for taxi colectivos in Chile - Frontend with React, TypeScript and real-time maps.

## 🚀 Stack

- **React 19 + TypeScript**
- **Vite** (build tool)
- **Socket.io Client** (real-time communication)
- **React Router** (navigation)
- **Mapbox/Leaflet** (maps - to be integrated)

## ✨ Features

- User authentication (passenger/driver)
- Real-time location sharing
- Interactive map with demand visualization
- Passenger waiting status
- Driver availability updates
- Real-time notifications
- Responsive design

## 🛠️ Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/colectivos-app.git
cd colectivos-app

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your backend API URL

# 4. Run the development server
npm run dev
```

App runs on `http://localhost:5173`

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3004
VITE_SOCKET_URL=http://localhost:3004
```

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🗂️ Project Structure

```
colectivos-app/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── services/    # API & Socket services
│   ├── hooks/       # Custom React hooks
│   ├── context/     # React Context providers
│   ├── types/       # TypeScript types
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main app component
│   └── main.tsx     # Entry point
└── package.json
```

## 🚀 Deployment

The app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

```bash
npm run build
# Deploy the 'dist' folder
```

## 📖 License

MIT
