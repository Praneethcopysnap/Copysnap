'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We're sorry, but there was an unexpected error.
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-gray-500">
              Error reference: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
} 