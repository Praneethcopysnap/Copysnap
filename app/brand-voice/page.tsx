'use client';

import React from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from "../components/SiteHeader"
import SidebarNav from '../components/SidebarNav'
import BrandVoiceSettings from '../components/BrandVoiceSettings'

export default function BrandVoicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <SidebarNav />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full pl-6 pr-6">
            <div className="mb-6 pt-6">
              <h1 className="text-2xl font-bold">Brand Voice</h1>
              <p className="text-gray-600">Define how your product communicates with users.</p>
            </div>
            
            <BrandVoiceSettings />
          </div>
        </main>
      </div>
    </div>
  )
} 