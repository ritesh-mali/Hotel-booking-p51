import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Bed, Bookmark, BarChart3, LogOut, ShieldAlert, Plus, AlertCircle } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Modal } from '../../components/ui/Modal'
import { Room } from '../types/hotel'

export default function ManagerDashboard() {
  const { user, logout, isAuthenticated } = useAuth()
  const { hotels, bookings, addRoom, updateRoom, deleteRoom, updateBookingStatus, cancelBooking } = useApp()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard')

  // Modals
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  // Form states
  const [roomForm, setRoomForm] = useState({
    name: '',
    type: 'standard' as Room['type'],
    capacity: 2,
    price: 150,
    amenities: '',
    image: '',
    available: true,
  })

  // Pagination
  const [roomPage, setRoomPage] = useState(1)
  const [bookingPage, setBookingPage] = useState(1)
  const itemsPerPage = 5

  // Security guard & branch resolution
  const branchId = user?.managedBranchId
  const branch = useMemo(() => hotels.find((h) => h.id === branchId), [hotels, branchId])

  if (!isAuthenticated || user?.role !== 'manager' || !branchId || !branch) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <ShieldAlert className="mx-auto text-destructive animate-bounce" size={64} />
          <h1 className="text-4xl font-black text-destructive">Unauthorized Operations Access</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You must log in with branch manager credentials to access this dashboard.
          </p>
          <button
            onClick={() => navigate('/manager/login')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 font-semibold"
          >
            Go to Manager Login
          </button>
        </div>
      </Layout>
    )
  }

  // 1. Calculations for this specific branch
  const branchRooms = branch.rooms
  const totalRooms = branchRooms.length
  const availableRooms = branchRooms.filter((r) => r.available).length
  const occupiedRooms = totalRooms - availableRooms
  const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  // Filter bookings for this branch
  const branchBookings = useMemo(() => {
    return bookings.filter((b) => b.hotelId === branchId)
  }, [bookings, branchId])

  const todayBookingsCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return branchBookings.filter((b) => b.checkInDate === today).length
  }, [branchBookings])

  // Paginations
  const paginatedRooms = useMemo(() => {
    const start = (roomPage - 1) * itemsPerPage
    return branchRooms.slice(start, start + itemsPerPage)
  }, [branchRooms, roomPage])

  const paginatedBookings = useMemo(() => {
    const start = (bookingPage - 1) * itemsPerPage
    return branchBookings.slice(start, start + itemsPerPage)
  }, [branchBookings, bookingPage])

  // Charts
  const occupancyData = [
    { name: 'Available', value: availableRooms },
    { name: 'Occupied', value: occupiedRooms },
  ]
  const COLORS = ['#22c55e', '#ef4444']

  const bookingsTrend = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 6 },
    { day: 'Fri', count: 8 },
    { day: 'Sat', count: todayBookingsCount },
  ]

  // Form submit
  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amenitiesArr = roomForm.amenities.split(',').map((s) => s.trim()).filter(Boolean)
    const imgUrl = roomForm.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'

    if (editingRoom) {
      updateRoom(branchId, editingRoom.id, {
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
      addRoom(branchId, {
        name: roomForm.name,
        type: roomForm.type,
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
        amenities: amenitiesArr,
        image: imgUrl,
        available: roomForm.available,
      })
    }

    setRoomForm({ name: '', type: 'standard', capacity: 2, price: 150, amenities: '', image: '', available: true })
    setRoomModalOpen(false)
  }

  const handleRoomEdit = (room: Room) => {
    setEditingRoom(room)
    setRoomForm({
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

  const handleToggleAvailability = (room: Room) => {
    updateRoom(branchId, room.id, { available: !room.available })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-6 shadow-sm sticky top-24">
              <div className="pb-5 border-b border-border">
                <span className="text-[10px] text-primary font-black uppercase tracking-wider">Branch Manager Console</span>
                <h3 className="font-extrabold text-base leading-tight mt-1 text-foreground">{branch.name}</h3>
                <span className="text-[10px] text-muted-foreground block mt-1">{branch.city}, {branch.country}</span>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
                  { id: 'rooms', label: 'Branch Rooms', icon: Bed },
                  { id: 'bookings', label: 'Branch Bookings', icon: Bookmark },
                  { id: 'occupancy', label: 'Occupancy Metrics', icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setRoomPage(1)
                        setBookingPage(1)
                      }}
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
                Sign Out of Branch
              </button>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9 space-y-8">
            {/* Dashboard summary Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-black">Branch Operations Overview</h1>
                  <p className="text-muted-foreground text-xs">Operational dashboard tracking room allocations and check-ins today.</p>
                </div>

                {/* Dashboard Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Rooms', value: totalRooms, color: 'border-slate-200' },
                    { label: 'Available Rooms', value: availableRooms, color: 'border-green-200 text-green-600 bg-green-50/40' },
                    { label: 'Occupied Rooms', value: occupiedRooms, color: 'border-red-200 text-red-600 bg-red-50/40' },
                    { label: "Today's check-ins", value: todayBookingsCount, color: 'border-amber-200 text-amber-600 bg-amber-50/40' },
                  ].map((card, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border bg-card shadow-sm ${card.color}`}>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">{card.label}</span>
                      <p className="text-2xl font-black mt-2 text-foreground">{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Occupancy quick indicators */}
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Occupancy Capacity Ratio</h3>
                    <p className="text-muted-foreground text-[10px]">Percentage share of blocked assets.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                      <span>Occupancy Percentage:</span>
                      <span className="text-primary">{occupancyPercentage}%</span>
                    </div>
                    <div className="w-full bg-secondary h-3.5 rounded-full overflow-hidden border border-border">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Today checkins chart */}
                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-foreground">Weekly Booking Actions</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={bookingsTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0f4c81" name="Reservations" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Room status Pie */}
                  <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-sm font-bold text-foreground mb-2">Room Allocation Share</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={55}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 justify-center mt-2 text-[10px] font-bold">
                      <span className="text-green-600 flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        Available ({availableRooms})
                      </span>
                      <span className="text-red-500 flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        Occupied ({occupiedRooms})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Manage Rooms</h2>
                    <p className="text-muted-foreground text-xs">Configure rooms, rates, and occupancy availability.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRoom(null)
                      setRoomForm({ name: '', type: 'standard', capacity: 2, price: 150, amenities: '', image: '', available: true })
                      setRoomModalOpen(true)
                    }}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold rounded-lg hover:bg-primary/95 transition cursor-pointer shadow-sm"
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
                        <th className="p-3">Category Name</th>
                        <th className="p-3">Rate/Night</th>
                        <th className="p-3">Capacity</th>
                        <th className="p-3">Allocation Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRooms.map((rm) => (
                        <tr key={rm.id} className="border-b border-border font-medium text-muted-foreground hover:bg-secondary/10">
                          <td className="p-3 font-bold text-primary">{rm.id}</td>
                          <td className="p-3 text-foreground font-bold">{rm.name} <span className="text-[9px] uppercase tracking-wider text-muted-foreground">({rm.type})</span></td>
                          <td className="p-3 font-extrabold text-foreground">${rm.price}</td>
                          <td className="p-3">{rm.capacity} Guests</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleAvailability(rm)}
                              className={`px-3 py-1 rounded text-[9px] font-bold cursor-pointer transition ${
                                rm.available
                                  ? 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                                  : 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                              }`}
                            >
                              {rm.available ? 'AVAILABLE' : 'OCCUPIED'}
                            </button>
                          </td>
                          <td className="p-3 text-center space-x-3">
                            <button onClick={() => handleRoomEdit(rm)} className="text-primary hover:underline font-bold">
                              Edit
                            </button>
                            <button onClick={() => {
                              if (confirm('Delete room?')) deleteRoom(branchId, rm.id)
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
                {Math.ceil(branchRooms.length / itemsPerPage) > 1 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Showing Page {roomPage}</span>
                    <div className="flex gap-2">
                      <button disabled={roomPage === 1} onClick={() => setRoomPage(roomPage - 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Prev</button>
                      <button disabled={roomPage === Math.ceil(branchRooms.length / itemsPerPage)} onClick={() => setRoomPage(roomPage + 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Branch Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Branch Bookings</h2>
                  <p className="text-muted-foreground text-xs">Reservation records and stays audits for {branch.name}.</p>
                </div>

                {branchBookings.length === 0 ? (
                  <div className="text-center py-16">
                    <Bookmark size={48} className="mx-auto text-muted-foreground mb-4 opacity-25" />
                    <p className="text-muted-foreground font-semibold">No reservations registered for this branch.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="overflow-x-auto border border-border rounded-lg text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-secondary/45 border-b border-border font-bold text-muted-foreground">
                            <th className="p-3">Booking ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Room Category</th>
                            <th className="p-3">Dates</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedBookings.map((b) => {
                            const r = branchRooms.find((rm) => rm.id === b.roomId)
                            return (
                              <tr key={b.id} className="border-b border-border font-medium text-muted-foreground hover:bg-secondary/10">
                                <td className="p-3 font-bold text-primary">{b.id}</td>
                                <td className="p-3">
                                  <p className="font-bold text-foreground leading-none">{b.userName}</p>
                                  <span className="text-[9px] text-muted-foreground mt-1 block">{b.userEmail}</span>
                                </td>
                                <td className="p-3 text-foreground font-bold">{r?.name}</td>
                                <td className="p-3">{b.checkInDate} to {b.checkOutDate}</td>
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
                                  {b.status === 'pending' && (
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                      className="text-green-600 hover:underline font-bold"
                                    >
                                      Approve
                                    </button>
                                  )}
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
                    {Math.ceil(branchBookings.length / itemsPerPage) > 1 && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-bold">Showing Page {bookingPage}</span>
                        <div className="flex gap-2">
                          <button disabled={bookingPage === 1} onClick={() => setBookingPage(bookingPage - 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Prev</button>
                          <button disabled={bookingPage === Math.ceil(branchBookings.length / itemsPerPage)} onClick={() => setBookingPage(bookingPage + 1)} className="px-3 py-1 bg-secondary rounded hover:bg-secondary/80 font-bold disabled:opacity-40">Next</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Occupancy Metrics Tab */}
            {activeTab === 'occupancy' && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Occupancy Metrics</h2>
                  <p className="text-muted-foreground text-xs">Detailed allocation analysis of branch rooms.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                  <div className="p-5 border border-border rounded-xl text-center space-y-2">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase leading-none">Occupancy Ratio</span>
                    <p className="text-3xl font-black text-primary">{occupancyPercentage}%</p>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border">
                      <div className="bg-primary h-full" style={{ width: `${occupancyPercentage}%` }} />
                    </div>
                  </div>

                  <div className="p-5 border border-border rounded-xl text-center space-y-2">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase leading-none">Available Rooms</span>
                    <p className="text-3xl font-black text-green-600">{availableRooms}</p>
                    <p className="text-[10px] text-muted-foreground">Ready for check-in</p>
                  </div>

                  <div className="p-5 border border-border rounded-xl text-center space-y-2">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase leading-none">Out of Service / Sold</span>
                    <p className="text-3xl font-black text-red-500">{occupiedRooms}</p>
                    <p className="text-[10px] text-muted-foreground">Blocked assets</p>
                  </div>
                </div>

                {/* Grid allocation visualizer */}
                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-foreground mb-4">Floor Map Allocation Grid</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {branchRooms.map((rm) => (
                      <div
                        key={rm.id}
                        onClick={() => handleToggleAvailability(rm)}
                        className={`p-4 border rounded-xl text-center transition-all cursor-pointer select-none hover:shadow-md ${
                          rm.available
                            ? 'border-green-200 bg-green-50/40 text-green-800 dark:bg-green-950/20 dark:text-green-200'
                            : 'border-red-200 bg-red-50/40 text-red-800 dark:bg-red-950/20 dark:text-red-200'
                        }`}
                      >
                        <p className="text-xs font-bold truncate leading-tight">{rm.name}</p>
                        <span className="text-[9px] font-bold block mt-2 opacity-80 uppercase">
                          {rm.available ? 'Vacant' : 'Occupied'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4.5 p-3.5 bg-secondary/50 rounded-xl border border-border text-[10px] text-muted-foreground mt-4 items-center">
                    <AlertCircle size={16} className="text-primary shrink-0" />
                    <span>Click on any room block to instantly toggle its occupancy status for check-ins audits.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        title={editingRoom ? 'Edit Room Details' : 'Add Room Category'}
      >
        <form onSubmit={handleRoomSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Category Name</label>
            <input
              type="text"
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
              placeholder="E.g. Presidential Suite"
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
              <label className="block text-muted-foreground uppercase mb-1.5">Status</label>
              <select
                value={roomForm.available ? 'yes' : 'no'}
                onChange={(e) => setRoomForm({ ...roomForm, available: e.target.value === 'yes' })}
                className="w-full px-4 py-2 border border-border bg-background rounded-lg focus:outline-none"
                required
              >
                <option value="yes">Available</option>
                <option value="no">Occupied</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-muted-foreground uppercase mb-1.5">Amenities (Comma separated)</label>
            <input
              type="text"
              value={roomForm.amenities}
              onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
              placeholder="King bed, Balcony, Jacuzzi"
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
            {editingRoom ? 'Save Room Details' : 'Register Room Category'}
          </button>
        </form>
      </Modal>
    </Layout>
  )
}
