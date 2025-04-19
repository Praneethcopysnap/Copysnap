'use client';

import React, { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // In a real implementation, this would connect to a database or API
    // For now, we'll simulate a successful submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success!
      setSubmitted(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-md w-full">
      {!submitted ? (
        <>
          <h3 className="text-xl font-bold mb-4">Join the Waitlist</h3>
          <p className="mb-4">Be the first to know when CopySnap launches and get early access.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
          <p>You've been added to our waitlist. We'll notify you when CopySnap is ready for you to try.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="btn-secondary mt-4"
          >
            Sign up another email
          </button>
        </div>
      )}
    </div>
  )
} 