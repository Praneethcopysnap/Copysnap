'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function VerificationSuccess() {
  const router = useRouter()

  // Redirect to login page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been successfully verified.
            </p>
            <p className="mt-4 text-sm text-gray-600">
              You can now sign in to your account.
            </p>
            <div className="mt-6">
              <Link 
                href="/login" 
                className="text-primary hover:text-primary/80 font-medium"
              >
                Go to login page
              </Link>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              (You will be automatically redirected in 5 seconds)
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 