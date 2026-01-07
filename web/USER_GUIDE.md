# 🌐 Colectivos Web App - User Guide

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:3005`
- Frontend running on `http://localhost:5173`

### Start the app
```bash
# Terminal 1: Backend
cd colectivos-api
npm run dev

# Terminal 2: Frontend
cd colectivos-app/web
npm run dev
```

---

## 📱 User Interface

### 1. Login Page (`/login`)

**Features:**
- Email and password authentication
- Clean, modern design with gradient background
- Link to registration page
- Error handling with user-friendly messages

**Test credentials:**
```
Passenger:
- Email: pasajero1@test.com
- Password: 123456

Driver:
- Email: conductor1@test.com
- Password: 123456
```

---

### 2. Register Page (`/register`)

**Features:**
- Username, email, and password fields
- Role selection (Passenger 👤 or Driver 🚗)
- Visual role selector with icons
- Form validation
- Automatic login after registration

**How to use:**
1. Enter your username (min 3 characters)
2. Enter your email
3. Enter your password (min 6 characters)
4. Select your role (Passenger or Driver)
5. Click "Registrarse"

---

### 3. Dashboard (`/dashboard`)

The main application interface with real-time map and controls.

#### **Layout:**
```
┌─────────────────────────────────────────────────┐
│  🚖 Colectivos    [Role] - Username   [Logout]  │
├─────────────────────────────────────────────────┤
│                                    │            │
│                                    │  Control   │
│         Interactive Map            │   Panel    │
│         (Leaflet + OSM)            │            │
│                                    │  Actions   │
│                                    │  & Stats   │
│                                    │            │
└─────────────────────────────────────────────────┘
```

---

## 👤 Passenger View

### Features:
- **Interactive Map** with your current location (🔴 red marker)
- **Nearby Drivers** shown as green markers (🟢)
- **"Marcar como esperando"** button to signal you're waiting
- **Real-time driver updates** via WebSocket
- **Driver counter** showing how many drivers are nearby

### How to use:
1. **Allow location access** when prompted by the browser
2. See your location on the map (red marker)
3. Click **"📍 Marcar como esperando"** to signal you're waiting
4. Status changes to "Esperando conductor..." with animated pulse
5. Watch as nearby drivers appear on the map in real-time
6. Click on driver markers to see:
   - Driver username
   - Available seats
7. Click **"❌ Cancelar espera"** to stop waiting

### Real-time events received:
- `driver:location-updated` → When a driver updates their location
- `passenger:waiting-success` → Confirmation of waiting status
- `passenger:cancel-success` → Confirmation of cancellation

---

## 🚗 Driver View

### Features:
- **Interactive Map** with your current location (🔴 red marker)
- **Waiting Passengers** shown as blue markers (🔵)
- **Available seats selector** (0-4)
- **"Actualizar ubicación"** button to broadcast your position
- **Passenger counter** showing how many passengers are waiting

### How to use:
1. **Allow location access** when prompted by the browser
2. See your location on the map (red marker)
3. Adjust **"Asientos disponibles"** (0-4)
4. Click **"📍 Actualizar ubicación"** to broadcast your position
5. Watch as waiting passengers appear on the map in real-time
6. Click on passenger markers to see:
   - Passenger username
   - "Esperando..." status

### Real-time events received:
- `passenger:new-waiting` → When a passenger marks as waiting
- `passenger:cancelled` → When a passenger cancels
- `driver:location-update-success` → Confirmation of location update

---

## 🔄 Real-time Communication

### WebSocket Events Flow:

#### Passenger marks as waiting:
```
Passenger → passenger:waiting → Server
Server → passenger:new-waiting → All Drivers
```

#### Driver updates location:
```
Driver → driver:location-update → Server
Server → driver:location-updated → All Passengers
```

#### Passenger cancels:
```
Passenger → passenger:cancel → Server
Server → passenger:cancelled → All Drivers
```

---

## 🎨 UI Features

### Design Elements:
- **Gradient backgrounds** (purple to violet)
- **Smooth animations** (hover effects, transitions)
- **Responsive design** (mobile and desktop)
- **Loading states** (spinners, disabled buttons)
- **Error handling** (red error boxes)
- **Status indicators** (animated pulse for waiting)

### Map Features:
- **OpenStreetMap tiles** (free, open-source)
- **Custom markers** (color-coded by role)
- **Popups** with user information
- **Auto-centering** on your location
- **Zoom controls**
- **Pan and zoom** with mouse/touch

---

## 🧪 Testing Real-time Features

### Test Scenario 1: Passenger waiting for driver
1. Open browser window 1 → Register as **Passenger**
2. Click "Marcar como esperando"
3. Open browser window 2 → Register as **Driver**
4. Click "Actualizar ubicación"
5. **Result:** Passenger sees driver appear on map in real-time

### Test Scenario 2: Driver sees multiple passengers
1. Open 3 browser windows
2. Windows 1 & 2 → Register as **Passengers** and mark as waiting
3. Window 3 → Register as **Driver**
4. **Result:** Driver sees both passengers on map

### Test Scenario 3: Passenger cancels
1. Passenger marks as waiting
2. Driver sees passenger on map
3. Passenger clicks "Cancelar espera"
4. **Result:** Passenger disappears from driver's map in real-time

---

## 🔧 Troubleshooting

### Map not loading:
- Check internet connection (OSM tiles require internet)
- Check browser console for errors
- Ensure location permissions are granted

### Location not detected:
- Allow location access in browser settings
- Use HTTPS in production (geolocation requires secure context)
- Fallback to Santiago, Chile coordinates if unavailable

### Real-time not working:
- Check backend is running (`http://localhost:3005`)
- Check Socket.io connection in browser console
- Verify JWT token is valid (check localStorage)

### Markers not appearing:
- Ensure other users are connected
- Check Socket.io events in browser console
- Verify users have opposite roles (passenger/driver)

---

## 📊 Browser Console

### Useful console messages:
```
✅ Socket connected          → WebSocket connected
❌ Socket disconnected       → WebSocket disconnected
Socket error: ...            → Connection error
Location updated             → Driver location sent
```

### Check Socket.io status:
```javascript
// In browser console
localStorage.getItem('token')  // Check JWT token
```

---

## 🌍 Geolocation

### Browser API used:
```javascript
navigator.geolocation.getCurrentPosition()
```

### Default location (if denied):
- **Santiago, Chile**: -33.4500, -70.6500

### Accuracy:
- Depends on device (GPS, WiFi, IP)
- Mobile devices: ~10-50 meters
- Desktop: ~100-1000 meters

---

## 🎯 Next Steps

### Potential improvements:
- [ ] Route calculation between passenger and driver
- [ ] Distance estimation
- [ ] ETA (estimated time of arrival)
- [ ] In-app chat
- [ ] Push notifications
- [ ] Driver ratings
- [ ] Ride history
- [ ] Payment integration

---

## 📖 Related Documentation

- [Backend API Documentation](../../colectivos-api/README.md)
- [Socket.io Events](../../colectivos-api/SOCKET_EVENTS.md)
- [Mobile App](../mobile/README.md)
