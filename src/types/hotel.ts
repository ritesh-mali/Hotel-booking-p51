export interface Hotel {
  id: string
  name: string
  city: string
  country: string
  address: string
  rating: number
  reviewCount: number
  description: string
  image: string
  images: string[]
  pricePerNight: number
  amenities: string[]
  rooms: Room[]
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Room {
  id: string
  hotelId: string
  name: string
  type: 'deluxe' | 'standard' | 'suite' | 'family'
  capacity: number
  price: number
  image: string
  images: string[]
  amenities: string[]
  available: boolean
}

export interface Review {
  id: string
  hotelId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  avatar: string
}
