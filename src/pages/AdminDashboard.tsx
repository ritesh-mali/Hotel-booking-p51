import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LayoutDashboard, Hotel, Bed, Bookmark, CreditCard, BarChart3, LogOut, Plus, Edit, Trash2, CheckCircle2, XCircle, Eye, ShieldAlert, Download } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useApp, Booking, Payment } from '../context/AppContext'
import { Modal } from '../../components/ui/Modal'
import { Room, Hotel as HotelType } from '../types/hotel'

export default function AdminDashboard() {
  const { user, logout, isAuthenticated } = useAuth()
  const {
    hotels,
    bookings,
    payments,
    addHotel,
    updateHotel,
    deleteHotel,
    addRoom,
    updateRoom,
    deleteRoom,
    updateBookingStatus,
    cancelBooking,
  } = useApp()

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard')

  // Modals visibility states
  const [branchModalOpen, setBranchModalOpen] = useState(false)
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  
  // Selected items for Edit/Delete
  const [editingBranch, setEditingBranch] = useState<HotelType | null>(null)
  const [editingRoom, setEditingRoom] = useState<{ hotelId: string; room: Room } | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Form states
  const [branchForm, setBranchForm] = useState({
    name: '',
    city: '',
    country: '',
    address: '',
    description: '',
    amenities: '',
    image: '',
  })

  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    name: '',
    type: 'standard' as Room['type'],
    capacity: 2,
    price: 150,
    amenities: '',
    image: '',
    available: true,
  })

  // Pagination states
  const [branchPage, setBranchPage] = useState(1)
  const [roomPage, setRoomPage] = useState(1)
  const [bookingPage, setBookingPage] = useState(1)
  const itemsPerPage = 5

  // Security guard
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <ShieldAlert className="mx-auto text-destructive animate-bounce" size={64} />
          <h1 className="text-4xl font-black text-destructive">Unauthorized Access</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You must log in with central administrator credentials to access this system panel.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 font-semibold"
          >
            Go to Admin Login
          </button>
        </div>
      </Layout>
    )
  }

  // 1. Dashboard summary stats calculations
  const totalBranches = hotels.length
  const totalRooms = hotels.reduce((sum, h) => sum + h.rooms.length, 0)
  const totalBookingsCount = bookings.length
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

  // Dynamic Chart calculations
  const monthlyData = [
    { name: 'Jan', bookings: 15, revenue: 15000, occupancy: 42 },
    { name: 'Feb', bookings: 22, revenue: 25000, occupancy: 49 },
    { name: 'Mar', bookings: 35, revenue: 38000, occupancy: 58 },
    { name: 'Apr', bookings: 42, revenue: 45000, occupancy: 63 },
    { name: 'May', bookings: 58, revenue: 62000, occupancy: 72 },
    { name: 'Jun', bookings: totalBookingsCount, revenue: totalRevenue, occupancy: 81 },
  ]

  // Pie chart data for room types share
  const roomTypesShare = useMemo(() => {
    const counts = { standard: 0, deluxe: 0, suite: 0, family: 0 }
    hotels.flatMap(h => h.rooms).forEach(r => {
      if (counts[r.type] !== undefined) counts[r.type]++
    })
    return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value }))
  }, [hotels])

  const COLORS = ['#0f4c81', '#1f77b4', '#aec7e8', '#ff7f0e']

  // 2. Tabulations & Lists with paginations
  const paginatedBranches = useMemo(() => {
    const startIndex = (branchPage - 1) * itemsPerPage
    return hotels.slice(startIndex, startIndex + itemsPerPage)
  }, [hotels, branchPage])

  const allRooms = useMemo(() => {
    return hotels.flatMap(h => h.rooms.map(r => ({ ...r, branchName: h.name, branchId: h.id })))
  }, [hotels])

  const paginatedRooms = useMemo(() => {
    const startIndex = (roomPage - 1) * itemsPerPage
    return allRooms.slice(startIndex, startIndex + itemsPerPage)
  }, [allRooms, roomPage])

  const paginatedBookings = useMemo(() => {
    const startIndex = (bookingPage - 1) * itemsPerPage
    return bookings.slice(startIndex, startIndex + itemsPerPage)
  }, [bookings, bookingPage])

  // 3. Form Operations
  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amenitiesArr = branchForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
    const imgUrl = branchForm.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'

    if (editingBranch) {
      updateHotel(editingBranch.id, {
        name: branchForm.name,
        city: branchForm.city,
        country: branchForm.country,
        address: branchForm.address,
        description: branchForm.description,
        amenities: amenitiesArr,
        image: imgUrl,
      })
      setEditingBranch(null)
    } else {
      addHotel({
        name: branchForm.name,
        city: branchForm.city,
        country: branchForm.country,
        address: branchForm.address,
        description: branchForm.description,
        amenities: amenitiesArr,
        image: imgUrl,
      })
    }

    setBranchForm({ name: '', city: '', country: '', address: '', description: '', amenities: '', image: '' })
    setBranchModalOpen(false)
  }

  const handleBranchEdit = (branch: HotelType) => {
    setEditingBranch(branch)
    setBranchForm({
      name: branch.name,
      city: branch.city,
      country: branch.country,
      address: branch.address,
      description: branch.description,
      amenities: branch.amenities.join(', '),
      image: branch.image,
    })
    setBranchModalOpen(true)
  }

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amenitiesArr = roomForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
    const imgUrl = roomForm.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'

    if (editingRoom) {
      updateRoom(editingRoom.hotelId, editingRoom.room.id, {
        name: roomForm.name,
        type: roomForm.type,
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
        amenities: amenitiesArr,
        image: imgUrl,
        available: roomForm.available,
      })
      setEditingRoom(null)
    } else {
      addRoom(roomForm.hotelId, {
        name: roomForm.name,
        type: roomForm.type,
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
        amenities: amenitiesArr,
        image: imgUrl,
        available: roomForm.available,
      })
    }

    setRoomForm({ hotelId: '', name: '', type: 'standard', capacity: 2, price: 150, amenities: '', image: '', available: true })
    setRoomModalOpen(false)
  }

  const handleRoomEdit = (hotelId: string, room: Room) => {
    setEditingRoom({ hotelId, room })
    setRoomForm({
      hotelId,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      amenities: room.amenities.join(', '),
      image: room.image,
      available: room.available,
    })
    setRoomModalOpen(true)
  }

  const handleReportDownload = (reportType: string) => {
    alert(`Compiling ${reportType} Report. Simulated download complete. saved as Aura_Resorts_${reportType}_Report.pdf`)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 pb-5 border-b border-border text-primary font-bold">
                <ShieldAlert size={22} />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black uppercase text-foreground">Global Admin</span>
                  <span className="text-[10px] text-muted-foreground mt-1">AURA HOTEL BRAND</span>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
                  { id: 'branches', label: 'Manage Branches', icon: Hotel },
                  { id: 'rooms', label: 'Manage Rooms', icon: Bed },
                  { id: 'bookings', label: 'Manage Bookings', icon: Bookmark },
                  { id: 'payments', label: 'Payments Ledger', icon: CreditCard },
                  { id: 'reports', label: 'Global Reports', icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition font-bold text-[10px] uppercase cursor-pointer"
              >
                <LogOut size={14} />
                Exit Master Panel
              </button>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-9 space-y-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-black">System Statistics</h1>
                  <p className="text-muted-foreground text-xs">Real-time overview of hotels bookings and cash reserves.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Branches', value: totalBranches, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                    { label: 'Total Rooms', value: totalRooms, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                    { label: 'Total Bookings', value: totalBookingsCount, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                    { label: 'Gross Revenue', value: `$${totalRevenue}`, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border bg-card shadow-sm ${stat.color}`}>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">{stat.label}</p>
                      <p className="text-2xl font-black mt-2 text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recharts Graphics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bookings & revenue growth chart */}
                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-foreground">Monthly Bookings Performance</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#0f4c81" name="Bookings Completed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-foreground">Revenue Expansion ($)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} name="Gross Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart Room Shares */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center md:col-span-1">
                    <h3 className="text-sm font-bold text-foreground mb-4 text-center">Room Category Share</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={roomTypesShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {roomTypesShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 justify-center mt-4 text-[10px] font-bold">
                      {roomTypesShare.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top branches ledger table */}
                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-foreground">Branch Locations Overview</h3>
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border pb-2 text-muted-foreground font-bold">
                            <th className="pb-2">Location Name</th>
                            <th className="pb-2">City</th>
                            <th className="pb-2">Rooms Count</th>
                            <th className="pb-2">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hotels.slice(0, 4).map((h) => (
                            <tr key={h.id} className="border-b border-border py-2 text-muted-foreground font-semibold">
                              <td className="py-2 text-foreground font-bold">{h.name}</td>
                              <td className="py-2">{h.city}</td>
                              <td className="py-2">{h.rooms.length} rooms</td>
                              <td className="py-2 text-amber-500 font-bold">★ {h.rating}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Branches Tab */}
            {activeTab === 'branches' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Manage Branches</h2>
                    <p className="text-muted-foreground text-xs">Register edit or delete brand branches globally.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBranch(null)
                      setBranchForm({ name: '', city: '', country: '', address: '', description: '', amenities: '', image: '' })
                      setBranchModalOpen(true)
                    }}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold rounded-lg hover:bg-primary/95 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Branch
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-border rounded-lg text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-secondary/45 border-b border-border font-bold text-muted-foreground">
                        <th className="p-3">Branch ID</th>
                        <th className="p-3">Branch Name</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBranches.map((branch) => (
                        <tr key={branch.id} className="border-b border-border font-medium text-muted-foreground hover:bg-secondary/10">
                          <td className="p-3 font-bold text-primary">{branch.id}</td>
                          <td className="p-3 text-foreground font-bold">{branch.name}</td>
                          <td className="p-3">{branch.city}, {branch.country}</td>
                          <td className="p-3 text-amber-500 font-bold">★ {branch.rating}</td>
                          <td className="p-3 text-center space-x-3">
                            <button onClick={() => handleBranchEdit(branch)} className="text-primary hover:underline font-bold">
                              Edit
                            </button>
                            <button onClick={() => {
                              if (confirm('Delete branch and its rooms?')) deleteHotel(branch.id)
                            }} className="text-destructive hover:underline font-bold">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {Math.ceil(hotels.length / itemsPerPage) > 1 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Showing Page {branchPage}</span>
                    <div className="flex gap-2">
                      <button disabled={branchPage === 1} onClick={() => setBranchPage(branchPage - 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Prev</button>
                      <button disabled={branchPage === Math.ceil(hotels.length / itemsPerPage)} onClick={() => setBranchPage(branchPage + 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manage Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Manage Rooms</h2>
                    <p className="text-muted-foreground text-xs">Manage rooms categorizations across all locations.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRoom(null)
                      setRoomForm({ hotelId: hotels[0]?.id || '', name: '', type: 'standard', capacity: 2, price: 150, amenities: '', image: '', available: true })
                      setRoomModalOpen(true)
                    }}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold rounded-lg hover:bg-primary/95 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Room
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-border rounded-lg text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-secondary/45 border-b border-border font-bold text-muted-foreground">
                        <th className="p-3">Room ID</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Category Name</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRooms.map((rm) => (
                        <tr key={rm.id} className="border-b border-border font-medium text-muted-foreground hover:bg-secondary/10">
                          <td className="p-3 font-bold text-primary">{rm.id}</td>
                          <td className="p-3 text-foreground font-bold">{rm.branchName}</td>
                          <td className="p-3 font-semibold text-foreground">{rm.name} <span className="text-[9px] uppercase tracking-wider text-muted-foreground">({rm.type})</span></td>
                          <td className="p-3 font-extrabold text-primary">${rm.price}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              rm.available ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                            }`}>
                              {rm.available ? 'AVAILABLE' : 'BOOKED'}
                            </span>
                          </td>
                          <td className="p-3 text-center space-x-3">
                            <button onClick={() => handleRoomEdit(rm.branchId, rm as any)} className="text-primary hover:underline font-bold">
                              Edit
                            </button>
                            <button onClick={() => {
                              if (confirm('Delete room type?')) deleteRoom(rm.branchId, rm.id)
                            }} className="text-destructive hover:underline font-bold">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {Math.ceil(allRooms.length / itemsPerPage) > 1 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Showing Page {roomPage}</span>
                    <div className="flex gap-2">
                      <button disabled={roomPage === 1} onClick={() => setRoomPage(roomPage - 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Prev</button>
                      <button disabled={roomPage === Math.ceil(allRooms.length / itemsPerPage)} onClick={() => setRoomPage(roomPage + 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manage Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Manage Bookings</h2>
                  <p className="text-muted-foreground text-xs">Approve confirm or cancel reservations dynamically.</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-border rounded-lg text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-secondary/45 border-b border-border font-bold text-muted-foreground">
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Branch Location</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBookings.map((b) => {
                        const branch = hotels.find((h) => h.id === b.hotelId)
                        return (
                          <tr key={b.id} className="border-b border-border font-medium text-muted-foreground hover:bg-secondary/10">
                            <td className="p-3 font-bold text-primary">{b.id}</td>
                            <td className="p-3">
                              <p className="font-bold text-foreground leading-none">{b.userName}</p>
                              <span className="text-[10px] text-muted-foreground mt-1 block">{b.userEmail}</span>
                            </td>
                            <td className="p-3 text-foreground font-semibold">{branch?.name}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                b.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300'
                              }`}>
                                {b.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 text-center space-x-3">
                              <button
                                onClick={() => {
                                  setSelectedBooking(b)
                                  setBookingModalOpen(true)
                                }}
                                className="text-primary hover:underline font-bold"
                              >
                                View Details
                              </button>
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() => cancelBooking(b.id)}
                                  className="text-destructive hover:underline font-bold"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {Math.ceil(bookings.length / itemsPerPage) > 1 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Showing Page {bookingPage}</span>
                    <div className="flex gap-2">
                      <button disabled={bookingPage === 1} onClick={() => setBookingPage(bookingPage - 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Prev</button>
                      <button disabled={bookingPage === Math.ceil(bookings.length / itemsPerPage)} onClick={() => setBookingPage(bookingPage + 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payments Ledger Tab */}
            {activeTab === 'payments' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Payments Ledger</h2>
                  <p className="text-muted-foreground text-xs">Audit ledger recording gross brand deposits.</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-border rounded-lg text-xs font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-secondary/45 border-b border-border font-bold text-muted-foreground">
                        <th className="p-3">Payment ID</th>
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Billing Gateway</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((pay) => (
                        <tr key={pay.id} className="border-b border-border font-medium text-muted-foreground hover:bg-secondary/10">
                          <td className="p-3 font-bold text-foreground">{pay.id}</td>
                          <td className="p-3 font-bold text-primary">{pay.bookingId}</td>
                          <td className="p-3 font-extrabold text-foreground">${pay.amount}</td>
                          <td className="p-3">{pay.method}</td>
                          <td className="p-3">
                            <span className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 px-2 py-0.5 rounded text-[9px] font-bold">
                              {pay.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Global Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Global Reports</h2>
                  <p className="text-muted-foreground text-xs">Download or review brand expansion indicators.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                  {[
                    { type: 'Occupancy', desc: 'Occupancy percentages across branches', icon: Hotel },
                    { type: 'Booking', desc: 'Total reservation statistics ledger', icon: Bookmark },
                    { type: 'Revenue', desc: 'Audit statement of brand revenue accounts', icon: CreditCard },
                  ].map((rep, idx) => (
                    <div key={idx} className="p-5 border border-border rounded-xl bg-secondary/25 space-y-4 hover:shadow-md transition">
                      <div className="flex items-center gap-2">
                        <rep.icon className="text-primary" size={20} />
                        <h4 className="font-bold text-sm text-foreground">{rep.type} Report</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal">{rep.desc}</p>
                      <button
                        onClick={() => handleReportDownload(rep.type)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 text-xs font-bold cursor-pointer transition shadow-sm"
                      >
                        <Download size={14} /> Download Report
                      </button>
                    </div>
                  ))}
                </div>

                {/* Additional chart visual */}
                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-foreground mb-4">Occupancy Ratio Chart</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Line type="monotone" dataKey="occupancy" stroke="#0f4c81" strokeWidth={3} name="Occupancy %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Branch Modal */}
      <Modal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        title={editingBranch ? 'Edit Branch' : 'Add Brand Branch'}
      >
        <form onSubmit={handleBranchSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Branch Name</label>
            <input
              type="text"
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
              placeholder="E.g. Aura Palace Paris"
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">City</label>
              <input
                type="text"
                value={branchForm.city}
                onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                placeholder="Paris"
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">Country</label>
              <input
                type="text"
                value={branchForm.country}
                onChange={(e) => setBranchForm({ ...branchForm, country: e.target.value })}
                placeholder="France"
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Full Address</label>
            <input
              type="text"
              value={branchForm.address}
              onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
              placeholder="75 Rue de Rivoli, Paris"
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Branch Description</label>
            <textarea
              value={branchForm.description}
              onChange={(e) => setBranchForm({ ...branchForm, description: e.target.value })}
              placeholder="Describe the branch..."
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none resize-none"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Amenities (Comma separated)</label>
            <input
              type="text"
              value={branchForm.amenities}
              onChange={(e) => setBranchForm({ ...branchForm, amenities: e.target.value })}
              placeholder="Spa, Swimming Pool, Fine Dining, Free WiFi"
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Cover Image URL (Optional)</label>
            <input
              type="text"
              value={branchForm.image}
              onChange={(e) => setBranchForm({ ...branchForm, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg mt-4 cursor-pointer"
          >
            {editingBranch ? 'Save Branch Details' : 'Register Branch'}
          </button>
        </form>
      </Modal>

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        title={editingRoom ? 'Edit Room Type' : 'Add Room Category'}
      >
        <form onSubmit={handleRoomSubmit} className="space-y-4 text-xs font-semibold">
          {!editingRoom && (
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">Select Branch</label>
              <select
                value={roomForm.hotelId}
                onChange={(e) => setRoomForm({ ...roomForm, hotelId: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              >
                <option value="">-- Choose Branch --</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Category Name</label>
            <input
              type="text"
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
              placeholder="E.g. Penthouse Suite"
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">Room Type</label>
              <select
                value={roomForm.type}
                onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">Capacity (Max guests)</label>
              <input
                type="number"
                value={roomForm.capacity}
                onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">Price Per Night ($)</label>
              <input
                type="number"
                value={roomForm.price}
                onChange={(e) => setRoomForm({ ...roomForm, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground uppercase mb-1.5">Initial Availability</label>
              <select
                value={roomForm.available ? 'yes' : 'no'}
                onChange={(e) => setRoomForm({ ...roomForm, available: e.target.value === 'yes' })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              >
                <option value="yes">Available</option>
                <option value="no">Occupied / Out of service</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Room Features / Amenities (Comma separated)</label>
            <input
              type="text"
              value={roomForm.amenities}
              onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
              placeholder="King bed, Jacuzzi, Balcony, Mini bar"
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Cover Image URL (Optional)</label>
            <input
              type="text"
              value={roomForm.image}
              onChange={(e) => setRoomForm({ ...roomForm, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg mt-4 cursor-pointer"
          >
            {editingRoom ? 'Save Room Category' : 'Register Room Category'}
          </button>
        </form>
      </Modal>

      {/* View Booking Details Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Reservation Details Summary"
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs font-semibold text-muted-foreground">
            <div className="flex justify-between items-center text-sm border-b border-border pb-2">
              <span className="font-bold text-foreground">Booking ID:</span>
              <span className="text-primary font-black">{selectedBooking.id}</span>
            </div>

            <div className="space-y-2 text-foreground">
              <p><span className="text-muted-foreground font-medium uppercase">Customer:</span> {selectedBooking.userName} ({selectedBooking.userEmail})</p>
              <p><span className="text-muted-foreground font-medium uppercase">Branch Location:</span> {hotels.find(h => h.id === selectedBooking.hotelId)?.name}</p>
              <p><span className="text-muted-foreground font-medium uppercase">Room Category:</span> {hotels.find(h => h.id === selectedBooking.hotelId)?.rooms.find(rm => rm.id === selectedBooking.roomId)?.name}</p>
              <p><span className="text-muted-foreground font-medium uppercase">Stay Duration:</span> {selectedBooking.checkInDate} to {selectedBooking.checkOutDate}</p>
              <p><span className="text-muted-foreground font-medium uppercase">Guests count:</span> {selectedBooking.guests} guests</p>
              <p><span className="text-muted-foreground font-medium uppercase">Paid amount:</span> ${selectedBooking.totalPrice}</p>
              <p><span className="text-muted-foreground font-medium uppercase">Special Requests:</span> {selectedBooking.specialRequests || 'None'}</p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border mt-4">
              {selectedBooking.status === 'pending' && (
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'confirmed')
                    setBookingModalOpen(false)
                  }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition cursor-pointer text-center"
                >
                  Approve / Confirm
                </button>
              )}
              {selectedBooking.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    cancelBooking(selectedBooking.id)
                    setBookingModalOpen(false)
                  }}
                  className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/95 font-bold transition cursor-pointer text-center"
                >
                  Cancel Reservation
                </button>
              )}
              <button
                onClick={() => setBookingModalOpen(false)}
                className="flex-1 py-2 border border-border hover:bg-secondary rounded-lg font-bold transition cursor-pointer text-center text-foreground"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
