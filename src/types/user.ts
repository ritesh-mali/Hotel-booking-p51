export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  createdAt?: string
}

export interface Booking {
  id: string
  userId: string
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}
