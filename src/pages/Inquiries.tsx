import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getInquiries, createInquiry } from '../lib/api'
import type { Inquiry } from '../types'
import { Plus } from 'lucide-react'

export function InquiriesPage() {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [clientId, setClientId] = useState<string>('')
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_contact: '',
    requirement: '',
    quantity: '',
    deadline: '',
    inquiry_number: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          navigate('/login')
          return
        }
        setClientId(user.id)

        const data = await getInquiries(user.id)
        setInquiries(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadInquiries()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createInquiry({
        client_id: clientId,
        inquiry_number: formData.inquiry_number || `INQ-${Date.now()}`,
        customer_name: formData.customer_name,
        customer_contact: formData.customer_contact,
        requirement: formData.requirement,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        deadline: formData.deadline,
        status: 'new',
      })

      // Reload inquiries
      const data = await getInquiries(clientId)
      setInquiries(data)
      setShowForm(false)
      setFormData({
        customer_name: '',
        customer_contact: '',
        requirement: '',
        quantity: '',
        deadline: '',
        inquiry_number: '',
      })
    } catch (error) {
      console.error(error)
      alert('Error creating inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Inquiries</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'New Inquiry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                value={formData.customer_contact}
                onChange={(e) => setFormData({ ...formData, customer_contact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Phone or email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirement</label>
              <textarea
                value={formData.requirement}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5000 boxes, size 20x15x10cm, 4-color print"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Creating...' : 'Create Inquiry'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No inquiries yet. Create one to get started!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Inquiry #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/inquiries/${inquiry.id}`)}>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{inquiry.inquiry_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{inquiry.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{inquiry.quantity || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      inquiry.status === 'quoted' ? 'bg-yellow-100 text-yellow-800' :
                      inquiry.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
