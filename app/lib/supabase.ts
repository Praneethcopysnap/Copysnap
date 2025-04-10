import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Environment check for SSG/build time
const isBrowser = typeof window !== 'undefined'
const hasSupabaseCredentials = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a Supabase client conditionally based on environment availability
export const supabase = isBrowser || hasSupabaseCredentials
  ? createClientComponentClient<Database>()
  : (null as any) // Fallback during build if credentials not available

// Create admin client with service role for admin operations
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables for admin operations')
    throw new Error('Missing required environment variables for admin operations')
  }
  
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey,
  })
} 