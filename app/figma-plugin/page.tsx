import React from 'react'
import SiteHeader from "../components/SiteHeader"
import DashboardSidebar from '../components/Dashboard_Sidebar'
import FigmaPluginDemo from '../components/Figma_PluginDemo'

export default function FigmaPluginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <DashboardSidebar />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-4">Figma Plugin</h1>
            <p className="text-lg mb-8">
              Use our Figma plugin to generate contextual UX copy directly from your designs.
            </p>
            
            <FigmaPluginDemo />
          </div>
        </main>
      </div>
    </div>
  )
} 