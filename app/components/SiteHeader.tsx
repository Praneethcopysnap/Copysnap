'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../services/profile';
import { SignOutButton } from './SignOutButton';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SiteHeader = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [userName, setUserName] = useState('' as string);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  const handleSettingsClick = () => {
    router.push('/settings');
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };
  
  const handleDashboardClick = () => {
    router.push('/dashboard');
    setMobileMenuOpen(false);
  };
  
  const handleProfileClick = () => {
    router.push('/settings/profile');
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleGetStartedClick = () => {
    router.push('/signup');
    setMobileMenuOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

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
      className={`fixed top-0 left-0 right-0 z-40 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'}`}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
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
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
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
                  </AnimatePresence>
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
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-sm hover:shadow"
                  >
                    Sign Up
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  className="hidden lg:block"
                >
                  <button
                    onClick={handleGetStartedClick}
                    className="bg-accent hover:bg-accent-dark text-white px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Get Started Free
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-primary p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {!mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3 p-2 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-sm">
                      <span className="text-sm font-medium">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {isLoading ? 'Loading...' : userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        Logged in
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      Dashboard
                    </Link>
                    <SignOutButton />
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  <div className="pt-2 border-t border-gray-100">
                    <SignOutButton className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors" />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full block px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full block px-4 py-3 text-center bg-primary text-white hover:bg-primary-700 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                  <button
                    onClick={handleGetStartedClick}
                    className="w-full block px-4 py-3 text-center bg-accent text-white hover:bg-accent-dark rounded-md transition-colors mt-2"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SiteHeader; 