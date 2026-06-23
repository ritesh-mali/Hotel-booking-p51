import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon, Bookmark, Bell, Heart, Calendar, AlertCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useApp } from '../context/AppContext'
import { Modal } from '../../components/ui/Modal'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { favorites } = useFavorites()
  const { bookings, hotels, cancelBooking } = useApp()
  
  const [activeTab, setActiveTab] = useState('bookings')
  const [currentPage, setCurrentPage] = useState(1)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  
  const bookingsPerPage = 5

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Please Log In</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in to view your dashboard</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 font-semibold"
          >
            Go to Login
          </button>
        </div>
      </Layout>
    )
  }

  // Filter bookings that match this user's email
  const userBookings = useMemo(() => {
    return bookings.filter((b) => b.userEmail.toLowerCase() === user.email.toLowerCase())
  }, [bookings, user.email])

  // Paginated bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * bookingsPerPage
    return userBookings.slice(startIndex, startIndex + bookingsPerPage)
  }, [userBookings, currentPage])

  const totalPages = Math.ceil(userBookings.length / bookingsPerPage)

  const favoriteHotels = hotels.filter((h) => favorites.includes(h.id))

  const handleCancelClick = (id: string) => {
    setSelectedBookingId(id)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = () => {
    if (selectedBookingId) {
      cancelBooking(selectedBookingId)
      setCancelModalOpen(false)
      setSelectedBookingId(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-24 shadow-sm space-y-6">
              {/* Profile Card */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-800 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-extrabold text-foreground leading-tight truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <nav className="space-y-1">
                {[
                  { id: 'bookings', label: 'Booking History', icon: Bookmark },
                  { id: 'profile', label: 'My Profile', icon: UserIcon },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setCurrentPage(1)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Logout */}
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all font-bold text-xs cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9">
            {/* Booking History Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">Booking History</h2>
                  <p className="text-muted-foreground text-xs">Track and manage your branch reservations.</p>
                </div>

                {userBookings.length === 0 ? (
                  <div className="text-center py-16">
                    <Bookmark size={48} className="mx-auto text-muted-foreground mb-4 opacity-25" />
                    <p className="text-muted-foreground font-semibold">You have no reservation records.</p>
                    <button
                      onClick={() => navigate('/branches')}
                      className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/95 text-xs font-bold transition shadow-sm"
                    >
                      Book a Room
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="overflow-x-auto border border-border rounded-xl">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="bg-secondary/40 border-b border-border text-xs font-bold text-muted-foreground uppercase">
                            <th className="py-3 px-4">Booking ID</th>
                            <th className="py-3 px-4">Branch</th>
                            <th className="py-3 px-4">Dates</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Payment</th>
                            <th className="py-3 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedBookings.map((b) => {
                            const branch = hotels.find((h) => h.id === b.hotelId)
                            const r = branch?.rooms.find((rm) => rm.id === b.roomId)

                            return (
                              <tr key={b.id} className="border-b border-border hover:bg-secondary/15 transition-all text-xs font-medium">
                                <td className="py-4 px-4 font-bold text-primary">{b.id}</td>
                                <td className="py-4 px-4">
                                  <p className="font-bold text-foreground leading-none">{branch?.name}</p>
                                  <span className="text-[10px] text-muted-foreground mt-1 block">{r?.name}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} className="text-muted-foreground" />
                                    {b.checkInDate} to {b.checkOutDate}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    b.status === 'confirmed'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                                      : b.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300'
                                  }`}>
                                    {b.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    b.paymentStatus === 'paid'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                  }`}>
                                    {b.paymentStatus.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  {b.status !== 'cancelled' ? (
                                    <button
                                      onClick={() => handleCancelClick(b.id)}
                                      className="text-xs text-destructive hover:underline font-semibold"
                                    >
                                      Cancel Booking
                                    </button>
                                  ) : (
                                    <span className="text-muted-foreground/50 text-xs">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground font-semibold">
                          Showing Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1.5 border border-border text-xs rounded-lg hover:bg-secondary disabled:opacity-40 transition font-bold"
                          >
                            Prev
                          </button>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1.5 border border-border text-xs rounded-lg hover:bg-secondary disabled:opacity-40 transition font-bold"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">Profile Details</h2>
                  <p className="text-muted-foreground text-xs">View or configure your account parameters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Full Name</span>
                    <p className="text-base font-bold text-foreground mt-1">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Email Address</span>
                    <p className="text-base font-bold text-foreground mt-1">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Phone Number</span>
                    <p className="text-base font-bold text-foreground mt-1">{user.phone || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Account Type</span>
                    <p className="text-xs font-bold mt-1 bg-primary/10 text-primary w-fit px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {user.role || 'Customer'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">My Wishlist</h2>
                  <p className="text-muted-foreground text-xs">Your curated collection of saved branches.</p>
                </div>

                {favoriteHotels.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-25" />
                    <p className="text-muted-foreground font-semibold">Your wishlist is empty.</p>
                    <button
                      onClick={() => navigate('/branches')}
                      className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/95 text-xs font-bold transition shadow-sm"
                    >
                      Browse Branches
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteHotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        onClick={() => navigate(`/branches/${hotel.id}`)}
                        className="group bg-secondary/20 border border-border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="h-40 bg-muted overflow-hidden">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-extrabold text-base mb-1 group-hover:text-primary transition">
                            {hotel.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {hotel.city}, {hotel.country}
                          </p>
                          <p className="text-sm font-extrabold text-primary">${hotel.pricePerNight || 350}/night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Cancellation"
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-sm text-muted-foreground p-3.5 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-900/35 rounded-xl">
            <AlertCircle size={20} className="shrink-0" />
            <p>
              Are you sure you want to cancel this booking ({selectedBookingId})? This action is permanent and room slots will be instantly released.
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 border border-border hover:bg-secondary rounded-lg text-xs font-bold transition cursor-pointer"
            >
              No, Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/95 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
