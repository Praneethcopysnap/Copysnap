'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'
import { Mail } from 'lucide-react'
import AuthSidePanel from '../components/AuthSidePanel'
import PageTransition from '../components/PageTransition'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null as string | null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('Sending reset password email to:', email)
      
      // Simple password reset without complex redirects
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        console.error('Password reset error:', error)
        setError(error.message)
        setLoading(false)
        return
      }
      
      console.log('Reset password email sent successfully')
      setSuccess(true)
    } catch (err) {
      console.error('Password reset exception:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while sending the reset link')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <PageTransition>
        <div className="flex min-h-screen">
          <AuthSidePanel />
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
                    Check your email
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    We've sent a password reset link to <span className="font-medium">{email}</span>
                  </p>
                  <p className="mt-4 text-sm text-gray-600">
                    Please check your inbox and click the link to reset your password.
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
                      Return to login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        <AuthSidePanel />
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
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
            
            <h2 className="text-center text-xl font-semibold">Reset your password</h2>
            <p className="text-center text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password
            </p>
            
            <form onSubmit={handleResetPassword} className="space-y-6">
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

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

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
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>

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