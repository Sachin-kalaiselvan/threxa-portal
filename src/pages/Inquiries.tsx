import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'

export function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const inquiries = [
    { id: 'INQ-045', customer: 'New Tech Solutions', type: 'Large Batch', status: 'new', date: '2026-05-29', amount: '₹2,50,000' },
    { id: 'INQ-044', customer: 'Premium Materials', type: 'Custom Order', status: 'quoted', date: '2026-05-28', amount: '₹5,75,000' },
    { id: 'INQ-043', customer: 'Urban Manufacturing', type: 'Standard', status: 'confirmed', date: '2026-05-27', amount: '₹1,80,000' },
    { id: 'INQ-042', customer: 'Global Supply', type: 'Bulk Order', status: 'new', date: '2026-05-26', amount: '₹8,90,000' },
    { id: 'INQ-041', customer: 'Tech Innovations', type: 'Custom', status: 'quoted', date: '2026-05-25', amount: '₹3,20,000' },
    { id: 'INQ-040', customer: 'Industrial Corp', type: 'Standard', status: 'completed', date: '2026-05-24', amount: '₹2,10,000' },
  ]

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'quoted': return 'bg-yellow-100 text-yellow-700'
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 text-sm mt-1">{filteredInquiries.length} inquiries</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          <span>New Inquiry</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer or inquiry ID..."
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
              <option value="new">New</option>
              <option value="quoted">Quoted</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Inquiry ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{inquiry.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{inquiry.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{inquiry.type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{inquiry.amount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inquiry.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
