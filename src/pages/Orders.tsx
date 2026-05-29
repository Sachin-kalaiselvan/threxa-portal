import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getOrders, createOrder, updateOrderStatus } from '../lib/api'
import type { Order } from '../types'
import { Plus, ChevronDown } from 'lucide-react'

export function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [clientId, setClientId] = useState<string>('')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const statuses: Order['status'][] = [
    'design_approval',
    'in_production',
    'quality_check',
    'packed',
    'shipped',
    'delivered',
  ]

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          navigate('/login')
          return
        }
        setClientId(user.id)

        const data = await getOrders(user.id)
        setOrders(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [navigate])

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      const data = await getOrders(clientId)
      setOrders(data)
    } catch (error) {
      console.error(error)
      alert('Error updating status')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No orders yet. Convert an inquiry to create an order!
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="border-b last:border-b-0">
                <button
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div>
                      <p className="font-semibold text-gray-800">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'design_approval' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'in_production' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'quality_check' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'packed' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <ChevronDown size={20} className={`transition ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedOrderId === order.id && (
                  <div className="bg-gray-50 px-6 py-4 space-y-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Estimated Completion</p>
                        <p className="text-sm">{order.estimated_completion || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Shipment Date</p>
                        <p className="text-sm">{order.shipment_date || '-'}</p>
                      </div>
                      {order.tracking_number && (
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Tracking #</p>
                          <p className="text-sm font-mono">{order.tracking_number}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Update Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order.id, status)}
                            disabled={updatingOrderId === order.id}
                            className={`px-3 py-1 rounded text-sm transition ${
                              order.status === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            } disabled:opacity-50`}
                          >
                            {status.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
