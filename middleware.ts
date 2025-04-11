import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase credentials are available
  const hasSupabaseCredentials = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // If credentials are missing (during build/deployment), allow the request to proceed
  if (!hasSupabaseCredentials) {
    console.warn('Supabase credentials not available in middleware')
    return res
  }
  
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is not signed in and the current path is not / or /login or /signup or /forgot-password,
    // and not an API route, redirect the user to /login
    if (!session && 
        !['/login', '/signup', '/', '/forgot-password'].includes(request.nextUrl.pathname) && 
        !request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is signed in and the current path is /login or /signup,
    // redirect the user to /dashboard
    if (session && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    console.error('Error in middleware:', error)
    // Allow the request to proceed even if there's an error
    return res
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
} 