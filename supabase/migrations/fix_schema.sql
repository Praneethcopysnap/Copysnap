-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  job_title TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en-US',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- The workspaces table already exists with: id, name, description, owner_id, created_at, updated_at
-- Add missing columns to workspaces if needed
DO $$
BEGIN
  -- Add members_count if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_attribute 
                WHERE attrelid = 'public.workspaces'::regclass
                AND attname = 'members_count' 
                AND NOT attisdropped) THEN
    ALTER TABLE public.workspaces ADD COLUMN members_count INTEGER DEFAULT 1;
  END IF;

  -- Add copy_count if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_attribute 
                WHERE attrelid = 'public.workspaces'::regclass
                AND attname = 'copy_count' 
                AND NOT attisdropped) THEN
    ALTER TABLE public.workspaces ADD COLUMN copy_count INTEGER DEFAULT 0;
  END IF;
END
$$;

-- Create copy_generations table
CREATE TABLE IF NOT EXISTS public.copy_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT,
  tone TEXT,
  context TEXT,
  element_name TEXT,
  element_type TEXT,
  suggestions JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create copy_history table
CREATE TABLE IF NOT EXISTS public.copy_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create brand_voice table
CREATE TABLE IF NOT EXISTS public.brand_voice (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT,
  tone TEXT,
  custom_rules TEXT,
  examples TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_voice ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present to avoid errors
DROP POLICY IF EXISTS profiles_policy ON public.profiles;
DROP POLICY IF EXISTS workspaces_policy ON public.workspaces;
DROP POLICY IF EXISTS copy_generations_policy ON public.copy_generations;
DROP POLICY IF EXISTS copy_history_policy ON public.copy_history;
DROP POLICY IF EXISTS brand_voice_policy ON public.brand_voice;

-- Create RLS Policies - using owner_id for workspaces
CREATE POLICY profiles_policy ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY workspaces_policy ON public.workspaces
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY copy_generations_policy ON public.copy_generations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY copy_history_policy ON public.copy_history
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY brand_voice_policy ON public.brand_voice
  FOR ALL USING (auth.uid() = user_id);

-- Create function for incrementing counters
CREATE OR REPLACE FUNCTION increment(val integer) RETURNS integer AS $$
BEGIN
  RETURN val + 1;
END;
$$ LANGUAGE plpgsql; 