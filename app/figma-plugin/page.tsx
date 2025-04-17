'use client'

import React from 'react'
import SiteHeader from "../components/SiteHeader"
import SidebarNav from '../components/SidebarNav'
import FigmaPluginDemo from '../components/Figma_PluginDemo'

export default function FigmaPluginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      <div className="fixed-layout">
        <SidebarNav />
        <main className="flex-grow overflow-y-auto">
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-4">Figma Plugin</h1>
            <FigmaPluginDemo />
          </div>
        </main>
      </div>
    </div>
  )
} 