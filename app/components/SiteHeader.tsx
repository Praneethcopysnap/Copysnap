'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { profileService } from '../services/profile';
import { SignOutButton } from './SignOutButton';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SiteHeader = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const [userName, setUserName] = useState('' as string);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  const handleSettingsClick = () => {
    router.push('/settings');
    setShowDropdown(false);
  };
  
  const handleDashboardClick = () => {
    router.push('/dashboard');
  };
  
  const handleProfileClick = () => {
    router.push('/settings/profile');
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
  
  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUserName('Anonymous');
          return;
        }

        const profile = await profileService.getCurrentUserProfile();
        console.log('Fetched profile:', profile);
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        } else {
          setUserName('Anonymous');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUserName('Anonymous');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [pathname, supabase]);
  
  // Generate user initials from name
  const getUserInitials = () => {
    if (!userName || userName === 'Anonymous') return 'AN';
    
    return userName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <motion.div 
      role="banner"
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-10 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'}`}
      style={{
        width: '100vw',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        borderBottom: scrolled ? '1px solid rgba(229, 231, 235, 0.5)' : '1px solid #e5e7eb',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="CopySnap Logo"
                  width={152}
                  height={40}
                  priority
                  className="h-8 w-auto"
                />
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSettingsClick}
                  className="text-gray-600 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  aria-label="Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.button>
                <div className="relative" ref={dropdownRef}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-2 cursor-pointer rounded-md px-3 py-1.5 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-sm">
                      <span className="text-xs font-medium">
                        {getUserInitials()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {isLoading ? 'Loading...' : userName}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                  
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors duration-150"
                      >
                        Profile Settings
                      </button>
                      <SignOutButton />
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SiteHeader; 