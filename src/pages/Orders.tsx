import { useState } from 'react'
import { Search, Filter, Calendar, Truck } from 'lucide-react'

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const orders = [
    {
      id: 'ORD-001',
      customer: 'Tech Corp',
      status: 'in_production',
      date: '2026-05-29',
      quantity: '5,000 units',
      amount: '₹2,50,000',
      progress: 65,
      timeline: [
        { stage: 'Design Approval', completed: true, date: '2026-05-24' },
        { stage: 'In Production', completed: true, date: '2026-05-29' },
        { stage: 'Quality Check', completed: false, date: null },
        { stage: 'Packed', completed: false, date: null },
        { stage: 'Shipped', completed: false, date: null },
      ]
    },
    {
      id: 'ORD-002',
      customer: 'Industrial Ltd',
      status: 'quality_check',
      date: '2026-05-28',
      quantity: '3,000 units',
      amount: '₹1,80,000',
      progress: 85,
      timeline: [
        { stage: 'Design Approval', completed: true, date: '2026-05-22' },
        { stage: 'In Production', completed: true, date: '2026-05-27' },
        { stage: 'Quality Check', completed: true, date: '2026-05-28' },
        { stage: 'Packed', completed: false, date: null },
        { stage: 'Shipped', completed: false, date: null },
      ]
    },
    {
      id: 'ORD-003',
      customer: 'Precision Inc',
      status: 'packed',
      date: '2026-05-27',
      quantity: '2,500 units',
      amount: '₹1,50,000',
      progress: 95,
      timeline: [
        { stage: 'Design Approval', completed: true, date: '2026-05-20' },
        { stage: 'In Production', completed: true, date: '2026-05-25' },
        { stage: 'Quality Check', completed: true, date: '2026-05-27' },
        { stage: 'Packed', completed: true, date: '2026-05-28' },
        { stage: 'Shipped', completed: false, date: null },
      ]
    },
    {
      id: 'ORD-004',
      customer: 'Global Supply',
      status: 'design_approval',
      date: '2026-05-26',
      quantity: '10,000 units',
      amount: '₹5,75,000',
      progress: 20,
      timeline: [
        { stage: 'Design Approval', completed: true, date: '2026-05-26' },
        { stage: 'In Production', completed: false, date: null },
        { stage: 'Quality Check', completed: false, date: null },
        { stage: 'Packed', completed: false, date: null },
        { stage: 'Shipped', completed: false, date: null },
      ]
    },
  ]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'design_approval': return 'bg-blue-100 text-blue-700'
      case 'in_production': return 'bg-yellow-100 text-yellow-700'
      case 'quality_check': return 'bg-orange-100 text-orange-700'
      case 'packed': return 'bg-purple-100 text-purple-700'
      case 'shipped': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'design_approval': return 'Design Approval'
      case 'in_production': return 'In Production'
      case 'quality_check': return 'Quality Check'
      case 'packed': return 'Packed'
      case 'shipped': return 'Shipped'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 text-sm mt-1">{filteredOrders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="design_approval">Design Approval</option>
              <option value="in_production">In Production</option>
              <option value="quality_check">Quality Check</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm text-gray-600">{order.quantity}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{order.progress}%</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>

              {/* Progress Bar */}
              <div className="px-6 pb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Production Timeline</h3>
                  
                  <div className="space-y-3">
                    {order.timeline.map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          stage.completed ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          {stage.completed && (
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                            {stage.stage}
                          </p>
                          {stage.date && (
                            <p className="text-xs text-gray-500">{stage.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                      Update Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  )
}
