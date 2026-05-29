import { supabase } from './supabase'
import type { Inquiry, Order, OrderStatusUpdate, Client } from '../types'

// CLIENTS
export async function getCurrentClient() {
  const { data } = await supabase.auth.getSession()
  const user = data?.session?.user
  
  if (!user) return null

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching client:', error)
    return null
  }
  return client as Client
}

// INQUIRIES
export async function getInquiries(clientId: string) {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Inquiry[]
}

export async function createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select()
  
  if (error) throw error
  return data[0] as Inquiry
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>) {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as Inquiry
}

// ORDERS
export async function getOrders(clientId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Order[]
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  
  if (error) throw error
  return data as Order
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
  
  if (error) throw error
  return data[0] as Order
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as Order
}

export async function updateOrderStatus(orderId: string, status: Order['status'], notes?: string) {
  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  
  if (updateError) throw updateError

  // Log status update
  const { error: logError } = await supabase
    .from('order_status_updates')
    .insert([{ order_id: orderId, status, notes, updated_at: new Date().toISOString() }])
  
  if (logError) throw logError
}

export async function getOrderStatusUpdates(orderId: string) {
  const { data, error } = await supabase
    .from('order_status_updates')
    .select('*')
    .eq('order_id', orderId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data as OrderStatusUpdate[]
}

// AUTH
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.user
}

export async function signOut() {
  await supabase.auth.signOut()
}
