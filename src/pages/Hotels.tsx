import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Star, Heart, Sliders, MapPin, Search } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { useFavorites } from '../context/FavoritesContext'
import { motion } from 'framer-motion'

export default function Hotels() {
  const navigate = useNavigate()
  const { hotels } = useApp()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [searchParams] = useSearchParams()

  const initialDestination = searchParams.get('destination') || ''

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialDestination)
  const [filters, setFilters] = useState({
    minRating: 0,
    sortBy: 'featured',
  })

  const filteredBranches = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.country.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRating = hotel.rating >= filters.minRating
      return matchesSearch && matchesRating
    })

    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0))
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0))
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [hotels, searchQuery, filters])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">Our Branches</h1>
            <p className="text-muted-foreground">Discover luxury hotel branches in premier destinations</p>
          </div>
          <p className="text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-xl self-start">
            Showing {filteredBranches.length} locations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              mobileFiltersOpen ? 'block' : 'hidden'
            } lg:block bg-card rounded-xl p-6 border border-border h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sliders size={18} className="text-primary" />
                Filter Branches
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="lg:hidden text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Search Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City, country or name..."
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Starting Price: Low to High</option>
                <option value="price-high">Starting Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery('')
                setFilters({ minRating: 0, sortBy: 'featured' })
              }}
              className="w-full text-xs font-semibold py-2.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Branches Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 mb-6 px-4 py-3 bg-card border border-border rounded-xl font-semibold text-sm"
            >
              <Sliders size={18} />
              Filter & Sort
            </button>

            {filteredBranches.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-border">
                <p className="text-lg font-semibold text-muted-foreground">No branches found matching your search</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({ minRating: 0, sortBy: 'featured' })
                  }}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBranches.map((hotel, idx) => {
                  const availableRoomsCount = hotel.rooms.filter((r) => r.available).length

                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-56 bg-muted overflow-hidden">
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
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                          {hotel.city.toUpperCase()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition leading-tight mb-2">
                            {hotel.name}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                            <MapPin size={12} className="text-primary/70 shrink-0" />
                            {hotel.address}
                          </p>

                          <div className="flex items-center gap-2 mb-4 text-xs font-semibold">
                            <div className="flex gap-0.5 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < hotel.rating ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                            <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-auto">
                          <div className="flex items-center justify-between mb-4 text-xs font-medium">
                            <span className="text-muted-foreground">Available Rooms:</span>
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              availableRoomsCount > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                            }`}>
                              {availableRoomsCount} {availableRoomsCount === 1 ? 'room' : 'rooms'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase leading-none">Starting from</p>
                              <p className="text-xl font-black text-primary mt-1">${hotel.pricePerNight || 350}</p>
                            </div>
                            <button
                              onClick={() => navigate(`/branches/${hotel.id}`)}
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/95 text-xs transition cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
