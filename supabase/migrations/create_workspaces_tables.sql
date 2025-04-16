-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  members_count INTEGER DEFAULT 1,
  copy_count INTEGER DEFAULT 0
);

-- Create RLS policies for workspaces table
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own workspaces
CREATE POLICY select_own_workspaces ON workspaces
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own workspaces
CREATE POLICY insert_own_workspaces ON workspaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own workspaces
CREATE POLICY update_own_workspaces ON workspaces
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own workspaces
CREATE POLICY delete_own_workspaces ON workspaces
  FOR DELETE USING (auth.uid() = user_id);

-- Create copy_generations table to track generated copies
CREATE TABLE IF NOT EXISTS copy_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  tone TEXT NOT NULL,
  context TEXT,
  element_name TEXT,
  element_type TEXT,
  suggestions JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for copy_generations
ALTER TABLE copy_generations ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own copy generations
CREATE POLICY select_own_generations ON copy_generations
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own copy generations
CREATE POLICY insert_own_generations ON copy_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create copy_history table
CREATE TABLE IF NOT EXISTS copy_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for copy_history
ALTER TABLE copy_history ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own copy history
CREATE POLICY select_own_history ON copy_history
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert into their own copy history
CREATE POLICY insert_own_history ON copy_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to increment counter fields
CREATE OR REPLACE FUNCTION increment(row_id uuid, field_name text, n int)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE workspaces SET %I = %I + $1 WHERE id = $2', field_name, field_name)
  USING n, row_id;
END;
$$ LANGUAGE plpgsql;

-- Create rpc to increment a value
CREATE OR REPLACE FUNCTION increment(x int)
RETURNS int AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql; 