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

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {client?.name}</h1>
        <p className="text-gray-600 mt-2">Tier: <span className="font-semibold uppercase">{client?.tier}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {client?.active_modules.includes('inquiries') && (
          <DashboardCard
            title="Inquiry Management"
            description="View and manage customer inquiries"
            onClick={() => navigate('/inquiries')}
            color="bg-blue-500"
          />
        )}
        {client?.active_modules.includes('orders') && (
          <DashboardCard
            title="Order Tracking"
            description="Track production status and shipping"
            onClick={() => navigate('/orders')}
            color="bg-green-500"
          />
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
        <p className="text-sm">
          <strong>Quick tip:</strong> Use the navigation on the left to access all features. Your data is securely stored and isolated to your account.
        </p>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  onClick,
  color,
}: {
  title: string
  description: string
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer text-left`}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-white/90 mt-2">{description}</p>
    </button>
  )
}
