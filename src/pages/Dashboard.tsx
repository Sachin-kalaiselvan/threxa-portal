import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentClient } from '../lib/api'
import type { Client } from '../types'
import { TrendingUp, AlertCircle, CheckCircle, Clock, Activity, DollarSign, Users, ArrowUp, ArrowDown } from 'lucide-react'

// Simple Chart Component using SVG
function SimpleBarChart() {
  const data = [
    { day: 'Mon', orders: 3 },
    { day: 'Tue', orders: 5 },
    { day: 'Wed', orders: 4 },
    { day: 'Thu', orders: 7 },
    { day: 'Fri', orders: 6 },
    { day: 'Sat', orders: 2 },
    { day: 'Sun', orders: 4 },
  ]

  const maxOrders = Math.max(...data.map(d => d.orders))
  const chartHeight = 150

  return (
    <div className="flex items-end justify-between gap-2 h-40 px-2 py-4">
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1">
          <div className="w-full flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all hover:opacity-80"
              style={{ height: `${(item.orders / maxOrders) * chartHeight}px` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">{item.day}</p>
          <p className="text-xs font-semibold text-gray-900">{item.orders}</p>
        </div>
      ))}
    </div>
  )
}

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

  // Enhanced KPI data with new metrics
  const kpis = [
    {
      label: 'Revenue This Month',
      value: '₹12,50,000',
      change: '↑ 18% vs last month',
      icon: DollarSign,
      color: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'Avg Turnaround',
      value: '8.2 days',
      change: 'Target: 7 days',
      icon: Clock,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'On-Time Delivery',
      value: '94%',
      change: 'Target: 95%',
      icon: TrendingUp,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Monthly Performance',
      value: '87/100',
      change: 'Based on metrics',
      icon: CheckCircle,
      color: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'Tech Corp', status: 'In Production', date: '2026-05-29', progress: 65 },
    { id: 'ORD-002', customer: 'Industrial Ltd', status: 'Quality Check', date: '2026-05-28', progress: 85 },
    { id: 'ORD-003', customer: 'Precision Inc', status: 'Packed', date: '2026-05-27', progress: 95 },
  ]

  const topCustomers = [
    { name: 'Global Supply', orders: 8, revenue: '₹8,90,000', repeat: true },
    { name: 'Tech Corp', orders: 5, revenue: '₹5,25,000', repeat: true },
    { name: 'Premium Materials', orders: 4, revenue: '₹3,80,000', repeat: false },
  ]

  const criticalAlerts = [
    { id: 1, type: 'overdue', title: 'ORD-005 Overdue', message: 'Order is 2 days late', severity: 'high' },
    { id: 2, type: 'quality', title: 'Quality Issue', message: 'ORD-002 failed first check', severity: 'medium' },
    { id: 3, type: 'stock', title: 'Low Stock', message: 'Reorder Material ABC needed', severity: 'medium' },
  ]

  const monthlyComparison = [
    { metric: 'Orders Completed', thisMonth: 24, lastMonth: 21, growth: '+14%' },
    { metric: 'Revenue', thisMonth: '₹12,50,000', lastMonth: '₹10,60,000', growth: '+18%' },
    { metric: 'Avg Quality Score', thisMonth: '94%', lastMonth: '91%', growth: '+3%' },
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

      {/* KEY METRICS GRID - 4 Cards */}
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
                    <p className={`text-2xl md:text-3xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
                    <p className="text-xs text-gray-600">{kpi.change}</p>
                  </div>
                </div>
                <Icon className={`${kpi.textColor} opacity-50`} size={24} />
              </div>
            </div>
          )
        })}
      </div>

      {/* PRODUCTION CHART */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Orders Completed - Last 7 Days</h2>
        <SimpleBarChart />
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
          <div>
            <p className="text-xs text-gray-600">Total this week</p>
            <p className="text-2xl font-bold text-gray-900">31 orders</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Avg per day</p>
            <p className="text-2xl font-bold text-blue-600">4.4 orders</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID: Active Orders + Alerts + Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
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

        {/* Critical Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
              <span className="bg-red-100 text-red-700 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ml-auto">
                {criticalAlerts.length}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {criticalAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                  alert.severity === 'high' ? 'border-l-red-600 bg-red-50' : 'border-l-yellow-600 bg-yellow-50'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                <button className="text-xs text-blue-600 font-semibold mt-2 hover:text-blue-700">
                  Take Action →
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2">
              View All Alerts →
            </button>
          </div>
        </div>
      </div>

      {/* TOP CUSTOMERS + MONTHLY COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Customers */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Top Customers This Month</h2>
          </div>

          <div className="space-y-4">
            {topCustomers.map((customer, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-600">{customer.orders} orders</p>
                  {customer.repeat && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ★ Repeat Customer
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{customer.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Month vs Month Comparison</h2>

          <div className="space-y-4">
            {monthlyComparison.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">{item.metric}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${item.growth.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.growth}
                    </span>
                    {item.growth.includes('+') ? (
                      <ArrowUp className="text-green-600" size={16} />
                    ) : (
                      <ArrowDown className="text-red-600" size={16} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">This Month</p>
                    <p className="font-semibold text-gray-900">{item.thisMonth}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Last Month</p>
                    <p className="font-semibold text-gray-600">{item.lastMonth}</p>
                  </div>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '70%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pro Tip Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Performance Insight</h3>
          <p className="text-sm text-blue-800">
            Your on-time delivery rate is at 94%. Maintaining orders in production and quality checks can help you reach the 95% target next week.
          </p>
        </div>
      </div>
    </div>
  )
}
