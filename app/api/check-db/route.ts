import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Define an interface for the table status entries
interface TableStatus {
  table: string;
  exists: boolean;
  error: string | null;
}

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Array to store the status of each required table
    const tableStatus: TableStatus[] = [];

    // Check if the profiles table exists
    const { data: profilesExists, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    tableStatus.push({
      table: 'profiles',
      exists: !profilesError,
      error: profilesError ? profilesError.message : null
    });

    // Check if the workspaces table exists
    const { data: workspacesExists, error: workspacesError } = await supabase
      .from('workspaces')
      .select('id')
      .limit(1)

    tableStatus.push({
      table: 'workspaces',
      exists: !workspacesError,
      error: workspacesError ? workspacesError.message : null
    });

    // Check if the copy_generations table exists
    const { data: copyGenerationsExists, error: copyGenerationsError } = await supabase
      .from('copy_generations')
      .select('id')
      .limit(1)

    tableStatus.push({
      table: 'copy_generations',
      exists: !copyGenerationsError,
      error: copyGenerationsError ? copyGenerationsError.message : null
    });

    // Check if the brand_voice table exists
    const { data: brandVoiceExists, error: brandVoiceError } = await supabase
      .from('brand_voice')
      .select('id')
      .limit(1)

    tableStatus.push({
      table: 'brand_voice',
      exists: !brandVoiceError,
      error: brandVoiceError ? brandVoiceError.message : null
    });

    // Check if the copy_history table exists
    const { data: copyHistoryExists, error: copyHistoryError } = await supabase
      .from('copy_history')
      .select('id')
      .limit(1)

    tableStatus.push({
      table: 'copy_history',
      exists: !copyHistoryError,
      error: copyHistoryError ? copyHistoryError.message : null
    });

    // Prepare SQL statements for any missing tables
    const sqlStatements: string[] = [];

    if (profilesError) {
      sqlStatements.push(`
        CREATE TABLE IF NOT EXISTS public.profiles (
          id uuid REFERENCES auth.users ON DELETE CASCADE,
          full_name text,
          email text,
          company text,
          job_title text,
          timezone text,
          language text,
          avatar_url text,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          PRIMARY KEY (id)
        );

        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Public profiles are viewable by everyone."
          ON public.profiles FOR SELECT
          USING (true);

        CREATE POLICY "Users can insert their own profile."
          ON public.profiles FOR INSERT
          WITH CHECK (auth.uid() = id);

        CREATE POLICY "Users can update own profile."
          ON public.profiles FOR UPDATE
          USING (auth.uid() = id);
      `);
    }

    if (workspacesError) {
      sqlStatements.push(`
        CREATE TABLE IF NOT EXISTS public.workspaces (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
          name text NOT NULL,
          description text,
          copy_count integer DEFAULT 0,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own workspaces."
          ON public.workspaces FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own workspaces."
          ON public.workspaces FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own workspaces."
          ON public.workspaces FOR UPDATE
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own workspaces."
          ON public.workspaces FOR DELETE
          USING (auth.uid() = user_id);
      `);
    }

    if (copyGenerationsError) {
      sqlStatements.push(`
        CREATE TABLE IF NOT EXISTS public.copy_generations (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
          workspace_id uuid REFERENCES public.workspaces ON DELETE CASCADE,
          type text NOT NULL,
          tone text NOT NULL,
          context text,
          element_name text,
          element_type text,
          suggestions jsonb,
          selected_suggestion text,
          timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        ALTER TABLE public.copy_generations ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own copy generations."
          ON public.copy_generations FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own copy generations."
          ON public.copy_generations FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own copy generations."
          ON public.copy_generations FOR UPDATE
          USING (auth.uid() = user_id);
      `);
    }

    if (brandVoiceError) {
      sqlStatements.push(`
        CREATE TABLE IF NOT EXISTS public.brand_voice (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
          tone text[] NOT NULL,
          custom_rules text,
          examples text,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        ALTER TABLE public.brand_voice ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own brand voice settings."
          ON public.brand_voice FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own brand voice settings."
          ON public.brand_voice FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own brand voice settings."
          ON public.brand_voice FOR UPDATE
          USING (auth.uid() = user_id);
      `);
    }

    if (copyHistoryError) {
      sqlStatements.push(`
        CREATE TABLE IF NOT EXISTS public.copy_history (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
          workspace_id uuid REFERENCES public.workspaces ON DELETE CASCADE,
          type text NOT NULL,
          content text NOT NULL,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        ALTER TABLE public.copy_history ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own copy history."
          ON public.copy_history FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert into their own copy history."
          ON public.copy_history FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can delete from their own copy history."
          ON public.copy_history FOR DELETE
          USING (auth.uid() = user_id);
      `);
    }

    return NextResponse.json({ 
      success: true, 
      tableStatus: tableStatus,
      createStatements: sqlStatements
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Error checking database structure' },
      { status: 500 }
    )
  }
} 