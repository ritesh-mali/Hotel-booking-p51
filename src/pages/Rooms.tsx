import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Layout from '../components/layout/Layout'
import { Bed, Users, Filter, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Rooms() {
  const { hotels } = useApp()
  const navigate = useNavigate()
  
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  // Flatten rooms and append branch info
  const allRooms = useMemo(() => {
    return hotels.flatMap((hotel) =>
      hotel.rooms.map((room) => ({
        ...room,
        branchId: hotel.id,
        branchName: hotel.name,
        city: hotel.city,
      }))
    )
  }, [hotels])

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      const matchBranch = selectedBranch === 'all' || room.branchId === selectedBranch
      const matchType = selectedType === 'all' || room.type === selectedType
      const matchAvailability = !onlyAvailable || room.available
      return matchBranch && matchType && matchAvailability
    })
  }, [allRooms, selectedBranch, selectedType, onlyAvailable])

  const branchList = useMemo(() => {
    return hotels.map((h) => ({ id: h.id, name: h.name }))
  }, [hotels])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">Our Rooms</h1>
            <p className="text-muted-foreground">Find the perfect room or suite tailored to your needs</p>
          </div>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-3.5 py-2 rounded-xl self-start">
            Showing {filteredRooms.length} Room Types
          </span>
        </div>

        {/* Filter Widget */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-sm font-bold text-primary uppercase">
            <Filter size={16} />
            <span>Filter Rooms & Suites</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Filter by Branch */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Filter by Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="all">All Branches</option>
                {branchList.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Filter by Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="family">Family</option>
              </select>
            </div>

            {/* Availability Checkbox */}
            <div className="pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded w-4 h-4 text-primary"
                />
                <span className="text-muted-foreground">Show Only Available Rooms</span>
              </label>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <p className="text-lg font-semibold text-muted-foreground">No rooms match your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedBranch('all')
                setSelectedType('all')
                setOnlyAvailable(false)
              }}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full"
              >
                <div>
                  {/* Room Image */}
                  <div className="relative h-56 bg-muted overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                      {room.type.toUpperCase()}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm ${
                        room.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {room.available ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1.5 leading-snug group-hover:text-primary transition">{room.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin size={12} className="text-primary/70 shrink-0" />
                      {room.branchName} ({room.city})
                    </p>

                    <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground">
                      <Users size={14} className="text-primary/70" />
                      <span>Accommodates up to {room.capacity} guests</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="text-[10px] bg-secondary px-2 py-0.5 rounded font-semibold text-muted-foreground">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Book now footer */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/10 mt-auto">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase leading-none">Rate per night</p>
                    <p className="text-2xl font-black text-primary mt-1">${room.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (room.available) {
                        navigate(`/booking/${room.branchId}/${room.id}`)
                      } else {
                        alert('This room is currently unavailable.')
                      }
                    }}
                    disabled={!room.available}
                    className={`px-5 py-2 rounded-lg font-bold text-xs shadow transition cursor-pointer ${
                      room.available
                        ? 'bg-primary text-primary-foreground hover:bg-primary/95'
                        : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                    }`}
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
