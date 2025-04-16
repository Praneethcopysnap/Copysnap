import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    switch (body.action) {
      case 'set-user': {
        // Create a mock session - helpful for development when auth isn't working
        const mockUser = {
          id: 'mock-user-id',
          email: 'demo@example.com',
          user_metadata: {
            full_name: 'Demo User'
          }
        };
        
        // Set mock cookie session
        cookies().set('supabase-auth-token', JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_at: Date.now() + 3600000, // 1 hour
          user: mockUser
        }));
        
        return NextResponse.json({ success: true, user: mockUser });
      }
      
      case 'clear-user': {
        // Clear auth session
        cookies().delete('supabase-auth-token');
        return NextResponse.json({ success: true });
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in mock auth endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 