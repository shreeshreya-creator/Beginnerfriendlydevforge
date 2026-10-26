import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Zap, ArrowLeft, Github, Lock, Mail } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

const supabase = createClient()

export default function Auth() {
  const location = useLocation()
  const [isSignup, setIsSignup] = useState(location.pathname === '/signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })
      if (error) {
        setError(error.message)
      } else if (data.user && !data.session) {
        setMessage('Check your email for confirmation.')
      } else {
        navigate('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    }
    setLoading(false)
  }

  function handleInstantGuestAccess() {
    localStorage.setItem('dev_auth_bypass', 'true')
    localStorage.setItem('devforge_user', JSON.stringify({
      id: 'lead-dev-profile-01',
      email: 'alex.rivera@devforge.studio',
      user_metadata: { name: 'Alex Rivera' }
    }))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0b0d13] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 py-12 bg-[#141824] border border-[#21283b] p-8 rounded-3xl shadow-2xl">
          <header className="space-y-2">
            <Link
              to="/"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold">
                /D
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                {isSignup ? 'Create Developer Account' : 'Welcome to DevForge'}
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Access the collaborative portfolio builder and AI suite
            </p>
          </header>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleInstantGuestAccess}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Launch Studio as Lead Architect</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#21283b] w-full" />
            <span className="bg-[#141824] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest absolute">
              or continue with email
            </span>
          </div>

          {message ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-mono">
              {message}
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignup && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {error && <p className="text-xs text-rose-400 font-mono">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isSignup ? 'Create Account' : 'Sign In')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
