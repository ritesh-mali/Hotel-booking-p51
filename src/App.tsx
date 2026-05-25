import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { BookingProvider } from './context/BookingContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Hotels from './pages/Hotels'
import HotelDetails from './pages/HotelDetails'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BookingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/booking/:hotelId/:roomId" element={<Booking />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </BookingProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
