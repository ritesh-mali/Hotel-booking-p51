import React, { createContext, useContext, useState, useEffect } from 'react'
import { Hotel, Room } from '../types/hotel'
import { hotels as initialHotels } from '../data/hotels'

export interface Booking {
  id: string
  userId: string
  userName: string
  userEmail: string
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'paid' | 'unpaid'
  createdAt: string
  specialRequests?: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: string // 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking'
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
}

interface AppContextType {
  hotels: Hotel[]
  bookings: Booking[]
  payments: Payment[]
  addHotel: (hotelData: Omit<Hotel, 'id' | 'rooms' | 'rating' | 'reviewCount' | 'pricePerNight'>) => void
  updateHotel: (id: string, updatedData: Partial<Hotel>) => void
  deleteHotel: (id: string) => void
  addRoom: (hotelId: string, roomData: Omit<Room, 'id' | 'hotelId'>) => void
  updateRoom: (hotelId: string, roomId: string, updatedData: Partial<Room>) => void
  deleteRoom: (hotelId: string, roomId: string) => void
  addBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) => Booking
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void
  cancelBooking: (bookingId: string) => void
  addPayment: (paymentData: Omit<Payment, 'id' | 'createdAt'>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const SEED_BOOKINGS: Booking[] = [
  {
    id: 'BK-101',
    userId: 'user_1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    hotelId: 'h1',
    roomId: 'r1',
    checkInDate: '2026-07-01',
    checkOutDate: '2026-07-05',
    guests: 2,
    totalPrice: 3400,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2026-06-20T10:00:00Z',
  },
  {
    id: 'BK-102',
    userId: 'user_2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    hotelId: 'h2',
    roomId: 'r3',
    checkInDate: '2026-07-10',
    checkOutDate: '2026-07-12',
    guests: 1,
    totalPrice: 2400,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2026-06-21T14:30:00Z',
  },
  {
    id: 'BK-103',
    userId: 'user_3',
    userName: 'Alice Johnson',
    userEmail: 'alice@example.com',
    hotelId: 'h1',
    roomId: 'r2',
    checkInDate: '2026-08-15',
    checkOutDate: '2026-08-20',
    guests: 4,
    totalPrice: 7500,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2026-06-22T09:15:00Z',
  },
]

const SEED_PAYMENTS: Payment[] = [
  {
    id: 'PAY-201',
    bookingId: 'BK-101',
    amount: 3910, // including taxes
    method: 'Credit Card',
    status: 'completed',
    createdAt: '2026-06-20T10:05:00Z',
  },
  {
    id: 'PAY-203',
    bookingId: 'BK-103',
    amount: 8625, // including taxes
    method: 'UPI',
    status: 'completed',
    createdAt: '2026-06-22T09:20:00Z',
  },
]

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem('app_hotels')
    return saved ? JSON.parse(saved) : initialHotels
  })

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('app_bookings')
    return saved ? JSON.parse(saved) : SEED_BOOKINGS
  })

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('app_payments')
    return saved ? JSON.parse(saved) : SEED_PAYMENTS
  })

  useEffect(() => {
    localStorage.setItem('app_hotels', JSON.stringify(hotels))
  }, [hotels])

  useEffect(() => {
    localStorage.setItem('app_bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem('app_payments', JSON.stringify(payments))
  }, [payments])

  const addHotel = (hotelData: Omit<Hotel, 'id' | 'rooms' | 'rating' | 'reviewCount' | 'pricePerNight'>) => {
    const newHotel: Hotel = {
      ...hotelData,
      id: `h${Date.now()}`,
      rating: 4.5,
      reviewCount: 0,
      pricePerNight: 0,
      rooms: [],
    }
    setHotels((prev) => [...prev, newHotel])
  }

  const updateHotel = (id: string, updatedData: Partial<Hotel>) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedData } : h))
    )
  }

  const deleteHotel = (id: string) => {
    setHotels((prev) => prev.filter((h) => h.id !== id))
    // Clean up bookings and payments for deleted hotel branches
    setBookings((prev) => prev.filter((b) => b.hotelId !== id))
  }

  const addRoom = (hotelId: string, roomData: Omit<Room, 'id' | 'hotelId'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `r${Date.now()}`,
      hotelId,
    }
    setHotels((prev) =>
      prev.map((h) => {
        if (h.id === hotelId) {
          const newRooms = [...h.rooms, newRoom]
          const minPrice = newRooms.length > 0 ? Math.min(...newRooms.map((r) => r.price)) : 0
          return {
            ...h,
            rooms: newRooms,
            pricePerNight: minPrice,
          }
        }
        return h
      })
    )
  }

  const updateRoom = (hotelId: string, roomId: string, updatedData: Partial<Room>) => {
    setHotels((prev) =>
      prev.map((h) => {
        if (h.id === hotelId) {
          const updatedRooms = h.rooms.map((r) => (r.id === roomId ? { ...r, ...updatedData } : r))
          const minPrice = updatedRooms.length > 0 ? Math.min(...updatedRooms.map((r) => r.price)) : 0
          return {
            ...h,
            rooms: updatedRooms,
            pricePerNight: minPrice,
          }
        }
        return h
      })
    )
  }

  const deleteRoom = (hotelId: string, roomId: string) => {
    setHotels((prev) =>
      prev.map((h) => {
        if (h.id === hotelId) {
          const updatedRooms = h.rooms.filter((r) => r.id !== roomId)
          const minPrice = updatedRooms.length > 0 ? Math.min(...updatedRooms.map((r) => r.price)) : 0
          return {
            ...h,
            rooms: updatedRooms,
            pricePerNight: minPrice,
          }
        }
        return h
      })
    )
    // Cancel any bookings for this room
    setBookings((prev) =>
      prev.map((b) => (b.roomId === roomId ? { ...b, status: 'cancelled' } : b))
    )
  }

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `BK-${Math.floor(100 + Math.random() * 900)}`,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [newBooking, ...prev])
    return newBooking
  }

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    )
  }

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    )
  }

  const addPayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY-${Math.floor(200 + Math.random() * 800)}`,
      createdAt: new Date().toISOString(),
    }
    setPayments((prev) => [newPayment, ...prev])
    // Update booking status and paymentStatus
    setBookings((prev) =>
      prev.map((b) =>
        b.id === paymentData.bookingId
          ? { ...b, status: 'confirmed', paymentStatus: 'paid' }
          : b
      )
    )
  }

  return (
    <AppContext.Provider
      value={{
        hotels,
        bookings,
        payments,
        addHotel,
        updateHotel,
        deleteHotel,
        addRoom,
        updateRoom,
        deleteRoom,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        addPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
