'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import AuthSidePanel from '../components/AuthSidePanel'
import PageTransition from '../components/PageTransition'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null as string | null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [resetMessage, setResetMessage] = useState(null as string | null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // Check for error or reset param in URL query parameters
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }
    
    const resetParam = searchParams.get('reset')
    if (resetParam === 'true') {
      setResetMessage('Password reset link has been sent to your email. Please check your inbox.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    console.log('Login attempt with:', email)

    try {
      // First try signing out if there's any stale session
      await supabase.auth.signOut()
      console.log('Cleared any existing sessions')
      
      // Now attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        throw error
      }

      console.log('Login successful, session:', data.session ? 'Valid' : 'Invalid')
      
      // Navigate to dashboard with a forced refresh
      if (typeof window !== 'undefined') {
        console.log('Redirecting to dashboard...')
        window.location.href = '/dashboard'
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Navigating to forgot password page...')
    router.push('/forgot-password')
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        {/* Left side - Auth side panel */}
        <AuthSidePanel />

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <Image 
                src="/images/logo.png" 
                alt="CopySnap Logo" 
                width={200} 
                height={60} 
                className="mb-2"
              />
              <p className="text-gray-600 text-center">Snap. Write. Convert.</p>
            </div>
            
            {resetMessage && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">{resetMessage}</h3>
                  </div>
                </div>
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:text-primary/80 bg-transparent border-none p-0 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/signup');
                  }} 
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
} 