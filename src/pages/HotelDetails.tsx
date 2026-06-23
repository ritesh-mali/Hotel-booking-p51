import { useParams, useNavigate } from 'react-router-dom'
import { Star, Heart, Share2, MapPin, Users, Coffee, Bed, Sparkles } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { useFavorites } from '../context/FavoritesContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HotelDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hotels } = useApp()
  const { toggleFavorite, isFavorite } = useFavorites()

  const hotel = hotels.find((h) => h.id === id)

  if (!hotel) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4 text-destructive">Branch Not Found</h1>
          <p className="text-muted-foreground mb-8">The hotel branch you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => navigate('/branches')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold transition"
          >
            Back to Branches
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-background">
        {/* Image Gallery Section */}
        <div className="relative h-[50vh] bg-muted border-b border-border">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {hotel.images && hotel.images.length > 0 ? (
              hotel.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`${hotel.name} - ${idx + 1}`} className="w-full h-full object-cover" />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
              </SwiperSlide>
            )}
          </Swiper>
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              Featured Location
            </span>
          </div>
        </div>

        {/* Details & Room Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8 border-b border-border mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-3">{hotel.name}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                <MapPin size={16} className="text-primary shrink-0" />
                <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < hotel.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-muted-foreground">({hotel.reviewCount} verified guest reviews)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleFavorite(hotel.id)}
                className={`p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all ${
                  isFavorite(hotel.id) ? 'bg-primary/10 text-primary border-primary' : 'text-muted-foreground'
                }`}
              >
                <Heart size={20} fill={isFavorite(hotel.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }}
                className="p-3 rounded-xl border border-border text-muted-foreground hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Description & Amenities split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                About the Branch
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">{hotel.description}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 h-fit">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Coffee size={18} className="text-primary" />
                Branch Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms List */}
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-border">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Bed size={22} className="text-primary" />
                Available Accommodation
              </h2>
              <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                {hotel.rooms.length} Room Types
              </span>
            </div>

            {hotel.rooms.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <p className="text-muted-foreground font-semibold">No rooms are currently registered for this branch.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Room Image */}
                      <div className="relative h-60 bg-muted overflow-hidden">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                          {room.type.toUpperCase()}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                            room.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {room.available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{room.name}</h3>

                        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground">
                          <Users size={14} className="text-primary/70" />
                          <span>Accommodates up to {room.capacity} guests</span>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-2 mb-6">
                          <p className="text-xs font-bold text-muted-foreground uppercase">Room Features:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.map((amenity, idx) => (
                              <span key={idx} className="text-[10px] bg-secondary px-2.5 py-1 rounded font-medium">
                                ✓ {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/10">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase leading-none">Rate per night</p>
                        <p className="text-2xl font-black text-primary mt-1">${room.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (room.available) {
                            navigate(`/booking/${hotel.id}/${room.id}`)
                          } else {
                            alert('This room is currently unavailable.')
                          }
                        }}
                        disabled={!room.available}
                        className={`px-5 py-2.5 rounded-lg font-bold text-xs shadow transition cursor-pointer ${
                          room.available
                            ? 'bg-primary text-primary-foreground hover:bg-primary/95'
                            : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                        }`}
                      >
                        {room.available ? 'Book Room' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
