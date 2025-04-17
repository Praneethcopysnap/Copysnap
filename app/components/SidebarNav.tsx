'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiArchive, FiMic, FiTool, FiHelpCircle, FiSettings } from 'react-icons/fi'
import { classNames } from '@/lib/utils'
import { Gift, Settings } from 'lucide-react'

const SidebarNav = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    
    // For other paths, check if the pathname includes the path (for nested paths)
    if (path !== '/dashboard') {
      return pathname.includes(path);
    }
    
    return false;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={18} /> },
    { path: '/workspaces', label: 'Workspaces', icon: <FiFolder size={18} /> },
    { path: '/library', label: 'Content Library', icon: <FiArchive size={18} /> },
    { path: '/brand-voice', label: 'Brand Voice', icon: <FiMic size={18} /> },
    { path: '/figma-plugin', label: 'Figma Plugin', icon: <FiTool size={18} /> },
  ];

  const bottomNavItems = [
    { path: '/help', label: 'Help & Support', icon: <FiHelpCircle size={18} /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings size={18} /> },
  ];
  
  return (
    <div className="h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-inner border-r border-white/20 dark:border-gray-700/20 overflow-y-auto">
      <div className="flex flex-col h-full px-3 py-4">
        <div className="mb-6 px-3 flex items-center">
          {/* Logo can be added here */}
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CopySnap</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={classNames(
                'group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 overflow-hidden',
                isActive(item.path) ? 'text-primary bg-primary/5 dark:bg-primary/10' : 'text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:text-primary'
              )}
            >
              {isActive(item.path) && (
                <motion.div 
                  layoutId="active-nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <div className={classNames(
                'mr-3 flex-shrink-0 transition-transform duration-300',
                isActive(item.path) ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary',
                'group-hover:scale-110'
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              
              {isActive(item.path) && (
                <motion.div 
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 dark:from-primary/10 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="mt-6 pt-6 border-t border-gray-100/50 dark:border-gray-700/50">
          <div className="glass-card-gradient p-4 m-2 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Gift size={18} className="text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Free Plan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">500 words / day</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">125 / 500 words used</p>
            </div>
            <button className="mt-3 w-full px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-primary hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors duration-200">
              Upgrade Plan
            </button>
          </div>
        </div>
        
        <div className="mt-auto pt-2">
          <Link 
            href="/settings" 
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          >
            <Settings size={18} className="mr-2 text-gray-500 dark:text-gray-400" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
};

export default SidebarNav;