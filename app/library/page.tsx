import React from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from "../components/SiteHeader"
import SidebarNav from '../components/SidebarNav'
import ContentLibrary from '../components/ContentLibrary'

export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <SidebarNav />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full pl-6 pr-6">
            <div className="mb-6 pt-6">
              <h1 className="text-2xl font-bold">Content Library</h1>
              <p className="text-gray-600">All your saved UX copy, organized by project and screen.</p>
            </div>
            
            <ContentLibrary />
          </div>
        </main>
      </div>
    </div>
  )
} 