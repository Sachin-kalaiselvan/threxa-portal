import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { getCurrentUser, signOut } from './lib/api'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { InquiriesPage } from './pages/Inquiries'
import { OrdersPage } from './pages/Orders'
import { Menu, X, LogOut, Settings, Bell } from 'lucide-react'

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/inquiries', label: 'Inquiries', icon: '📝' },
    { href: '/orders', label: 'Orders', icon: '📦' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-40 w-64 h-full transition-transform duration-300 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <img 
              src="/threxa-icon.png" 
              alt="Threxa" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="font-bold text-white text-lg tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>
                THREXA
              </div>
              <div className="text-xs bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                BEYOND LIMITS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 space-y-2">
          <button className="w-full flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg relative">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                SP
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth...')
        const currentUser = await getCurrentUser()
        console.log('Current user:', currentUser)
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user?.email)
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <img 
            src="/threxa-icon.png" 
            alt="Threxa" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <p className="text-white text-lg font-medium">Loading Threxa Portal...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inquiries" element={<InquiriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  )
}
