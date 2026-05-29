import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

console.log('=== Supabase Debug ===')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
console.log('✅ Supabase client initialized')
