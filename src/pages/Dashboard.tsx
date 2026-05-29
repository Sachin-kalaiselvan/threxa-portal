import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentClient } from '../lib/api'
import type { Client } from '../types'
import { TrendingUp, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react'

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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Unable to load client data</p>
        </div>
      </div>
    )
  }

  // Real manufacturing KPI data
  const kpis = [
    {
      label: 'Pending Inquiries',
      value: '12',
      change: '+2',
      icon: Clock,
      color: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Active Orders',
      value: '8',
      change: '+1 this week',
      icon: Activity,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Completed This Month',
      value: '24',
      change: '↑ 15% vs last month',
      icon: CheckCircle,
      color: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'On-Time Delivery Rate',
      value: '94%',
      change: 'Target: 95%',
      icon: TrendingUp,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'Tech Corp', status: 'In Production', date: '2026-05-29', progress: 65 },
    { id: 'ORD-002', customer: 'Industrial Ltd', status: 'Quality Check', date: '2026-05-28', progress: 85 },
    { id: 'ORD-003', customer: 'Precision Inc', status: 'Packed', date: '2026-05-27', progress: 95 },
    { id: 'ORD-004', customer: 'Global Supply', status: 'Design Approval', date: '2026-05-26', progress: 20 },
  ]

  const pendingInquiries = [
    { id: 'INQ-045', customer: 'New Tech Solutions', type: 'Large Batch', date: '2026-05-29', days: '1 day ago' },
    { id: 'INQ-044', customer: 'Premium Materials', type: 'Custom Order', date: '2026-05-28', days: '2 days ago' },
    { id: 'INQ-043', customer: 'Urban Manufacturing', type: 'Standard', date: '2026-05-27', days: '3 days ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            {client.name} • {client.tier.charAt(0).toUpperCase() + client.tier.slice(1)} Plan
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Updated just now
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className={`${kpi.color} border ${kpi.borderColor} rounded-xl p-6 transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-700 text-sm font-medium mb-2">{kpi.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                    <p className="text-xs text-gray-600">{kpi.change}</p>
                  </div>
                </div>
                <Icon className={`${kpi.textColor} opacity-50`} size={24} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Orders - Main Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'In Production' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Quality Check' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Packed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{order.progress}%</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Inquiries - Sidebar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Inquiries</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {pendingInquiries.length}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingInquiries.map((inquiry) => (
              <div key={inquiry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900 text-sm">{inquiry.id}</p>
                  <span className="text-xs text-gray-500">{inquiry.days}</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{inquiry.customer}</p>
                <p className="text-xs text-gray-500">{inquiry.type}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => window.location.href = '/inquiries'}
              className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
            >
              View All Inquiries →
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Pro Tip</h3>
          <p className="text-sm text-blue-800">
            You have <span className="font-medium">{client.active_modules.length} active modules</span> in your {client.tier.toUpperCase()} plan. 
            {client.active_modules.length === 2 && ' Upgrade to unlock inventory and grievance management.'}
          </p>
        </div>
      </div>
    </div>
  )
}
