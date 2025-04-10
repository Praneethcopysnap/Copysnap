import { supabase } from '@/app/lib/supabase'
import { Database } from '@/types/supabase'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  company: string | null
  job_title: string | null
  timezone: string | null
  language: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export const profileService = {
  // Get the current user's profile
  async getCurrentUserProfile() {
    try {
      console.log('Fetching current user...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Error getting current user:', userError)
        throw new Error('Failed to get current user')
      }

      if (!user) {
        console.log('No authenticated user found')
        return null
      }

      console.log('Current user:', user)
      
      // Try to get existing profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        // If profile doesn't exist, create one
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...')
          const defaultProfile = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            timezone: 'UTC',
            language: 'en-US',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            company: null,
            job_title: null,
            avatar_url: null,
            website: null,
            bio: null
          }
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([defaultProfile])
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
            throw new Error('Failed to create profile')
          }

          console.log('New profile created:', newProfile)
          return newProfile
        }
        throw new Error('Failed to fetch profile')
      }

      console.log('Profile fetched successfully:', profile)
      return profile
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error)
      throw error
    }
  },

  // Update the current user's profile
  async updateProfile(updates: Partial<Profile>) {
    try {
      console.log('Updating profile with:', updates)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No authenticated user found')
      }

      // Don't allow updating email through this method
      const { email, ...safeUpdates } = updates

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...safeUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        throw new Error('Failed to update profile')
      }

      console.log('Updated profile:', data)
      return data
    } catch (error) {
      console.error('Error in updateProfile:', error)
      throw error
    }
  },

  // Create a new profile (usually called after user signup)
  async createProfile(userId: string, profileData: Partial<Profile>) {
    console.log('Creating profile with:', { userId, profileData });
    
    const defaultProfile = {
      id: userId,
      full_name: profileData.full_name || '',
      company: null,
      job_title: null,
      timezone: 'UTC',
      language: 'en-US',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...defaultProfile, ...profileData }])
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    console.log('Created profile:', data);
    return data
  },

  async checkEmailExists(email: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return !!data
    } catch (error) {
      console.error('Error checking email:', error)
      throw error
    }
  },

  // Delete a user's profile
  async deleteProfile(userId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting profile:', error);
        throw new Error('Failed to delete profile');
      }

      console.log('Profile deleted successfully');
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw error;
    }
  }
} 