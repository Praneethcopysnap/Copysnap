import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Environment check for SSG/build time
const isBrowser = typeof window !== 'undefined'
const hasSupabaseCredentials = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client that returns empty responses for build/SSG
const createMockClient = () => {
  const mockFunctions = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: null, error: null }),
      single: () => ({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  }
  
  return mockFunctions
}

// Create a Supabase client conditionally based on environment availability
export const supabase = isBrowser || hasSupabaseCredentials
  ? createClientComponentClient<Database>()
  : createMockClient() as any // Use mock client during build if credentials not available

// Create admin client with service role for admin operations
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase environment variables for admin operations')
    return createMockClient() as any
  }
  
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey,
  })
} 