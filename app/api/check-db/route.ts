import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // First check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (tableError) {
      return NextResponse.json({ 
        success: false, 
        error: tableError.message,
        details: 'The profiles table might not exist or you might not have the correct permissions.',
        suggestion: 'Please run the following SQL in your Supabase dashboard:\n\n' +
          'CREATE TABLE IF NOT EXISTS public.profiles (\n' +
          '  id uuid REFERENCES auth.users ON DELETE CASCADE,\n' +
          '  full_name text,\n' +
          '  company text,\n' +
          '  job_title text,\n' +
          '  timezone text,\n' +
          '  language text,\n' +
          '  avatar_url text,\n' +
          '  created_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,\n' +
          '  updated_at timestamp with time zone DEFAULT timezone(\'utc\'::text, now()) NOT NULL,\n' +
          '  PRIMARY KEY (id)\n' +
          ');\n\n' +
          'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\n' +
          'CREATE POLICY "Public profiles are viewable by everyone."\n' +
          '  ON public.profiles FOR SELECT\n' +
          '  USING (true);\n\n' +
          'CREATE POLICY "Users can insert their own profile."\n' +
          '  ON public.profiles FOR INSERT\n' +
          '  WITH CHECK (auth.uid() = id);\n\n' +
          'CREATE POLICY "Users can update own profile."\n' +
          '  ON public.profiles FOR UPDATE\n' +
          '  USING (auth.uid() = id);'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      tableExists: true,
      tableStructure: 'Profiles table exists and is accessible'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to connect to the database. Please check your Supabase credentials in .env.local'
    }, { status: 500 })
  }
} 