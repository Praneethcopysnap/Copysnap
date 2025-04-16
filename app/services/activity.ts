import { supabase } from '@/app/lib/supabase';

export interface Activity {
  id: string;
  type: 'edit' | 'create' | 'share' | 'member' | 'generate';
  description: string;
  timestamp: string;
  workspace_id?: string;
  workspace_name?: string;
  user_id: string;
  created_at: string;
}

// Interface for the raw activity data from Supabase
interface RawActivity {
  id: string;
  type: Activity['type'];
  description: string;
  workspace_id?: string;
  workspaces?: { name: string };
  user_id: string;
  created_at: string;
  [key: string]: any; // For any additional fields
}

export const activityService = {
  // Get recent activities for the current user
  async getUserActivities(limit: number = 10) {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        // Return empty array instead of throwing
        return [];
      }

      if (!user) {
        return [];
      }

      // Fetch user activities from Supabase
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          *,
          workspaces:workspace_id (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activities:', error);
        // Just return empty array when table doesn't exist
        return [];
      }

      // Transform data for display
      const activities: Activity[] = (data as RawActivity[]).map(item => {
        const createdAt = new Date(item.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createdAt.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timestamp = '';
        if (diffDays === 0) {
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            timestamp = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
          } else {
            timestamp = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          }
        } else if (diffDays === 1) {
          timestamp = 'Yesterday';
        } else if (diffDays < 7) {
          timestamp = `${diffDays} days ago`;
        } else {
          timestamp = createdAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        }

        return {
          id: item.id,
          type: item.type,
          description: item.description,
          timestamp,
          workspace_id: item.workspace_id,
          workspace_name: item.workspaces?.name,
          user_id: item.user_id,
          created_at: item.created_at
        };
      });

      return activities;
    } catch (error) {
      console.error('Error in getUserActivities:', error);
      return [];
    }
  },

  // Log a new activity
  async logActivity(type: Activity['type'], description: string, workspaceId?: string) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        return;
      }

      const { error } = await supabase
        .from('user_activities')
        .insert({
          type,
          description,
          workspace_id: workspaceId,
          user_id: user.id,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  }
}; 