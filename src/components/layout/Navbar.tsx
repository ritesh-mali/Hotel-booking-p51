import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LogIn, User, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block group-hover:text-primary transition">
              Luxury Hotels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`transition ${
                isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className={`transition ${
                isActive('/hotels') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Hotels
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`transition ${
                  isActive('/dashboard') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                }`}
              >
                My Bookings
              </Link>
            )}

            {user?.email === 'admin@example.com' && (
              <Link
                to="/admin"
                className={`transition ${
                  isActive('/admin') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex gap-2">
                <Link to="/login">
                  <button className="px-4 py-2 text-foreground hover:text-primary transition flex items-center gap-2">
                    <LogIn size={18} />
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2 items-center">
                <Link to="/dashboard">
                  <button className="p-2 rounded-lg hover:bg-muted transition">
                    <User size={20} />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-muted transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-lg hover:bg-muted transition"
            >
              Home
            </Link>
            <Link
              to="/hotels"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-lg hover:bg-muted transition"
            >
              Hotels
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-lg hover:bg-muted transition"
              >
                My Bookings
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-muted transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
