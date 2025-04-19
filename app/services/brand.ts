import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type BrandSettings = {
  id: string;
  workspace_id: string;
  tone: string | null;
  voice: string | null;
  audience: string | null;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
}

export const brandService = {
  // Get brand settings for a workspace
  async getWorkspaceBrandSettings(workspaceId: string) {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single()

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        return this.createBrandSettings(workspaceId)
      }
      throw error
    }
    return data
  },

  // Create brand settings for a workspace
  async createBrandSettings(workspaceId: string, settings?: Partial<BrandSettings>) {
    const { data, error } = await supabase
      .from('brand_settings')
      .insert([{ 
        workspace_id: workspaceId,
        ...settings
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update brand settings
  async updateBrandSettings(workspaceId: string, updates: Partial<BrandSettings>) {
    const { data, error } = await supabase
      .from('brand_settings')
      .update(updates)
      .eq('workspace_id', workspaceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete brand settings
  async deleteBrandSettings(workspaceId: string) {
    const { error } = await supabase
      .from('brand_settings')
      .delete()
      .eq('workspace_id', workspaceId)

    if (error) throw error
  }
} 