import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Workspace = Database['public']['Tables']['workspaces']['Row']
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row']

export const workspaceService = {
  // Create a new workspace
  async createWorkspace(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert([{ name, description, owner_id: user.id }])
      .select()
      .single()

    if (workspaceError) throw workspaceError

    // Add the owner as a member
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert([{ workspace_id: workspace.id, user_id: user.id, role: 'owner' }])

    if (memberError) throw memberError

    return workspace
  },

  // Get all workspaces for the current user
  async getUserWorkspaces() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members!inner (
          user_id,
          role
        )
      `)
      .eq('workspace_members.user_id', user.id)

    if (error) throw error
    return data
  },

  // Get a single workspace by ID
  async getWorkspace(id: string) {
    const { data, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members (
          user_id,
          role
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update a workspace
  async updateWorkspace(id: string, updates: Partial<Workspace>) {
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a workspace
  async deleteWorkspace(id: string) {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Add a member to a workspace
  async addWorkspaceMember(workspaceId: string, userId: string, role: 'admin' | 'member' = 'member') {
    const { data, error } = await supabase
      .from('workspace_members')
      .insert([{ workspace_id: workspaceId, user_id: userId, role }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Remove a member from a workspace
  async removeWorkspaceMember(workspaceId: string, userId: string) {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Update a member's role
  async updateMemberRole(workspaceId: string, userId: string, role: 'admin' | 'member') {
    const { data, error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
} 