export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company: string | null
          job_title: string | null
          timezone: string | null
          language: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company?: string | null
          job_title?: string | null
          timezone?: string | null
          language?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company?: string | null
          job_title?: string | null
          timezone?: string | null
          language?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      copy_entries: {
        Row: {
          id: string
          workspace_id: string
          name: string
          content: string
          context: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          content: string
          context?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          content?: string
          context?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      brand_settings: {
        Row: {
          workspace_id: string
          tone: string | null
          style: string | null
          guidelines: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          workspace_id: string
          tone?: string | null
          style?: string | null
          guidelines?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          workspace_id?: string
          tone?: string | null
          style?: string | null
          guidelines?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          workspace_id: string
          name: string
          key_hash: string
          created_by: string
          created_at: string
          expires_at: string | null
          last_used_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          key_hash: string
          created_by: string
          created_at?: string
          expires_at?: string | null
          last_used_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          key_hash?: string
          created_by?: string
          created_at?: string
          expires_at?: string | null
          last_used_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'owner' | 'admin' | 'member'
      workspace_role: 'owner' | 'admin' | 'member'
    }
  }
} 