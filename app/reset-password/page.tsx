'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'
import { Lock, Eye, EyeOff } from 'lucide-react'
import AuthSidePanel from '@/app/components/AuthSidePanel'
import PageTransition from '@/app/components/PageTransition'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null as string | null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // Check if user has a valid session for password reset
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Invalid or expired session. Please try the password reset link again.')
          return
        }

        if (!session) {
          // No session, check if we have a hash with access token
          const hash = window.location.hash
          if (hash && hash.includes('access_token')) {
            try {
              // Parse the hash to get access token
              const hashParams = new URLSearchParams(hash.substring(1))
              const accessToken = hashParams.get('access_token')
              
              if (accessToken) {
                // Try to set the session with the access token
                const { error: hashError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: hashParams.get('refresh_token') || '',
                })
                
                if (hashError) {
                  console.error('Error setting session from URL:', hashError)
                  setError('Invalid or expired reset link. Please request a new one.')
                }
              } else {
                setError('Invalid reset link. Please request a new one.')
              }
            } catch (err) {
              console.error('Error handling hash:', err)
              setError('Invalid or expired reset link. Please request a new one.')
            }
          } else {
            // No hash with token either, redirect to forgot password
            setError('No active session. Please request a new password reset link.')
          }
        }
      } catch (err) {
        console.error('Error checking session:', err)
        setError('Something went wrong. Please try again.')
      } finally {
        setSessionChecked(true)
      }
    }

    checkSession()
  }, [supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate passwords
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error

      // Show success message
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating your password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <PageTransition>
        <div className="flex min-h-screen">
          {/* Left side - Auth side panel */}
          <AuthSidePanel />

          {/* Right side - Success message */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                    Password updated
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Your password has been successfully updated.
                  </p>
                  <div className="mt-6">
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/login');
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Go to login page
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    (You will be automatically redirected in 5 seconds)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  // If success, redirect to login after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        {/* Left side - Auth side panel */}
        <AuthSidePanel />

        {/* Right side - Reset password form */}
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
            
            <h2 className="text-center text-xl font-semibold">Set a new password</h2>
            <p className="text-center text-sm text-gray-600">
              Your password must be at least 6 characters long
            </p>
            
            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter new password"
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

              {/* Confirm Password field */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex flex-col">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                    {error.includes('expired') || error.includes('active session') ? (
                      <div className="ml-3 mt-2">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/forgot-password');
                          }}
                          className="text-sm font-medium text-primary"
                        >
                          Request a new password reset link
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading || !sessionChecked}
                className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating password...
                  </>
                ) : (
                  'Update password'
                )}
              </Button>
            </form>

            {/* Back to login link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/login');
                  }}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Back to login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
} 