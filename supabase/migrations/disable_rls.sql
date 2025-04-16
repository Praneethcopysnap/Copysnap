-- Temporarily disable RLS on workspaces table to fix infinite recursion
DROP POLICY IF EXISTS workspaces_select_policy ON public.workspaces;
DROP POLICY IF EXISTS workspaces_insert_policy ON public.workspaces;
DROP POLICY IF EXISTS workspaces_update_policy ON public.workspaces;
DROP POLICY IF EXISTS workspaces_delete_policy ON public.workspaces;
DROP POLICY IF EXISTS workspaces_policy ON public.workspaces;

-- Disable RLS completely on workspaces
ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;

-- Enable trusted security definer access
CREATE OR REPLACE FUNCTION get_workspaces_for_user(user_uuid UUID)
RETURNS SETOF public.workspaces
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.workspaces WHERE owner_id = user_uuid;
$$; 