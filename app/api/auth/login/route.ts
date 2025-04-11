import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, source } = await request.json();
    
    // Validate that this is a request from our Figma plugin
    if (source !== 'figma_plugin') {
      return NextResponse.json(
        { error: 'Unauthorized source' },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Attempt to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Authentication error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Return user data and session token
    return NextResponse.json({
      id: data.user.id,
      name: data.user.user_metadata.full_name || email.split('@')[0],
      email: data.user.email,
      token: data.session.access_token,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 