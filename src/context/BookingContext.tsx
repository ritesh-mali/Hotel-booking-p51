import React, { createContext, useContext, useState } from 'react'

export interface BookingDetails {
  hotelId: string | null
  roomId: string | null
  checkInDate: string | null
  checkOutDate: string | null
  guests: number
  selectedRoom: any | null
  selectedHotel: any | null
}

interface BookingContextType {
  booking: BookingDetails
  updateBooking: (details: Partial<BookingDetails>) => void
  clearBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const initialBooking: BookingDetails = {
  hotelId: null,
  roomId: null,
  checkInDate: null,
  checkOutDate: null,
  guests: 1,
  selectedRoom: null,
  selectedHotel: null,
}

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [booking, setBooking] = useState<BookingDetails>(initialBooking)

  const updateBooking = (details: Partial<BookingDetails>) => {
    setBooking((prev) => ({ ...prev, ...details }))
  }

  const clearBooking = () => {
    setBooking(initialBooking)
  }

  return (
    <BookingContext.Provider value={{ booking, updateBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
