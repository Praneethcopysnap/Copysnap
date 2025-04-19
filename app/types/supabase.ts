export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          company: string | null;
          job_title: string | null;
          timezone: string | null;
          language: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          company?: string | null;
          job_title?: string | null;
          timezone?: string | null;
          language?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          company?: string | null;
          job_title?: string | null;
          timezone?: string | null;
          language?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          owner_id: string;
          figma_link: string | null;
          brand_voice_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          owner_id: string;
          figma_link?: string | null;
          brand_voice_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
          figma_link?: string | null;
          brand_voice_id?: string | null;
        };
      };
      api_keys: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          key_hash: string;
          created_by: string;
          created_at: string;
          expires_at: string | null;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          key_hash: string;
          created_by: string;
          created_at?: string;
          expires_at?: string | null;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          key_hash?: string;
          created_by?: string;
          created_at?: string;
          expires_at?: string | null;
          last_used_at?: string | null;
        };
      };
      copy_generations: {
        Row: {
          id: string;
          workspace_id: string;
          prompt: string;
          result: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          prompt: string;
          result: string;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          prompt?: string;
          result?: string;
          created_at?: string;
          created_by?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
