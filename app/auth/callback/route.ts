import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  
  console.log('Auth callback received:', { 
    url: request.url,
    hasCode: !!code, 
    type,
  })

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        throw error
      }
      
      console.log('Session exchange successful. User authenticated:', !!data?.user)
      
      // Handle password reset callback
      if (type === 'recovery') {
        console.log('Redirecting to reset-password page for password recovery')
        return NextResponse.redirect(new URL('/reset-password', request.url))
      }
      
      // For standard verification, redirect to success page
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
  console.log('No code provided in callback, redirecting to login')
  return NextResponse.redirect(new URL('/login', request.url))
} 