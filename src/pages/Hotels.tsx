import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Heart, Sliders } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { hotels } from '../data/hotels'
import { useFavorites } from '../context/FavoritesContext'
import { motion } from 'framer-motion'

export default function Hotels() {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 3000,
    minRating: 0,
    sortBy: 'featured',
  })

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = hotel.pricePerNight >= filters.minPrice && hotel.pricePerNight <= filters.maxPrice
      const matchesRating = hotel.rating >= filters.minRating
      return matchesSearch && matchesPrice && matchesRating
    })

    if (filters.sortBy === 'price-low') result.sort((a, b) => a.pricePerNight - b.pricePerNight)
    else if (filters.sortBy === 'price-high') result.sort((a, b) => b.pricePerNight - a.pricePerNight)
    else if (filters.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)

    return result
  }, [searchQuery, filters])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Hotels</h1>
          <p className="text-muted-foreground">Discover {filteredHotels.length} luxury hotels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              mobileFiltersOpen ? 'block' : 'hidden'
            } lg:block bg-card rounded-xl p-6 h-fit sticky top-20`}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sliders size={20} />
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hotel or city..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">${filters.minPrice} - ${filters.maxPrice}</p>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full lg:hidden bg-primary text-primary-foreground py-2 rounded-lg"
            >
              Apply Filters
            </button>
          </div>

          {/* Hotels Grid */}
          <div className="lg:col-span-3">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No hotels found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel, idx) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer h-full flex flex-col">
                      {/* Image */}
                      <div
                        className="relative h-64 overflow-hidden bg-muted"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                      >
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
                      <div
                        className="p-6 flex-grow flex flex-col"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                      >
                        <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {hotel.city}, {hotel.country}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-auto">
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

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>

                        {/* Price and Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">From</p>
                            <p className="text-2xl font-bold text-primary">${hotel.pricePerNight}</p>
                          </div>
                          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
