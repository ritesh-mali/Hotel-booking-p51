import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, Search, Star, Heart, ArrowRight, ChevronDown, CheckCircle, Coffee, ShieldCheck } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { useFavorites } from '../context/FavoritesContext'
import { motion } from 'framer-motion'

export default function Home() {
  const { hotels } = useApp()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/branches?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  const featuredBranches = hotels.slice(0, 4)

  // Get popular rooms from all branches
  const popularRooms = hotels
    .flatMap((hotel) =>
      hotel.rooms.map((room) => ({
        ...room,
        hotelId: hotel.id,
        hotelName: hotel.name,
        city: hotel.city,
      }))
    )
    .slice(0, 3)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'An unforgettable experience! The service at Paris branch was impeccable and the design is stunning.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      rating: 5,
      comment: 'Luxury redefined. Every detail of our suite in Dubai was perfect, and the butler service is second to none.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    {
      name: 'Emma Wilson',
      location: 'London, UK',
      rating: 5,
      comment: 'The best hotel experience of my life! Staying at the Bora Bora overwater bungalow was a dream come true.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center overflow-hidden flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 76, 129, 0.45), rgba(15, 76, 129, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              className="lg:col-span-6 text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
                Welcome to Aura Resorts
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Where Luxury Meets <br />
                <span className="text-blue-200">Tranquility</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-lg leading-relaxed">
                Experience world-class hospitality across our premium global branches. Your perfect stay is just a search away.
              </p>
            </motion.div>

            {/* Search Widget */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <form
                onSubmit={handleSearch}
                className="bg-card/95 text-card-foreground backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-border"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">Find Your Perfect Stay</h3>
                <div className="space-y-4">
                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Destination / City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Search by city or branch..."
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Check-In</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Check-Out</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Guests count</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 text-muted-foreground" size={18} />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition text-sm appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/95 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    <Search size={18} />
                    Search Branches
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="text-white opacity-80" size={24} />
          </motion.div>
        </div>
      </section>

      {/* Featured Branches Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Explore Aura</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">Featured Resort Branches</h2>
            </div>
            <button
              onClick={() => navigate('/branches')}
              className="mt-4 md:mt-0 text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all hover:underline group text-sm"
            >
              View All Branches <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBranches.map((hotel) => (
              <motion.div
                key={hotel.id}
                className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-border transition-all flex flex-col h-full"
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/branches/${hotel.id}`)}
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(hotel.id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow hover:bg-primary hover:text-white transition"
                  >
                    <Heart
                      size={16}
                      fill={isFavorite(hotel.id) ? 'currentColor' : 'none'}
                      color={isFavorite(hotel.id) ? 'currentColor' : '#000'}
                    />
                  </button>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition">{hotel.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5 mb-3">
                    <MapPin size={12} className="text-primary/70" />
                    {hotel.city}, {hotel.country}
                  </p>

                  <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < hotel.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase leading-none">Starting from</p>
                      <p className="text-lg font-extrabold text-primary mt-1">${hotel.pricePerNight || 350}/night</p>
                    </div>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Details
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Value Props */}
      <section className="py-16 bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1.5">Best Rate Guarantee</h4>
                <p className="text-sm text-muted-foreground">Book directly through our website to enjoy the lowest possible prices and exclusive benefits.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <Coffee size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1.5">Premium Amenities</h4>
                <p className="text-sm text-muted-foreground">From spa therapies and private beach access to Michelin-starred dining, luxury is built-in.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <CheckCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1.5">Flexible Cancellation</h4>
                <p className="text-sm text-muted-foreground">Plans change. Cancel up to 24 hours prior to check-in for a full refund on eligible rooms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rooms Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Unmatched Comfort</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">Our Popular Accommodations</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
              Discover the most requested rooms and suites, tailored for ultimate relaxation and fine living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularRooms.map((room) => (
              <div
                key={room.id}
                className="group bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-60 bg-muted overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded">
                    {room.type.toUpperCase()}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1.5 group-hover:text-primary transition">{room.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin size={12} className="text-primary/70" />
                    {room.hotelName} ({room.city})
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities.map((amenity, idx) => (
                      <span key={idx} className="text-[10px] bg-secondary px-2.5 py-1 rounded-full font-medium">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase leading-none">Rate per night</p>
                      <p className="text-2xl font-black text-primary mt-1">${room.price}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/booking/${room.hotelId}/${room.id}`)}
                      className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-lg hover:bg-primary/95 transition shadow-sm text-sm cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">What Our Guests Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white/10 rounded-2xl p-8 border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="italic text-base mb-6 text-white/90 leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-white/70">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background text-center border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Start Planning Your Stay</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Book now and unlock exclusive packages, early check-in privileges, and complimentary dining rewards.
          </p>
          <button
            onClick={() => navigate('/branches')}
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition shadow-lg shadow-primary/20 text-base cursor-pointer"
          >
            Explore Our Branches
          </button>
        </div>
      </section>
    </Layout>
  )
}
