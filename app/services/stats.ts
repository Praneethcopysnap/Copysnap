import { supabase } from '@/app/lib/supabase';

export interface UsageStats {
  wordsGenerated: {
    current: number;
    total: number;
    percentage: number;
  };
  generations: {
    count: number;
    thisMonth: number;
  };
  workspaces: {
    count: number;
    active: number;
  };
  lastRefresh: string;
}

export interface SummaryMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

interface UserPlan {
  monthly_word_limit: number;
  [key: string]: any;
}

interface Generation {
  id: string;
  suggestions: string[];
  timestamp: string;
  [key: string]: any;
}

export const statsService = {
  // Get user usage statistics
  async getUserStats(): Promise<UsageStats> {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        // Return default stats instead of throwing
        return this.getDefaultStats();
      }

      if (!user) {
        console.log('No authenticated user found, returning default stats');
        return this.getDefaultStats();
      }

      // 1. Get the user's plan limits (to calculate percentages)
      const { data: planData, error: planError } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Default to free plan limits
      let userPlan: UserPlan = {
        monthly_word_limit: 10000
      };
      
      if (planError && planError.code !== 'PGRST116') {
        console.error('Error fetching user plan:', planError);
      } else if (planData) {
        userPlan = planData as UserPlan;
      }

      const monthlyWordLimit = userPlan.monthly_word_limit;

      // 2. Get total word count from all generations
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const { data: generationsData, error: generationsError } = await supabase
        .from('copy_generations')
        .select('id, suggestions, timestamp')
        .eq('user_id', user.id);

      if (generationsError) {
        console.error('Error fetching generations:', generationsError);
        // Continue with empty generations instead of throwing
        return {
          wordsGenerated: {
            current: 0,
            total: monthlyWordLimit,
            percentage: 0
          },
          generations: {
            count: 0,
            thisMonth: 0
          },
          workspaces: {
            count: 0,
            active: 0
          },
          lastRefresh: new Date().toISOString()
        };
      }

      // Calculate words from all suggestions
      let totalWords = 0;
      let thisMonthWords = 0;
      let thisMonthGenerations = 0;
      
      if (generationsData && generationsData.length > 0) {
        for (const gen of generationsData as Generation[]) {
          if (Array.isArray(gen.suggestions)) {
            // Count words in each suggestion
            const wordsInGen = gen.suggestions.reduce((sum: number, suggestion: string) => {
              return sum + (suggestion?.split(/\s+/).length || 0);
            }, 0);
            
            totalWords += wordsInGen;
            
            // Check if this generation is from current month
            if (gen.timestamp && gen.timestamp >= firstDayOfMonth && gen.timestamp <= lastDayOfMonth) {
              thisMonthWords += wordsInGen;
              thisMonthGenerations++;
            }
          }
        }
      }

      // 3. Get workspace count
      const { count: workspaceCount, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      if (workspaceError) {
        console.error('Error counting workspaces:', workspaceError);
      }

      // Calculate active workspaces (with activity in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeWorkspaceCount, error: activeWorkspaceError } = await supabase
        .from('workspaces')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .gte('updated_at', thirtyDaysAgo.toISOString());

      if (activeWorkspaceError) {
        console.error('Error counting active workspaces:', activeWorkspaceError);
      }

      return {
        wordsGenerated: {
          current: thisMonthWords,
          total: monthlyWordLimit,
          percentage: Math.min(100, Math.round((thisMonthWords / monthlyWordLimit) * 100 * 10) / 10)
        },
        generations: {
          count: generationsData?.length || 0,
          thisMonth: thisMonthGenerations
        },
        workspaces: {
          count: workspaceCount || 0,
          active: activeWorkspaceCount || 0
        },
        lastRefresh: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      
      // Return default stats on error
      return {
        wordsGenerated: {
          current: 0,
          total: 10000,
          percentage: 0
        },
        generations: {
          count: 0,
          thisMonth: 0
        },
        workspaces: {
          count: 0,
          active: 0
        },
        lastRefresh: new Date().toISOString()
      };
    }
  },

  // Get summary metrics
  async getSummaryMetrics(): Promise<SummaryMetric[]> {
    try {
      const stats = await this.getUserStats();
      
      // Calculate weekly words (estimate as 25% of monthly)
      const weeklyWords = Math.round(stats.wordsGenerated.current * 0.25);
      
      // For demonstration, we're assuming growth compared to previous periods
      // In a real app, you would fetch historical data for comparisons
      return [
        {
          title: 'Active Projects',
          value: stats.workspaces.active.toString(),
          change: stats.workspaces.active > 0 ? '+1' : '0',
          trend: stats.workspaces.active > 0 ? 'up' : 'neutral',
          color: 'bg-blue-50'
        },
        {
          title: 'Weekly Words',
          value: weeklyWords.toLocaleString(),
          change: weeklyWords > 0 ? '+12%' : '0%',
          trend: weeklyWords > 0 ? 'up' : 'neutral',
          color: 'bg-green-50'
        },
        {
          title: 'Total Generations',
          value: stats.generations.count.toString(),
          change: stats.generations.thisMonth > 0 ? `+${stats.generations.thisMonth}` : '0',
          trend: stats.generations.thisMonth > 0 ? 'up' : 'neutral',
          color: 'bg-purple-50'
        },
        {
          title: 'Words Available',
          value: `${Math.round((stats.wordsGenerated.total - stats.wordsGenerated.current) / 1000)}K`,
          change: `${100 - stats.wordsGenerated.percentage}%`,
          trend: stats.wordsGenerated.percentage < 50 ? 'up' : 'down',
          color: 'bg-amber-50'
        }
      ];
    } catch (error) {
      console.error('Error in getSummaryMetrics:', error);
      
      // Return default metrics on error
      return [
        {
          title: 'Active Projects',
          value: '0',
          change: '0',
          trend: 'neutral',
          color: 'bg-blue-50'
        },
        {
          title: 'Weekly Words',
          value: '0',
          change: '0%',
          trend: 'neutral',
          color: 'bg-green-50'
        },
        {
          title: 'Total Generations',
          value: '0',
          change: '0',
          trend: 'neutral',
          color: 'bg-purple-50'
        },
        {
          title: 'Words Available',
          value: '10K',
          change: '100%',
          trend: 'up',
          color: 'bg-amber-50'
        }
      ];
    }
  },

  // Return default stats
  getDefaultStats(): UsageStats {
    return {
      wordsGenerated: {
        current: 0,
        total: 10000,
        percentage: 0
      },
      generations: {
        count: 0,
        thisMonth: 0
      },
      workspaces: {
        count: 0,
        active: 0
      },
      lastRefresh: new Date().toISOString()
    };
  }
}; 