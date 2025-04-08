'use client';

import React from 'react';
import Link from 'next/link';
import Header from './Header';
import SettingsSidebar from './settings/SettingsSidebar';

interface SettingsPageLayoutProps {
  children: any;
  title: string;
  description?: string;
}

export default function SettingsPageLayout({ 
  children, 
  title, 
  description 
}: SettingsPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      
      <div className="fixed-layout">
        <div className="w-64">
          <SettingsSidebar />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-primary hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && <p className="text-gray-600">{description}</p>}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 