import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
      
      // Redirect to the verification success page
      return NextResponse.redirect(new URL('/auth/verification-success', request.url))
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL(`/login?error=Verification failed`, request.url)
      )
    }
  }

  // Return to login page if no code
  return NextResponse.redirect(new URL('/login', request.url))
} 