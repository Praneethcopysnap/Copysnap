'use client';

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleSettingsClick = () => {
    router.push('/settings');
    setShowDropdown(false);
  };
  
  const handleDashboardClick = () => {
    router.push('/dashboard');
  };
  
  const handleProfileClick = () => {
    router.push('/profile');
    setShowDropdown(false);
  };
  
  const handleSignOut = () => {
    // In a real app, you would handle signing out here
    // such as clearing tokens or state
    router.push('/');
    setShowDropdown(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-white shadow-sm w-full border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="container-fluid w-full px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {isLoggedIn ? (
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer" 
                onClick={handleDashboardClick}
              >
                <Image 
                  src="/images/logo.png" 
                  alt="CopySnap Logo" 
                  width={152} 
                  height={40} 
                  priority
                />
              </div>
            ) : (
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image 
                  src="/images/logo.png" 
                  alt="CopySnap Logo" 
                  width={152} 
                  height={40} 
                  priority
                />
              </Link>
            )}
          </div>
          
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-8">
                <button
                  onClick={handleSettingsClick}
                  aria-label="Settings"
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="flex items-center space-x-3 cursor-pointer" 
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <span className="text-xs font-medium">JS</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">John Smith</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleSettingsClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-8">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 