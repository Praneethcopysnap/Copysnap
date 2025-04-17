'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiArchive, FiMic, FiTool, FiHelpCircle, FiSettings } from 'react-icons/fi'

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
    <motion.aside 
      initial={{ x: -10, opacity: 0.8 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 flex-shrink-0 bg-white shadow-sm p-5 border-r border-gray-200 min-h-screen h-full hidden md:block"
    >
      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`sidebar-link group ${isActive(item.path) ? 'active' : ''}`}
          >
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className={`mr-3 ${isActive(item.path) ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}
            >
              {item.icon}
            </motion.span>
            <span>{item.label}</span>
            {isActive(item.path) && (
              <motion.div 
                layoutId="sidebar-active-indicator"
                className="absolute right-0 w-1 h-full bg-primary rounded-l-md"
                style={{ top: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
        ))}
      </nav>
      
      <div className="mt-10 pt-5 border-t border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Support</h3>
        <nav className="space-y-1.5">
          {bottomNavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`sidebar-link group ${isActive(item.path) ? 'active' : ''}`}
            >
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className={`mr-3 ${isActive(item.path) ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}
              >
                {item.icon}
              </motion.span>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <motion.div 
                  layoutId="sidebar-support-indicator"
                  className="absolute right-0 w-1 h-full bg-primary rounded-l-md"
                  style={{ top: 0 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-5 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary-100 to-accent-light/20 border border-primary-200">
          <h4 className="font-medium text-primary-800 mb-2">Need help?</h4>
          <p className="text-xs text-gray-600 mb-3">Check our documentation or contact support</p>
          <a 
            href="/help" 
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-200 inline-block"
          >
            View docs
          </a>
        </div>
      </div>
    </motion.aside>
  )
};

export default SidebarNav;