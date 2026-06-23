import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LogIn, User, Sun, Moon, Hotel, Bed, GitCompare } from 'lucide-react'
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

  const getDashboardLink = () => {
    if (!user) return '/dashboard'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'manager') return '/manager/dashboard'
    return '/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-800 rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition">
                Aura Resorts
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none font-semibold">
                Luxury Stays
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/branches"
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/branches') ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              Branches
            </Link>
            <Link
              to="/rooms"
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/rooms') ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              Rooms
            </Link>
            <Link
              to="/compare"
              className={`text-sm transition-colors hover:text-primary ${
                isActive('/compare') ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              Compare
            </Link>

            {isAuthenticated && user?.role === 'customer' && (
              <Link
                to="/dashboard"
                className={`text-sm transition-colors hover:text-primary ${
                  isActive('/dashboard') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                My Bookings
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname.startsWith('/admin') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Admin Panel
              </Link>
            )}

            {isAuthenticated && user?.role === 'manager' && (
              <Link
                to="/manager/dashboard"
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname.startsWith('/manager') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Manager Panel
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex gap-2">
                <Link to="/login">
                  <button className="px-4 py-2 text-sm text-foreground hover:text-primary transition flex items-center gap-1.5 font-medium">
                    <LogIn size={16} />
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-sm hover:shadow-md">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2 items-center">
                <Link to={getDashboardLink()}>
                  <button className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors" title="My Dashboard">
                    <User size={18} />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border py-4 px-6 space-y-2 bg-background">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-base font-medium rounded-lg hover:bg-secondary px-3 transition"
          >
            Home
          </Link>
          <Link
            to="/branches"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-base font-medium rounded-lg hover:bg-secondary px-3 transition"
          >
            Branches
          </Link>
          <Link
            to="/rooms"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-base font-medium rounded-lg hover:bg-secondary px-3 transition"
          >
            Rooms
          </Link>
          <Link
            to="/compare"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-base font-medium rounded-lg hover:bg-secondary px-3 transition"
          >
            Compare Rooms
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="block py-2.5 text-base font-medium rounded-lg hover:bg-secondary px-3 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 text-base font-medium rounded-lg hover:bg-destructive/10 text-destructive px-3 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                <button className="w-full py-2.5 text-center text-foreground font-medium rounded-lg border border-border hover:bg-secondary transition">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
                <button className="w-full py-2.5 text-center bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
