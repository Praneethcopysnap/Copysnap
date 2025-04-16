-- Step 1: Create tables without foreign key constraints and policies first
-- Create profiles table first
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create basic workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  members_count INTEGER DEFAULT 1,
  copy_count INTEGER DEFAULT 0
);

-- Create copy_generations table
CREATE TABLE IF NOT EXISTS copy_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  workspace_id UUID,
  type TEXT NOT NULL,
  tone TEXT NOT NULL,
  context TEXT,
  element_name TEXT,
  element_type TEXT,
  suggestions JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create copy_history table
CREATE TABLE IF NOT EXISTS copy_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  workspace_id UUID,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create brand_voice table
CREATE TABLE IF NOT EXISTS brand_voice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  tone TEXT[] DEFAULT ARRAY['professional'],
  custom_rules TEXT,
  examples TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 2: Add constraints in a separate transaction
DO $$ 
BEGIN 
  -- First check if auth.users table exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
  ) THEN
    -- Add foreign key constraint to profiles
    BEGIN
      ALTER TABLE profiles
        ADD CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Error adding constraint to profiles: %', SQLERRM;
    END;
    
    -- Add foreign key constraints to workspaces
    BEGIN
      ALTER TABLE workspaces
        ADD CONSTRAINT workspaces_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Error adding constraint to workspaces: %', SQLERRM;
    END;
    
    -- Add foreign key constraints to copy_generations
    BEGIN
      ALTER TABLE copy_generations
        ADD CONSTRAINT copy_generations_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
        
      ALTER TABLE copy_generations
        ADD CONSTRAINT copy_generations_workspace_id_fkey
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Error adding constraint to copy_generations: %', SQLERRM;
    END;
    
    -- Add foreign key constraints to copy_history
    BEGIN
      ALTER TABLE copy_history
        ADD CONSTRAINT copy_history_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
        
      ALTER TABLE copy_history
        ADD CONSTRAINT copy_history_workspace_id_fkey
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Error adding constraint to copy_history: %', SQLERRM;
    END;
    
    -- Add foreign key constraints to brand_voice
    BEGIN
      ALTER TABLE brand_voice
        ADD CONSTRAINT brand_voice_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
        
      ALTER TABLE brand_voice
        ADD CONSTRAINT brand_voice_user_id_key
        UNIQUE (user_id);
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Error adding constraint to brand_voice: %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE 'Auth schema not found or users table does not exist';
  END IF;
END $$;

-- Step 3: Create indices
CREATE INDEX IF NOT EXISTS workspaces_user_id_idx ON workspaces(user_id);

-- Step 4: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies (with DROP IF EXISTS for safety)
-- Profiles policies
DROP POLICY IF EXISTS select_own_profile ON profiles;
CREATE POLICY select_own_profile ON profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS update_own_profile ON profiles;
CREATE POLICY update_own_profile ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Workspaces policies
DROP POLICY IF EXISTS select_own_workspaces ON workspaces;
CREATE POLICY select_own_workspaces ON workspaces FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_workspaces ON workspaces;
CREATE POLICY insert_own_workspaces ON workspaces FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_workspaces ON workspaces;
CREATE POLICY update_own_workspaces ON workspaces FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS delete_own_workspaces ON workspaces;
CREATE POLICY delete_own_workspaces ON workspaces FOR DELETE 
  USING (auth.uid() = user_id);

-- Copy generations policies
DROP POLICY IF EXISTS select_own_generations ON copy_generations;
CREATE POLICY select_own_generations ON copy_generations FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_generations ON copy_generations;
CREATE POLICY insert_own_generations ON copy_generations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Copy history policies
DROP POLICY IF EXISTS select_own_history ON copy_history;
CREATE POLICY select_own_history ON copy_history FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_history ON copy_history;
CREATE POLICY insert_own_history ON copy_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Brand voice policies
DROP POLICY IF EXISTS select_own_brand_voice ON brand_voice;
CREATE POLICY select_own_brand_voice ON brand_voice FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS upsert_own_brand_voice ON brand_voice;
CREATE POLICY upsert_own_brand_voice ON brand_voice FOR ALL 
  USING (auth.uid() = user_id);

-- Step 6: Create functions 
CREATE OR REPLACE FUNCTION increment(row_id uuid, field_name text, n int)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE workspaces SET %I = %I + $1 WHERE id = $2', field_name, field_name)
  USING n, row_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment(x int)
RETURNS int AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql; 