import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/layout/Layout'
import { hotels } from '../data/hotels'
import { BookOpen, Users, TrendingUp, Star, Zap } from 'lucide-react'

export default function AdminDashboard() {
  const totalHotels = hotels.length
  const totalRooms = hotels.reduce((sum, h) => sum + h.rooms.length, 0)
  const avgRating = (hotels.reduce((sum, h) => sum + h.rating, 0) / totalHotels).toFixed(2)
  const totalBookings = Math.floor(Math.random() * 500) + 100

  const monthlyData = [
    { month: 'Jan', bookings: 120, revenue: 12000 },
    { month: 'Feb', bookings: 145, revenue: 14500 },
    { month: 'Mar', bookings: 180, revenue: 18000 },
    { month: 'Apr', bookings: 165, revenue: 16500 },
    { month: 'May', bookings: 220, revenue: 22000 },
    { month: 'Jun', bookings: 280, revenue: 28000 },
  ]

  const stats = [
    { label: 'Total Bookings', value: totalBookings, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Hotels', value: totalHotels, icon: Zap, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Rooms', value: totalRooms, icon: Users, color: 'from-green-500 to-green-600' },
    { label: 'Avg Rating', value: avgRating, icon: Star, color: 'from-yellow-500 to-yellow-600' },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white/80">{stat.label}</h3>
                  <Icon size={24} className="opacity-80" />
                </div>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bookings Chart */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-6">Monthly Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#f59e0b" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-6">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" name="Revenue ($)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotels Table */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-6">Hotels Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Hotel Name</th>
                  <th className="text-left py-3 px-4 font-semibold">City</th>
                  <th className="text-left py-3 px-4 font-semibold">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold">Rooms</th>
                  <th className="text-left py-3 px-4 font-semibold">Price/Night</th>
                </tr>
              </thead>
              <tbody>
                {hotels.slice(0, 8).map((hotel) => (
                  <tr key={hotel.id} className="border-b border-border hover:bg-muted transition">
                    <td className="py-3 px-4 font-medium">{hotel.name}</td>
                    <td className="py-3 px-4">{hotel.city}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < hotel.rating ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">{hotel.rooms.length}</td>
                    <td className="py-3 px-4 font-bold text-primary">${hotel.pricePerNight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
