import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Share2, MapPin, Users, Coffee } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { hotels } from '../data/hotels'
import { useFavorites } from '../context/FavoritesContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HotelDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const hotel = hotels.find((h) => h.id === id)

  if (!hotel) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Hotel Not Found</h1>
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
      <div className="bg-background">
        {/* Image Gallery Section */}
        <div className="relative h-96 bg-muted">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {hotel.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img} alt={`${hotel.name} - ${idx + 1}`} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-primary" />
                <p className="text-lg text-muted-foreground">{hotel.address}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < hotel.rating ? '#f59e0b' : '#e5e7eb'}
                      color={i < hotel.rating ? '#f59e0b' : '#e5e7eb'}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({hotel.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => toggleFavorite(hotel.id)}
                className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition"
              >
                <Heart
                  size={24}
                  fill={isFavorite(hotel.id) ? 'currentColor' : 'none'}
                  color={isFavorite(hotel.id) ? 'currentColor' : 'currentColor'}
                />
              </button>
              <button className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition">
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
            <p className="text-lg text-foreground mb-6">{hotel.description}</p>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <Coffee size={20} className="text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.rooms.map((room) => (
                <div key={room.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition">
                  {/* Room Image */}
                  <div className="h-64 bg-muted overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Room Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{room.name}</h3>

                    {/* Room Details */}
                    <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users size={18} />
                        <span>Up to {room.capacity} guests</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Room Features:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {room.amenities.map((amenity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            ✓ {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Per night</p>
                        <p className="text-3xl font-bold text-primary">${room.price}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/booking/${hotel.id}/${room.id}`)}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition font-semibold"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Hotels */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Similar Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels
                .filter((h) => h.id !== hotel.id)
                .slice(0, 3)
                .map((similarHotel) => (
                  <div
                    key={similarHotel.id}
                    onClick={() => navigate(`/hotels/${similarHotel.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                      <div className="h-48 bg-muted overflow-hidden">
                        <img
                          src={similarHotel.image}
                          alt={similarHotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{similarHotel.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {similarHotel.city}, {similarHotel.country}
                        </p>
                        <p className="text-lg font-bold text-primary">${similarHotel.pricePerNight}/night</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
