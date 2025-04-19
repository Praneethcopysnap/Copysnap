import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Create Supabase client using environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      error: 'Supabase credentials not configured',
      status: 'error',
      environment: process.env.NODE_ENV || 'unknown'
    }, { status: 500 });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check if we can connect to the database
    const { data: health, error } = await supabase.from('_health_check').select('*').limit(1);
    
    if (error) {
      throw error;
    }
    
    // Check if key tables exist
    const { data: profilesExists } = await supabase.from('profiles').select('id').limit(1);
    const { data: workspacesExists } = await supabase.from('workspaces').select('id').limit(1);
    const { data: copyExists } = await supabase.from('copy').select('id').limit(1);
    
    return NextResponse.json({
      status: 'connected',
      environment: process.env.NODE_ENV || 'unknown',
      supabase: {
        url: supabaseUrl,
        keyAvailable: !!supabaseKey,
        tables: {
          profiles: !!profilesExists,
          workspaces: !!workspacesExists,
          copy: !!copyExists
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Failed to connect to database',
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 