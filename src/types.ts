export interface Client {
  id: string
  name: string
  email: string
  whatsapp_number?: string
  tier: 'launch' | 'growth' | 'pro'
  active_modules: string[]
  created_at: string
}

export interface Inquiry {
  id: string
  client_id: string
  inquiry_number: string
  customer_name: string
  customer_contact: string
  requirement?: string
  quantity?: number
  deadline?: string
  quoted_price?: number
  status: 'new' | 'quoted' | 'confirmed' | 'in_production' | 'completed'
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  client_id: string
  inquiry_id?: string
  order_number: string
  customer_name: string
  status: 'design_approval' | 'in_production' | 'quality_check' | 'packed' | 'shipped' | 'delivered'
  production_started_at?: string
  estimated_completion?: string
  actual_completion_at?: string
  shipment_date?: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface OrderStatusUpdate {
  id: string
  order_id: string
  status: string
  notes?: string
  updated_at: string
}
