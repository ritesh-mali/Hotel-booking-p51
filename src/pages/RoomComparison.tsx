import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Layout from '../components/layout/Layout'
import { GitCompare, Check, X, ArrowRight } from 'lucide-react'

export default function RoomComparison() {
  const { hotels } = useApp()
  const navigate = useNavigate()

  // Flatten all rooms across all hotels
  const allRooms = useMemo(() => {
    return hotels.flatMap((hotel) =>
      hotel.rooms.map((room) => ({
        ...room,
        branchId: hotel.id,
        branchName: hotel.name,
        city: hotel.city,
      }))
    ).slice(0, 5) // Compare first 5 rooms as a comparison set
  }, [hotels])

  const amenitiesList = [
    'King bed',
    'Free WiFi',
    'Mini bar',
    'Marble bathroom',
    'Sea view',
    'Eiffel Tower view',
    'Central Park view',
    'Desert view',
    'Jacuzzi',
    'Butler service',
    'Kitchenette',
    'Resort access',
    'Private terrace',
  ]

  const hasAmenity = (roomAmenities: string[], amenity: string) => {
    return roomAmenities.some(
      (a) => a.toLowerCase().includes(amenity.toLowerCase())
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black mb-2 flex items-center justify-center md:justify-start gap-3">
            <GitCompare className="text-primary animate-pulse" size={32} />
            Room Comparison
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm mt-1">
            Compare facilities, capacity, and pricing side-by-side to choose the perfect space for your stay.
          </p>
        </div>

        {allRooms.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground font-semibold">No rooms are currently available to compare.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="p-6 text-sm font-bold text-muted-foreground uppercase min-w-[200px]">Features</th>
                    {allRooms.map((room) => (
                      <th key={room.id} className="p-6 min-w-[220px] text-center border-l border-border">
                        <div className="flex flex-col items-center">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-36 h-24 object-cover rounded-lg shadow-md mb-3"
                          />
                          <h3 className="font-extrabold text-sm text-foreground leading-tight">{room.name}</h3>
                          <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">
                            {room.branchName}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-border hover:bg-secondary/10">
                    <td className="p-4 text-sm font-bold text-foreground">Price Per Night</td>
                    {allRooms.map((room) => (
                      <td key={room.id} className="p-4 text-center border-l border-border font-extrabold text-primary text-lg">
                        ${room.price}
                      </td>
                    ))}
                  </tr>

                  {/* Type */}
                  <tr className="border-b border-border hover:bg-secondary/10">
                    <td className="p-4 text-sm font-bold text-foreground">Room Type</td>
                    {allRooms.map((room) => (
                      <td key={room.id} className="p-4 text-center border-l border-border text-xs font-semibold uppercase text-muted-foreground">
                        {room.type}
                      </td>
                    ))}
                  </tr>

                  {/* Capacity */}
                  <tr className="border-b border-border hover:bg-secondary/10">
                    <td className="p-4 text-sm font-bold text-foreground">Max Guests</td>
                    {allRooms.map((room) => (
                      <td key={room.id} className="p-4 text-center border-l border-border text-sm font-semibold">
                        {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                      </td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr className="border-b border-border hover:bg-secondary/10">
                    <td className="p-4 text-sm font-bold text-foreground">Availability</td>
                    {allRooms.map((room) => (
                      <td key={room.id} className="p-4 text-center border-l border-border text-xs font-bold">
                        <span className={`px-2 py-0.5 rounded ${
                          room.available ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                        }`}>
                          {room.available ? 'Available' : 'Booked'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Comparison Amenities */}
                  {amenitiesList.map((amenity) => (
                    <tr key={amenity} className="border-b border-border hover:bg-secondary/10">
                      <td className="p-4 text-sm font-semibold text-muted-foreground">{amenity}</td>
                      {allRooms.map((room) => {
                        const hasIt = hasAmenity(room.amenities, amenity) || hasAmenity(hotels.find(h => h.id === room.branchId)?.amenities || [], amenity)
                        return (
                          <td key={room.id} className="p-4 text-center border-l border-border">
                            {hasIt ? (
                              <Check className="mx-auto text-green-600 dark:text-green-400" size={18} />
                            ) : (
                              <X className="mx-auto text-muted-foreground/35" size={16} />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}

                  {/* Actions */}
                  <tr className="hover:bg-secondary/10">
                    <td className="p-6 text-sm font-bold text-foreground">Action</td>
                    {allRooms.map((room) => (
                      <td key={room.id} className="p-6 text-center border-l border-border">
                        <button
                          onClick={() => {
                            if (room.available) {
                              navigate(`/booking/${room.branchId}/${room.id}`)
                            } else {
                              alert('This room is currently unavailable.')
                            }
                          }}
                          disabled={!room.available}
                          className={`w-full py-2 px-4 rounded-lg font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            room.available
                              ? 'bg-primary text-primary-foreground hover:bg-primary/95'
                              : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                          }`}
                        >
                          Book Now
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
