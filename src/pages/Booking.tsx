import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, User, Mail, Phone, ArrowLeft, ShieldAlert } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { motion } from 'framer-motion'

export default function Booking() {
  const { hotelId, roomId } = useParams()
  const navigate = useNavigate()
  const { hotels } = useApp()
  const { user } = useAuth()
  const { updateBooking } = useBooking()

  const hotel = hotels.find((h) => h.id === hotelId)
  const room = hotel?.rooms.find((r) => r.id === roomId)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
  })

  // Set dates from search query if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryCheckIn = params.get('checkIn') || ''
    const queryCheckOut = params.get('checkOut') || ''
    const queryGuests = Number(params.get('guests')) || 1

    if (queryCheckIn || queryCheckOut) {
      setFormData((prev) => ({
        ...prev,
        checkInDate: queryCheckIn,
        checkOutDate: queryCheckOut,
        guests: queryGuests,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0
    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    if (checkOut <= checkIn) return 0
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const roomSubtotal = room ? room.price * nights : 0
  const taxes = Math.round(roomSubtotal * 0.15)
  const totalPrice = roomSubtotal + taxes

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (nights <= 0) {
      alert('Please check your dates. Check-out date must be after Check-in date.')
      return
    }

    // Save pending details into BookingContext
    updateBooking({
      hotelId: hotelId || null,
      roomId: roomId || null,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guests: formData.guests,
      selectedHotel: hotel,
      selectedRoom: room,
    })

    // Store custom fields in session storage so Payment Page can access them
    sessionStorage.setItem(
      'pending_booking_form',
      JSON.stringify({
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        specialRequests: formData.specialRequests,
        totalPrice,
        nights,
        roomSubtotal,
        taxes,
      })
    )

    // Redirect to payment page
    navigate('/payment')
  }

  if (!hotel || !room) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4 text-destructive">Booking Not Found</h1>
          <button
            onClick={() => navigate('/branches')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Back to Branches
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <button
          onClick={() => navigate(`/branches/${hotel.id}`)}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Branch Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking form */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-black">Configure Your Stay</h1>
              <p className="text-muted-foreground text-sm">Please fill in your details and select check-in/out dates.</p>

              <form onSubmit={handleConfirmBooking} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Guest Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Number of Guests</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none"
                    >
                      {[...Array(room.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'} (Max {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <h3 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2 pt-4">
                  <Calendar size={18} className="text-primary" />
                  Select Dates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-In */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Check-In Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    />
                  </div>

                  {/* Check-Out */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Check-Out Date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="E.g. Extra pillows, airport shuttle request, high floor, early check-in details..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => navigate(`/branches/${hotel.id}`)}
                    className="flex-1 py-3 border border-border rounded-lg hover:bg-secondary transition font-semibold text-sm cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition text-sm cursor-pointer shadow-md"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-xl font-bold">Booking Details</h3>

              {/* Branch & Room Info */}
              <div className="pb-6 border-b border-border space-y-4">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-40 object-cover rounded-xl shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-base leading-tight">{room.name}</h4>
                  <p className="text-xs text-primary font-bold mt-1 uppercase tracking-wider">
                    {hotel.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hotel.city}, {hotel.country}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-border text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ${room.price} × {nights || 0} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="font-semibold">${roomSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees (15%)</span>
                  <span className="font-semibold">${taxes}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-extrabold">
                <span>Total Cost</span>
                <span className="text-primary">${totalPrice}</span>
              </div>

              {/* Booking safety tip */}
              <div className="flex gap-2.5 p-3.5 bg-secondary/50 rounded-xl border border-border text-xs text-muted-foreground">
                <ShieldAlert size={16} className="text-primary shrink-0" />
                <span>By confirming, you proceed to safe payment options. Cancellation is subject to room policies.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
