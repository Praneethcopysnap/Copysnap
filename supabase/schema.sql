-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    company TEXT,
    job_title TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en-US',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create workspaces table
CREATE TABLE public.workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create workspace_members table
CREATE TABLE public.workspace_members (
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role workspace_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (workspace_id, user_id)
);

-- Create copy_entries table
CREATE TABLE public.copy_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    context TEXT,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create brand_settings table
CREATE TABLE public.brand_settings (
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE PRIMARY KEY,
    tone TEXT,
    style TEXT,
    guidelines TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create api_keys table
CREATE TABLE public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_workspaces_owner_id ON public.workspaces(owner_id);
CREATE INDEX idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX idx_copy_entries_workspace_id ON public.copy_entries(workspace_id);
CREATE INDEX idx_copy_entries_created_by ON public.copy_entries(created_by);
CREATE INDEX idx_api_keys_workspace_id ON public.api_keys(workspace_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Set up Row Level Security (RLS) policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Workspaces policies
CREATE POLICY "Users can view workspaces they are members of"
    ON public.workspaces FOR SELECT
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = workspaces.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create workspaces"
    ON public.workspaces FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update their workspaces"
    ON public.workspaces FOR UPDATE
    USING (auth.uid() = owner_id);

-- Workspace members policies
CREATE POLICY "Users can view members of workspaces they belong to"
    ON public.workspace_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_id AND owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = workspace_members.workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can manage members"
    ON public.workspace_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_id AND owner_id = auth.uid()
        )
    );

-- Copy entries policies
CREATE POLICY "Users can view copy entries in workspaces they belong to"
    ON public.copy_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = copy_entries.workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create copy entries in workspaces they belong to"
    ON public.copy_entries FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = copy_entries.workspace_id AND user_id = auth.uid()
        )
    );

-- Brand settings policies
CREATE POLICY "Users can view brand settings of workspaces they belong to"
    ON public.brand_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = brand_settings.workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can manage brand settings"
    ON public.brand_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_id AND owner_id = auth.uid()
        )
    );

-- API keys policies
CREATE POLICY "Users can view API keys of workspaces they belong to"
    ON public.api_keys FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = api_keys.workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can manage API keys"
    ON public.api_keys FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_id AND owner_id = auth.uid()
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 