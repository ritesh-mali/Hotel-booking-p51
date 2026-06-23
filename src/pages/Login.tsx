import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect based on role
      const stored = localStorage.getItem('user')
      if (stored) {
        const u = JSON.parse(stored)
        if (u.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (u.role === 'manager') {
          navigate('/manager/dashboard')
        } else {
          navigate('/')
        }
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password')
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-secondary/30 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-black text-center mb-2">Welcome Back</h1>
              <p className="text-center text-sm text-muted-foreground">Sign in to manage bookings or your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-semibold">{error}</div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Forgot password feature is simulated. Please use any of the quick login options below.')}
                  className="text-primary hover:text-primary/95 transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/95 transition disabled:opacity-50 mt-6 cursor-pointer text-sm shadow-md"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Logins Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-muted-foreground uppercase">
                <ShieldAlert size={14} className="text-primary" />
                <span>Quick Role Logins (Demo)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDemoLogin('admin@hotel.com')}
                  className="text-[10px] py-1.5 border border-border rounded-lg bg-secondary hover:bg-primary hover:text-white transition font-bold"
                >
                  Admin
                </button>
                <button
                  onClick={() => handleDemoLogin('paris@hotel.com')}
                  className="text-[10px] py-1.5 border border-border rounded-lg bg-secondary hover:bg-primary hover:text-white transition font-bold"
                >
                  Paris Mgr
                </button>
                <button
                  onClick={() => handleDemoLogin('guest@hotel.com')}
                  className="text-[10px] py-1.5 border border-border rounded-lg bg-secondary hover:bg-primary hover:text-white transition font-bold"
                >
                  Customer
                </button>
              </div>
            </div>

            {/* Signup Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/95 font-semibold transition">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
