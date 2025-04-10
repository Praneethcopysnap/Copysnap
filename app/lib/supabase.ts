import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Create a single instance to be used throughout the app
export const supabase = createClientComponentClient<Database>()

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