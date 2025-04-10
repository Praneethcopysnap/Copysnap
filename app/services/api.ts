import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { randomBytes } from 'crypto'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type ApiKey = Database['public']['Tables']['api_keys']['Row']

export const apiService = {
  // Generate a new API key
  generateApiKey(): { key: string; hash: string } {
    const key = randomBytes(32).toString('hex')
    // In a real app, you would hash this with a secure hashing algorithm
    // For demo purposes, we'll just use a simple hash
    const hash = Buffer.from(key).toString('base64')
    return { key, hash }
  },

  // Create a new API key for a workspace
  async createApiKey(workspaceId: string, name: string, expiresAt?: Date) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { key, hash } = this.generateApiKey()

    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ 
        workspace_id: workspaceId,
        name,
        key_hash: hash,
        created_by: user.id,
        expires_at: expiresAt?.toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    // Return the API key only once
    return { ...data, key }
  },

  // Get all API keys for a workspace
  async getWorkspaceApiKeys(workspaceId: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select(`
        *,
        profiles:created_by (
          full_name
        )
      `)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get a single API key by ID
  async getApiKey(id: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select(`
        *,
        profiles:created_by (
          full_name
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Delete an API key
  async deleteApiKey(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Update an API key's last used timestamp
  async updateLastUsed(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },

  // Validate an API key
  async validateApiKey(key: string) {
    const hash = Buffer.from(key).toString('base64')
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', hash)
      .single()

    if (error) throw error
    return data
  }
} 