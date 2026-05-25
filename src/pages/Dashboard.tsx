import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Bookmark, Bell, Heart } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { hotels } from '../data/hotels'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { favorites } = useFavorites()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Please Log In</h1>
          <p className="text-muted-foreground mb-8">You need to be logged in to view your dashboard</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </Layout>
    )
  }

  const favoriteHotels = hotels.filter((h) => favorites.includes(h.id))

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border sticky top-20 h-fit">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold">{user?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2 mb-6">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'bookings', label: 'My Bookings', icon: Bookmark },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={20} />
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition font-semibold"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="text-lg font-semibold">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="text-lg font-semibold">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
                <button className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition font-semibold">
                  Edit Profile
                </button>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
                <div className="text-center py-12">
                  <Bookmark size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground text-lg">No bookings yet</p>
                  <button
                    onClick={() => navigate('/hotels')}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Browse Hotels
                  </button>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">My Wishlist ({favoriteHotels.length})</h2>
                {favoriteHotels.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground text-lg">No saved hotels yet</p>
                    <button
                      onClick={() => navigate('/hotels')}
                      className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                    >
                      Explore Hotels
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteHotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                        className="group cursor-pointer"
                      >
                        <div className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition">
                          <div className="h-40 overflow-hidden">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-1">{hotel.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {hotel.city}, {hotel.country}
                            </p>
                            <p className="text-lg font-bold text-primary">${hotel.pricePerNight}/night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground text-lg">No new notifications</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
