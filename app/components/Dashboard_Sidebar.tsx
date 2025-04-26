'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiFolder, FiArchive, FiMic, FiTool, FiHelpCircle } from 'react-icons/fi'

export default function Dashboard_Sidebar() {
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
  
  return (
    <aside className="w-64 bg-white shadow-sm p-4 border-r border-gray-200 min-h-screen h-full hidden md:block">
      <nav className="space-y-1">
        <Link href="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <span className="mr-3"><FiHome size={20} /></span>
          <span>Dashboard</span>
        </Link>
        <Link href="/workspaces" className={`sidebar-link ${isActive('/workspaces') ? 'active' : ''}`}>
          <span className="mr-3"><FiFolder size={20} /></span>
          <span>Workspaces</span>
        </Link>
        <Link href="/library" className={`sidebar-link ${isActive('/library') ? 'active' : ''}`}>
          <span className="mr-3"><FiArchive size={20} /></span>
          <span>Content Library</span>
        </Link>
        <Link href="/brand-voice" className={`sidebar-link ${isActive('/brand-voice') ? 'active' : ''}`}>
          <span className="mr-3"><FiMic size={20} /></span>
          <span>Brand Voice</span>
        </Link>
        <Link href="/figma-plugin" className={`sidebar-link ${isActive('/figma-plugin') ? 'active' : ''}`}>
          <span className="mr-3"><FiTool size={20} /></span>
          <span>Figma Plugin</span>
        </Link>
      </nav>
      
      <div className="mt-8 pt-4 border-t">
        <nav className="space-y-1">
          <Link href="/help" className={`sidebar-link ${isActive('/help') ? 'active' : ''}`}>
            <span className="mr-3"><FiHelpCircle size={20} /></span>
            <span>Help & Support</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
} 