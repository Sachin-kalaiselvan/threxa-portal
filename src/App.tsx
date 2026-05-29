import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { getCurrentUser, signOut } from './lib/api'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { InquiriesPage } from './pages/Inquiries'
import { OrdersPage } from './pages/Orders'
import { Menu, X, LogOut } from 'lucide-react'

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/inquiries', label: 'Inquiries' },
    { href: '/orders', label: 'Orders' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r shadow-sm fixed md:relative h-full z-40`}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Threxa</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href)
                setSidebarOpen(false)
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                location.pathname === item.href
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm p-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-blue-600">Threxa</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

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
