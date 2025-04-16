-- Fix infinite recursion by dropping existing policy and creating more specific ones
DROP POLICY IF EXISTS workspaces_policy ON public.workspaces;

-- Create separate policies for different operations
CREATE POLICY workspaces_select_policy ON public.workspaces 
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY workspaces_insert_policy ON public.workspaces 
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY workspaces_update_policy ON public.workspaces 
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY workspaces_delete_policy ON public.workspaces 
  FOR DELETE USING (owner_id = auth.uid()); 