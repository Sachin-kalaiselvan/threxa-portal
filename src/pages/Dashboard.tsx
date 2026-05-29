import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentClient } from '../lib/api'
import type { Client } from '../types'
import { TrendingUp, FileText, Package, Zap } from 'lucide-react'

export function DashboardPage() {
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClient = async () => {
      try {
        const clientData = await getCurrentClient()
        if (!clientData) {
          navigate('/login')
          return
        }
        setClient(clientData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mx-auto mb-4 animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Inquiries',
      value: '24',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Orders',
      value: '8',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Completion Rate',
      value: '92%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Plan Status',
      value: client?.tier.toUpperCase(),
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{client?.name}</span>
        </h1>
        <p className="text-slate-600">Here's your operational overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Module Cards */}
      {client?.active_modules.includes('inquiries') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => navigate('/inquiries')}
            className="group bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Management</h2>
            <p className="text-slate-600 mb-4">Manage customer inquiries and track quotations</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
              <span>View Inquiries</span>
              <span>→</span>
            </div>
          </button>

          {client?.active_modules.includes('orders') && (
            <button
              onClick={() => navigate('/orders')}
              className="group bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-8 hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Tracking</h2>
              <p className="text-slate-600 mb-4">Track production status and shipments</p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                <span>View Orders</span>
                <span>→</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-slate-900 mb-2">💡 Pro Tip</h3>
        <p className="text-slate-700 text-sm">
          Your <span className="font-semibold text-purple-600">{client?.tier.toUpperCase()}</span> plan includes {client?.active_modules.length} {client?.active_modules.length === 1 ? 'module' : 'modules'}. 
          Need more features? <span className="text-purple-600 font-semibold cursor-pointer hover:underline">Upgrade your plan</span>
        </p>
      </div>
    </div>
  )
}
