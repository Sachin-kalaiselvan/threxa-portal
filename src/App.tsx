import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { getCurrentUser, signOut } from './lib/api'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { InquiriesPage } from './pages/Inquiries'
import { OrdersPage } from './pages/Orders'
import { LogOut, Menu, X } from 'lucide-react'

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('/dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const tabs = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/inquiries', label: 'Inquiries', icon: '📋' },
    { path: '/orders', label: 'Orders', icon: '📦' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50">
      {/* Header - Professional Manufacturing Style */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/threxa-icon.png" alt="Threxa" className="h-8 w-8" />
              <div className="hidden sm:block">
                <div className="text-lg font-bold" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", letterSpacing: '0.15em', color: '#1e293b' }}>
                  THREXA
                </div>
                <div className="text-xs text-gray-500">Operations Portal</div>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => {
                    setActiveTab(tab.path)
                    navigate(tab.path)
                  }}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab.path
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden lg:inline">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Section - User & Logout */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium text-sm transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.path}
                    onClick={() => {
                      setActiveTab(tab.path)
                      navigate(tab.path)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-2 px-4 py-3 w-full text-left font-medium text-sm transition-colors ${
                      activeTab === tab.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-600 font-medium text-sm hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Flex grow */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer - Always at bottom */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          <p>© 2026 Threxa Operations Portal. All rights reserved.</p>
        </div>
      </footer>
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-slate-800">
        <div className="text-center">
          <img src="/threxa-icon.png" alt="Threxa" className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg font-medium">Loading Threxa...</p>
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
