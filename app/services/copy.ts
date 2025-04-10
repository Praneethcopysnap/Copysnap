import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type CopyEntry = Database['public']['Tables']['copy_entries']['Row']

export const copyService = {
  // Create a new copy entry
  async createCopyEntry(workspaceId: string, name: string, content: string, context?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('copy_entries')
      .insert([{ 
        workspace_id: workspaceId,
        name,
        content,
        context,
        created_by: user.id
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get all copy entries for a workspace
  async getWorkspaceCopyEntries(workspaceId: string) {
    const { data, error } = await supabase
      .from('copy_entries')
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

  // Get a single copy entry by ID
  async getCopyEntry(id: string) {
    const { data, error } = await supabase
      .from('copy_entries')
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

  // Update a copy entry
  async updateCopyEntry(id: string, updates: Partial<CopyEntry>) {
    const { data, error } = await supabase
      .from('copy_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a copy entry
  async deleteCopyEntry(id: string) {
    const { error } = await supabase
      .from('copy_entries')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Search copy entries
  async searchCopyEntries(workspaceId: string, query: string) {
    const { data, error } = await supabase
      .from('copy_entries')
      .select(`
        *,
        profiles:created_by (
          full_name
        )
      `)
      .eq('workspace_id', workspaceId)
      .or(`name.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 