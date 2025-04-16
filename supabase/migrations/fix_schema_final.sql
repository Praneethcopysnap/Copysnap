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

-- Check and recreate workspaces table if needed
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'workspaces'
  ) INTO table_exists;
  
  -- If table exists but might have wrong structure, drop and recreate it
  IF table_exists THEN
    -- Check if a specific required column exists with correct type
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'workspaces' 
      AND column_name = 'owner_id'
      AND data_type = 'uuid'
    ) THEN
      -- Backup existing table data if needed
      CREATE TABLE IF NOT EXISTS public.workspaces_backup AS SELECT * FROM public.workspaces;
      
      -- Drop and recreate with correct structure
      DROP TABLE public.workspaces;
      table_exists := FALSE;
    END IF;
  END IF;
  
  -- Create the table if it doesn't exist or was just dropped
  IF NOT table_exists THEN
    CREATE TABLE public.workspaces (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      owner_id UUID NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      members_count INTEGER DEFAULT 1,
      copy_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
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

-- Create RLS Policies with more permissive policies for workspaces
CREATE POLICY profiles_policy ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- More permissive workspace policy that allows insertion
CREATE POLICY workspaces_policy ON public.workspaces
  FOR ALL USING (true);

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