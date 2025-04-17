import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of paths that are publicly accessible without authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/auth/callback',
  '/auth/verification-success'
]

// Check if a path is public
const isPublicPath = (pathname: string) => {
  // Allow all API routes
  if (pathname.startsWith('/api/')) {
    return true
  }
  
  // Check exact matches
  return PUBLIC_PATHS.includes(pathname)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Middleware processing path:', pathname)
  
  // If it's a public path, allow access without any checks
  if (isPublicPath(pathname)) {
    console.log('Public path, allowing access:', pathname)
    return NextResponse.next()
  }
  
  // For protected routes, create a response we can modify
  const res = NextResponse.next()
  
  try {
    // Create a Supabase client
    const supabase = createMiddlewareClient({ req: request, res })
    
    // Try to get the user's session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session and not on a public path, redirect to login
    if (!session) {
      console.log('No session, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // User has a valid session, allow access to the protected route
    console.log('Valid session, allowing access')
    return res
  } catch (error: any) {
    console.error('Error in middleware:', error?.message || error)
    
    // On auth errors, redirect to login
    if (error?.name === 'AuthApiError') {
      console.log('Auth error, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // For other errors, still allow the request to proceed
    return res
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
} 