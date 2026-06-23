import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { BookingProvider } from './context/BookingContext'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Hotels from './pages/Hotels'
import HotelDetails from './pages/HotelDetails'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Rooms from './pages/Rooms'
import RoomComparison from './pages/RoomComparison'
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import AdminLogin from './pages/AdminLogin'
import ManagerLogin from './pages/ManagerLogin'
import ManagerDashboard from './pages/ManagerDashboard'

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BookingProvider>
            <Router>
              <Routes>
                {/* Customer Module */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/branches" element={<Hotels />} />
                <Route path="/branches/:id" element={<HotelDetails />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/compare" element={<RoomComparison />} />
                <Route path="/booking/:hotelId/:roomId" element={<Booking />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Central Admin Module */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Branch Manager Module */}
                <Route path="/manager/login" element={<ManagerLogin />} />
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />

                {/* Fallbacks */}
                <Route path="/hotels" element={<Navigate to="/branches" replace />} />
                <Route path="/hotels/:id" element={<Navigate to="/branches/:id" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </BookingProvider>
        </FavoritesProvider>
      </AuthProvider>
    </AppProvider>
  )
}
