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
        Insert: {
          id: string
          email?: string | null
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
          email?: string | null
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
          copy_count: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
          copy_count?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
          copy_count?: number
        }
      }
      copy_generations: {
        Row: {
          id: string
          user_id: string
          workspace_id: string | null
          type: string
          tone: string
          context: string | null
          element_name: string | null
          element_type: string | null
          suggestions: string[]
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id?: string | null
          type: string
          tone: string
          context?: string | null
          element_name?: string | null
          element_type?: string | null
          suggestions: string[]
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string | null
          type?: string
          tone?: string
          context?: string | null
          element_name?: string | null
          element_type?: string | null
          suggestions?: string[]
          timestamp?: string
        }
      }
      brand_voice: {
        Row: {
          id: string
          user_id: string
          custom_rules: string | null
          examples: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          custom_rules?: string | null
          examples?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          custom_rules?: string | null
          examples?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      copy_history: {
        Row: {
          id: string
          user_id: string
          workspace_id: string
          type: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id: string
          type: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string
          type?: string
          content?: string
          created_at?: string
        }
      }
    }
    Functions: {
      increment: {
        Args: {
          x: number
        }
        Returns: number
      }
    }
  }
} 