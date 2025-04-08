import React from 'react'
import Header from '../components/Header'
import LoginForm from '../components/Login_Form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </main>
    </div>
  )
} 