import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client using service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables for admin operations');
}

// Use proper server-side client for admin operations
const supabaseAdmin = createClient(
  supabaseUrl || '',
  serviceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  if (!userId) {
    console.error('Missing userId in API request');
    return NextResponse.json({ message: 'Missing or invalid userId' }, { status: 400 })
  }

  console.log(`Attempting to delete user: ${userId}`);

  try {
    // Step 1: Delete profile from profiles table first
    console.log('Step 1: Deleting user profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      return NextResponse.json(
        { message: 'Failed to delete user profile', error: profileError.message },
        { status: 500 }
      )
    }

    console.log('Profile deleted successfully');

    // Step 2: Delete from Supabase Auth
    console.log('Step 2: Deleting user from auth...');
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting user from auth:', authError);
      return NextResponse.json(
        { message: 'Failed to delete user from auth', error: authError.message },
        { status: 500 }
      )
    }

    console.log('User deleted successfully from auth');
    return NextResponse.json({ message: 'User and profile deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error during user deletion:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 