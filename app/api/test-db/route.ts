import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Test the connection and check if profiles table exists
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'The profiles table might not exist. Please check your Supabase setup.'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      tableExists: true
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to connect to the database'
    }, { status: 500 })
  }
} 