import { supabase } from '@/app/lib/supabase';
import { Workspace } from '../types/workspace';

export const workspaceService = {
  // Update a workspace
  async updateWorkspace(id: string, updates: { name?: string; description?: string }) {
    try {
      console.log('Updating workspace:', id, updates);
      const { data, error } = await supabase
        .from('workspaces')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating workspace:', error);
        throw new Error(`Failed to update workspace: ${error.message}`);
      }

      console.log('Workspace updated:', data);
      return data;
    } catch (error) {
      console.error('Update workspace error:', error);
      throw error;
    }
  },

  // Delete a workspace
  async deleteWorkspace(id: string) {
    try {
      console.log('Deleting workspace:', id);
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting workspace:', error);
        throw new Error(`Failed to delete workspace: ${error.message}`);
      }

      console.log('Workspace deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete workspace error:', error);
      throw error;
    }
  },

  // Share a workspace (creates a shareable link)
  async shareWorkspace(id: string) {
    try {
      // In a production app, you might want to create a proper sharing system
      // For this demo, we'll just return the URL that can be copied
      const shareableUrl = `${window.location.origin}/workspaces/${id}`;
      console.log('Created shareable link:', shareableUrl);
      
      // You could also store sharing information in the database
      // For example, tracking who it's shared with, permissions, etc.
      
      return shareableUrl;
    } catch (error) {
      console.error('Share workspace error:', error);
      throw error;
    }
  }
}; 