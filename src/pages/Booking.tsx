import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/layout/Layout'
import { hotels } from '../data/hotels'
import { useAuth } from '../context/AuthContext'

export default function Booking() {
  const { hotelId, roomId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  const hotel = hotels.find((h) => h.id === hotelId)
  const room = hotel?.rooms.find((r) => r.id === roomId)

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
    paymentMethod: 'card',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0
    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const totalPrice = room ? room.price * nights : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setBookingComplete(true)
  }

  if (!hotel || !room) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Booking Not Found</h1>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Back to Hotels
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!bookingComplete ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h1 className="text-4xl font-bold mb-8">Complete Your Booking</h1>

                  {/* Steps */}
                  <div className="flex gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-2 rounded-full transition ${
                          s <= step ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Guest Details */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold">Guest Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 text-muted-foreground" size={20} />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Dates & Guests */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold">Select Dates</h2>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Check-in Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 text-muted-foreground" size={20} />
                              <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Check-out Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 text-muted-foreground" size={20} />
                              <input
                                type="date"
                                name="checkOutDate"
                                value={formData.checkOutDate}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Number of Guests</label>
                          <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Special Requests</label>
                          <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                            placeholder="Any special requests..."
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            rows={3}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold">Payment Method</h2>

                        <div className="space-y-3">
                          {['card', 'wallet', 'bank'].map((method) => (
                            <label
                              key={method}
                              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                formData.paymentMethod === method
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={formData.paymentMethod === method}
                                onChange={handleInputChange}
                                className="w-4 h-4"
                              />
                              <span className="ml-3 font-medium capitalize">{method === 'card' ? 'Credit Card' : method === 'wallet' ? 'Digital Wallet' : 'Bank Transfer'}</span>
                            </label>
                          ))}
                        </div>

                        {formData.paymentMethod === 'card' && (
                          <div className="bg-card p-4 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground mb-4">Mock card form (demo only)</p>
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="4532 1234 5678 9010"
                                className="w-full px-4 py-2 border border-border rounded-lg"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  className="px-4 py-2 border border-border rounded-lg"
                                />
                                <input
                                  type="text"
                                  placeholder="CVC"
                                  className="px-4 py-2 border border-border rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition"
                        >
                          Back
                        </button>
                      )}
                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition font-semibold"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'Complete Booking'}
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-block p-6 bg-primary/10 rounded-full mb-6">
                    <CheckCircle className="text-primary" size={64} />
                  </div>
                  <h2 className="text-4xl font-bold mb-2">Booking Confirmed!</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Confirmation sent to {formData.email}
                  </p>
                  <div className="text-lg mb-8">
                    <p className="text-muted-foreground">Booking Reference:</p>
                    <p className="font-bold text-2xl text-primary">BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90"
                  >
                    Back to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-20 h-fit">
              <h3 className="text-2xl font-bold mb-6">Booking Summary</h3>

              {/* Hotel Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h4 className="font-bold text-lg">{hotel.name}</h4>
                <p className="text-sm text-muted-foreground">{hotel.city}, {hotel.country}</p>
              </div>

              {/* Room Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Room</p>
                <p className="font-bold text-lg">{room.name}</p>
              </div>

              {/* Dates */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Dates</p>
                <p className="font-bold">
                  {formData.checkInDate && formData.checkOutDate
                    ? `${nights} ${nights === 1 ? 'night' : 'nights'}`
                    : 'Select dates'}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ${room.price} × {nights || 0} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="font-semibold">${room.price * (nights || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span className="font-semibold">${Math.round(totalPrice * 0.15)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 text-2xl font-bold">
                <span>Total</span>
                <span className="text-primary">${Math.round(totalPrice * 1.15)}</span>
              </div>

              <button
                onClick={() => {
                  if (step === 3 && bookingComplete === false) {
                    handleSubmit({ preventDefault: () => {} } as any)
                  }
                }}
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
