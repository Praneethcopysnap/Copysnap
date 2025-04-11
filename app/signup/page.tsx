'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import AuthSidePanel from '../components/AuthSidePanel'
import PageTransition from '../components/PageTransition'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null as string | null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password || !fullName) {
        console.error('Missing required fields for signup');
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Log sign up attempt with sanitized info
      console.log('Signup attempt:', { 
        email, 
        fullNameLength: fullName.length, 
        passwordLength: password.length 
      });

      // Attempt direct signup and handle the error based on the response
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            full_name: fullName
          }
        }
      });

      console.log('Signup response received');
      
      // Log detailed information about the response
      if (authData?.user) {
        console.log('User object:', { 
          id: authData.user.id,
          email: authData.user.email,
          hasIdentities: Array.isArray(authData.user.identities) && authData.user.identities.length > 0,
          identitiesCount: authData.user.identities?.length || 0,
          hasUserMetadata: Boolean(authData.user.user_metadata),
          createdAt: authData.user.created_at
        });
      } else {
        console.log('No user data returned from signup attempt');
      }

      if (authError) {
        console.error('Signup error details:', { 
          message: authError.message,
          status: authError.status,
          name: authError.name,
          code: authError?.code
        });
        
        // Check for existing user errors - be comprehensive with possible message patterns
        const errorMessageLower = authError.message.toLowerCase();
        if (errorMessageLower.includes('already registered') || 
            errorMessageLower.includes('already exists') ||
            errorMessageLower.includes('email address is already taken') ||
            errorMessageLower.includes('user already registered')) {
          
          setError('An account with this email already exists. Please sign in instead.');
          setLoading(false);
          return;
        }
        
        // Handle other specific error types
        if (errorMessageLower.includes('invalid email')) {
          setError('Please enter a valid email address.');
          setLoading(false);
          return;
        }
        
        if (errorMessageLower.includes('password')) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        
        // Generic error fallback
        setError(authError.message || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // Check if user was actually created (empty identities array is an indicator of existing but unconfirmed user)
      if (!authData.user || (authData.user.identities && authData.user.identities.length === 0)) {
        console.log('Email exists but account might not be confirmed:', email);
        setError('An account with this email already exists. Check your email for the verification link or try to sign in.');
        setLoading(false);
        return;
      }

      // Success! User account was created
      console.log('Signup successful! Showing success message.');
      setSuccess(true);
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during sign up';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
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
                    We've sent a verification link to <span className="font-medium">{email}</span>
                  </p>
                  <p className="mt-4 text-sm text-gray-600">
                    Please check your inbox and click the link to verify your account.
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
            
            <h2 className="text-center text-xl font-semibold">Create your account</h2>
            
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Full Name field */}
              <div className="space-y-2">
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

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
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
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
                disabled={loading}
                className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>
            </form>

            {/* Sign in link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/login');
                  }}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
} 