import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import { Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react'

export default function ManagerLogin() {
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

    // Verify manager credentials
    if (email !== 'paris@hotel.com' && email !== 'dubai@hotel.com') {
      setError('Access Denied. Branch Manager credentials required.')
      setLoading(false)
      return
    }

    try {
      await login(email, password)
      navigate('/manager/dashboard')
    } catch (err) {
      setError('Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-indigo-950 text-white py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="inline-block p-3 bg-primary/10 text-primary rounded-xl mb-3">
                <UserCheck size={36} />
              </div>
              <h1 className="text-3xl font-black">Branch Operations</h1>
              <p className="text-slate-400 text-xs mt-1">Sign in as a Branch Manager to manage local rooms and bookings</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-950/40 text-red-400 border border-red-900/50 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Manager Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="paris@hotel.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-white transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Operational Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-700 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-white transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/95 transition text-sm cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50 mt-4"
              >
                {loading ? 'Opening Console...' : 'Sign In to Branch'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
              Demo logins: <span className="text-primary font-bold">paris@hotel.com</span> or <span className="text-primary font-bold">dubai@hotel.com</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
