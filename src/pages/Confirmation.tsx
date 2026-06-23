import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { CheckCircle, Calendar, CreditCard, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Confirmation() {
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    bookingId: '',
    hotelName: '',
    roomName: '',
    city: '',
    totalPrice: 0,
    checkInDate: '',
    checkOutDate: '',
    method: '',
  })

  useEffect(() => {
    const stored = sessionStorage.getItem('confirmed_booking')
    if (stored) {
      setDetails(JSON.parse(stored))
    } else {
      navigate('/')
    }
  }, [navigate])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8"
        >
          {/* Animated check circle */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="p-5 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full shadow-lg"
            >
              <CheckCircle size={64} />
            </motion.div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black">Stay Confirmed!</h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your room has been blocked successfully. We are excited to host you!
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-secondary/45 border border-border rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
            <div className="flex justify-between items-center text-xs border-b border-border pb-3">
              <span className="text-muted-foreground font-semibold uppercase">Booking Reference</span>
              <span className="font-extrabold text-primary text-sm tracking-wider">{details.bookingId}</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase leading-none font-bold">Resort Branch</p>
                <p className="font-bold text-foreground mt-1">{details.hotelName} ({details.city})</p>
              </div>
              
              <div>
                <p className="text-[10px] text-muted-foreground uppercase leading-none font-bold">Room Category</p>
                <p className="font-bold text-foreground mt-1">{details.roomName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase leading-none font-bold">Check-In</p>
                  <p className="font-semibold text-xs text-foreground mt-1 flex items-center gap-1">
                    <Calendar size={12} className="text-primary/70" />
                    {details.checkInDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase leading-none font-bold">Check-Out</p>
                  <p className="font-semibold text-xs text-foreground mt-1 flex items-center gap-1">
                    <Calendar size={12} className="text-primary/70" />
                    {details.checkOutDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/80">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase leading-none font-bold">Payment Method</p>
                  <p className="font-semibold text-xs text-foreground mt-1 flex items-center gap-1">
                    <CreditCard size={12} className="text-primary/70" />
                    {details.method}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase leading-none font-bold">Amount Paid</p>
                  <p className="font-extrabold text-xs text-primary mt-1">
                    ${details.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email dispatch success msg */}
          <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-muted-foreground max-w-sm mx-auto p-3 bg-primary/5 rounded-xl border border-primary/10">
            <Mail size={16} className="text-primary animate-bounce" />
            <span>Invoice and check-in guide sent to your email.</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-md mx-auto">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 border border-border hover:bg-secondary rounded-xl font-semibold text-sm transition cursor-pointer"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition text-sm cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              View Bookings
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
