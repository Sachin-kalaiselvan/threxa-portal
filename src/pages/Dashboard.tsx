import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentClient } from '../lib/api'
import type { Client } from '../types'

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
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Unable to load client data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">{client.name} • {client.tier.charAt(0).toUpperCase() + client.tier.slice(1)} Plan</p>
      </div>

      {/* KPI Cards - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-gray-700 text-sm font-medium mb-2">Revenue This Month</p>
          <p className="text-3xl font-bold text-green-600">₹12,50,000</p>
          <p className="text-xs text-gray-600 mt-2">↑ 18% vs last month</p>
        </div>

        {/* Turnaround Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-gray-700 text-sm font-medium mb-2">Avg Turnaround</p>
          <p className="text-3xl font-bold text-blue-600">8.2 days</p>
          <p className="text-xs text-gray-600 mt-2">Target: 7 days</p>
        </div>

        {/* On-Time Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-gray-700 text-sm font-medium mb-2">On-Time Delivery</p>
          <p className="text-3xl font-bold text-purple-600">94%</p>
          <p className="text-xs text-gray-600 mt-2">Target: 95%</p>
        </div>

        {/* Performance Card */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-gray-700 text-sm font-medium mb-2">Monthly Performance</p>
          <p className="text-3xl font-bold text-orange-600">87/100</p>
          <p className="text-xs text-gray-600 mt-2">Based on all metrics</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Orders Completed - Last 7 Days</h2>
        
        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-48 px-4">
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '60px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Mon</p>
            <p className="text-xs font-bold text-gray-900">3</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '100px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Tue</p>
            <p className="text-xs font-bold text-gray-900">5</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '80px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Wed</p>
            <p className="text-xs font-bold text-gray-900">4</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '140px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Thu</p>
            <p className="text-xs font-bold text-gray-900">7</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '120px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Fri</p>
            <p className="text-xs font-bold text-gray-900">6</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '40px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Sat</p>
            <p className="text-xs font-bold text-gray-900">2</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full bg-blue-600 rounded-t-md" style={{ height: '80px' }}></div>
            <p className="text-xs text-gray-600 mt-2">Sun</p>
            <p className="text-xs font-bold text-gray-900">4</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2">
          <div>
            <p className="text-xs text-gray-600">Total this week</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">31 orders</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Avg per day</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">4.4 orders</p>
          </div>
        </div>
      </div>

      {/* Orders + Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
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
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">ORD-001</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Tech Corp</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Production</span></td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">65%</p>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">ORD-002</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Industrial Ltd</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Quality Check</span></td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">85%</p>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">ORD-003</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Precision Inc</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Packed</span></td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">95%</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
            <span className="text-xs text-red-600 font-bold mt-1">3 alerts</span>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 bg-red-50 border-l-4 border-l-red-600">
              <p className="font-medium text-gray-900 text-sm">ORD-005 Overdue</p>
              <p className="text-xs text-gray-600 mt-1">Order is 2 days late</p>
            </div>
            <div className="px-6 py-4 bg-yellow-50 border-l-4 border-l-yellow-600">
              <p className="font-medium text-gray-900 text-sm">Quality Issue</p>
              <p className="text-xs text-gray-600 mt-1">ORD-002 failed first check</p>
            </div>
            <div className="px-6 py-4 bg-yellow-50 border-l-4 border-l-yellow-600">
              <p className="font-medium text-gray-900 text-sm">Low Stock</p>
              <p className="text-xs text-gray-600 mt-1">Reorder Material ABC needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers + Monthly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Customers */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Customers This Month</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Global Supply</p>
              <p className="text-xs text-gray-600 mt-1">8 orders</p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">⭐ Repeat Customer</span>
              <p className="text-right font-semibold text-gray-900 mt-2">₹8,90,000</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Tech Corp</p>
              <p className="text-xs text-gray-600 mt-1">5 orders</p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">⭐ Repeat Customer</span>
              <p className="text-right font-semibold text-gray-900 mt-2">₹5,25,000</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Premium Materials</p>
              <p className="text-xs text-gray-600 mt-1">4 orders</p>
              <p className="text-right font-semibold text-gray-900 mt-2">₹3,80,000</p>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Month vs Month Comparison</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Orders Completed</p>
                <span className="text-xs font-bold text-green-600">↑ +14%</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">This Month</p>
                  <p className="font-semibold text-gray-900">24</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Last Month</p>
                  <p className="font-semibold text-gray-600">21</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Revenue</p>
                <span className="text-xs font-bold text-green-600">↑ +18%</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">This Month</p>
                  <p className="font-semibold text-gray-900">₹12,50,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Last Month</p>
                  <p className="font-semibold text-gray-600">₹10,60,000</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Quality Score</p>
                <span className="text-xs font-bold text-green-600">↑ +3%</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">This Month</p>
                  <p className="font-semibold text-gray-900">94%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Last Month</p>
                  <p className="font-semibold text-gray-600">91%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-1">💡 Performance Insight</h3>
        <p className="text-sm text-blue-800">Your on-time delivery rate is at 94%. Maintaining orders in production and quality checks can help you reach the 95% target next week.</p>
      </div>
    </div>
  )
}
