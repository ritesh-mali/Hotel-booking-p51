import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import { CreditCard, CheckCircle, Smartphone, Globe, Landmark, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Payment() {
  const navigate = useNavigate()
  const { addBooking, addPayment } = useApp()
  const { booking, clearBooking } = useBooking()
  const { user } = useAuth()

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [formFields, setFormFields] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    specialRequests: '',
    totalPrice: 0,
    nights: 0,
    roomSubtotal: 0,
    taxes: 0,
  })

  useEffect(() => {
    // Read session storage details
    const stored = sessionStorage.getItem('pending_booking_form')
    if (stored) {
      setFormFields(JSON.parse(stored))
    } else {
      // If no details, redirect back to home
      navigate('/')
    }
  }, [navigate])

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking.hotelId || !booking.roomId) return

    setLoading(true)
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create the booking in state
    const newBooking = addBooking({
      userId: user?.id || 'guest_user',
      userName: formFields.userName,
      userEmail: formFields.userEmail,
      hotelId: booking.hotelId,
      roomId: booking.roomId,
      checkInDate: booking.checkInDate || '',
      checkOutDate: booking.checkOutDate || '',
      guests: booking.guests,
      totalPrice: formFields.totalPrice,
      specialRequests: formFields.specialRequests,
    })

    // Create the payment in state
    const methodLabels: { [key: string]: string } = {
      upi: 'UPI',
      card: 'Credit Card',
      debit: 'Debit Card',
      netbanking: 'Net Banking',
    }

    addPayment({
      bookingId: newBooking.id,
      amount: formFields.totalPrice,
      method: methodLabels[paymentMethod] || 'Credit Card',
      status: 'completed',
    })

    // Store confirmed details for confirmation page
    sessionStorage.setItem(
      'confirmed_booking',
      JSON.stringify({
        bookingId: newBooking.id,
        hotelName: booking.selectedHotel?.name,
        roomName: booking.selectedRoom?.name,
        city: booking.selectedHotel?.city,
        totalPrice: formFields.totalPrice,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        method: methodLabels[paymentMethod],
      })
    )

    // Clear booking state
    clearBooking()
    sessionStorage.removeItem('pending_booking_form')
    setLoading(false)

    // Navigate to confirmation page
    navigate('/confirmation')
  }

  if (!booking.selectedHotel || !booking.selectedRoom) {
    return null
  }

  const hotel = booking.selectedHotel
  const room = booking.selectedRoom

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black mb-8">Secure Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Payment Selection Forms */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">Choose Payment Option</h3>
                <p className="text-sm text-muted-foreground">Select from our secure billing gateways.</p>
              </div>

              <form onSubmit={handlePay} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Credit Card */}
                  <label
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer text-center transition ${
                      paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="sr-only"
                    />
                    <CreditCard size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Credit Card</span>
                  </label>

                  {/* Debit Card */}
                  <label
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer text-center transition ${
                      paymentMethod === 'debit' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit"
                      checked={paymentMethod === 'debit'}
                      onChange={() => setPaymentMethod('debit')}
                      className="sr-only"
                    />
                    <CreditCard size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Debit Card</span>
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer text-center transition ${
                      paymentMethod === 'upi' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="sr-only"
                    />
                    <Smartphone size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">UPI / QR</span>
                  </label>

                  {/* Net Banking */}
                  <label
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer text-center transition ${
                      paymentMethod === 'netbanking' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="sr-only"
                    />
                    <Landmark size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Net Banking</span>
                  </label>
                </div>

                {/* Sub-Forms */}
                {paymentMethod === 'card' && (
                  <div className="p-5 border border-border bg-secondary/15 rounded-xl space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <CreditCard size={16} /> Credit Card Billing Details
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Card Number (e.g. 4000 1234 5678 9010)"
                        maxLength={19}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                          required
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength={3}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'debit' && (
                  <div className="p-5 border border-border bg-secondary/15 rounded-xl space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <CreditCard size={16} /> Debit Card Billing Details
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                          required
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-5 border border-border bg-secondary/15 rounded-xl space-y-4 animate-fade-in text-center">
                    <h4 className="text-sm font-bold text-foreground flex items-center justify-center gap-1.5">
                      <Smartphone size={16} /> UPI Billing ID
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Please enter your Virtual Payment Address (VPA) / UPI ID (e.g. john@okaxis).
                    </p>
                    <input
                      type="text"
                      placeholder="username@upi"
                      className="w-full max-w-md mx-auto px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-center"
                      required
                    />
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-5 border border-border bg-secondary/15 rounded-xl space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Landmark size={16} /> Select Bank
                    </h4>
                    <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm" required>
                      <option value="">-- Choose Your Bank --</option>
                      <option value="chase">Chase Bank</option>
                      <option value="bofa">Bank of America</option>
                      <option value="wells">Wells Fargo</option>
                      <option value="citibank">Citibank</option>
                      <option value="hsb">HSBC Bank</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 border border-border rounded-lg hover:bg-secondary transition font-semibold text-sm cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition text-sm cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Processing Transaction...' : `Pay $${formFields.totalPrice}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-xl font-bold">Booking Summary</h3>

              {/* Branch/Room */}
              <div className="pb-6 border-b border-border space-y-4">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-36 object-cover rounded-xl shadow-sm"
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

              {/* Booking Specifics */}
              <div className="pb-6 border-b border-border text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-bold">{booking.checkInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-bold">{booking.checkOutDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights:</span>
                  <span className="font-bold">{formFields.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-bold">{booking.guests}</span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 pb-6 border-b border-border text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">${formFields.roomSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Service fees (15%):</span>
                  <span className="font-semibold">${formFields.taxes}</span>
                </div>
              </div>

              {/* Cost Total */}
              <div className="flex justify-between items-center text-xl font-black">
                <span>Total Charge</span>
                <span className="text-primary">${formFields.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
