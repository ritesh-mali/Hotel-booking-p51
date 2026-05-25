import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, Search, Star, Heart, ArrowRight, ChevronDown } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { hotels } from '../data/hotels'
import { useFavorites } from '../context/FavoritesContext'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Home() {
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/hotels?destination=${destination}`)
  }

  const featuredHotels = hotels.slice(0, 6)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'An unforgettable experience! The service was impeccable.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      rating: 5,
      comment: 'Luxury redefined. Every detail was perfect.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    {
      name: 'Emma Wilson',
      location: 'London, UK',
      rating: 5,
      comment: 'The best hotel experience of my life!',
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
        className="relative h-screen bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80')`,
        }}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-black/20"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center max-w-4xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Discover Luxury Redefined
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-8 text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Experience the world's most exclusive hotels and resorts
            </motion.p>

            {/* Search Widget */}
            <motion.form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Where to?"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Search Hotels
              </button>
            </motion.form>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-white" size={32} />
        </motion.div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="text-4xl font-bold mb-4" variants={itemVariants}>
              Featured Luxury Hotels
            </motion.h2>
            <motion.p className="text-xl text-muted-foreground" variants={itemVariants}>
              Explore our handpicked collection of the world's finest accommodations
            </motion.p>
          </motion.div>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="pb-12"
          >
            {featuredHotels.map((hotel) => (
              <SwiperSlide key={hotel.id}>
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                >
                  <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(hotel.id)
                        }}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition"
                      >
                        <Heart
                          size={20}
                          fill={isFavorite(hotel.id) ? 'currentColor' : 'none'}
                          color={isFavorite(hotel.id) ? 'currentColor' : 'currentColor'}
                        />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {hotel.city}, {hotel.country}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < hotel.rating ? '#f59e0b' : '#e5e7eb'}
                              color={i < hotel.rating ? '#f59e0b' : '#e5e7eb'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({hotel.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="text-2xl font-bold text-primary">${hotel.pricePerNight}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="text-4xl font-bold mb-4" variants={itemVariants}>
              What Our Guests Say
            </motion.h2>
          </motion.div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            autoplay={{ delay: 5000 }}
            className="pb-12"
          >
            {testimonials.map((testimonial, i) => (
              <SwiperSlide key={i}>
                <div className="bg-primary-foreground/10 rounded-xl p-8 backdrop-blur-sm border border-primary-foreground/20">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={20}
                        fill={j < testimonial.rating ? 'currentColor' : 'transparent'}
                        color="currentColor"
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-lg mb-6 italic">&ldquo;{testimonial.comment}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm opacity-80">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.h2 className="text-4xl font-bold mb-4" variants={itemVariants}>
              Ready to Experience Luxury?
            </motion.h2>
            <motion.p className="text-xl text-muted-foreground mb-8" variants={itemVariants}>
              Browse our collection of world-class hotels and book your dream stay today
            </motion.p>
            <motion.button
              onClick={() => navigate('/hotels')}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition inline-flex items-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              Explore All Hotels <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
