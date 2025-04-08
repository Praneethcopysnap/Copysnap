import React from 'react'
import Header from '../components/Header'
import DashboardSidebar from '../components/Dashboard_Sidebar'
import ContentLibrary from '../components/Content_Library'

export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      
      <div className="fixed-layout">
        <DashboardSidebar />
        
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