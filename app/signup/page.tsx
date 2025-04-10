import React from 'react'
import SiteHeader from '../components/SiteHeader'
import Signup_Form from '../components/Signup_Form'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          <Signup_Form />
        </div>
      </main>
    </div>
  )
} 