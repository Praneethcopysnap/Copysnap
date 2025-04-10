import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't find the page you're looking for.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors inline-block"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
} 