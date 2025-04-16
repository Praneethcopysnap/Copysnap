'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from "@/app/components/SiteHeader";
import SidebarNavigation from "@/app/components/SidebarNav";
import Link from 'next/link';

// Documentation data
const documentationItems = [
  {
    title: "Getting Started with CopySnap",
    description: "Learn the basics of CopySnap and set up your first workspace.",
    icon: "🚀",
    url: "#getting-started"
  },
  {
    title: "Figma Plugin Integration",
    description: "How to install and use the CopySnap Figma plugin effectively.",
    icon: "🔌",
    url: "#figma-integration"
  },
  {
    title: "Brand Voice Configuration",
    description: "Configure your brand voice to generate consistent copy.",
    icon: "🔊",
    url: "#brand-voice"
  },
  {
    title: "Workspace Management",
    description: "Organize your projects efficiently with workspaces.",
    icon: "📁",
    url: "#workspaces"
  },
  {
    title: "Team Collaboration",
    description: "Invite team members and collaborate on copy projects.",
    icon: "👥",
    url: "#team"
  },
  {
    title: "Copy Generation API",
    description: "Integrate CopySnap into your workflow with our API.",
    icon: "⚙️",
    url: "#api"
  }
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <SidebarNavigation />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full p-6">
            <div className="flex items-center mb-8">
              <Link href="/help" className="text-primary mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Documentation</h1>
            </div>

            <div className="mb-8">
              <p className="text-lg">
                Browse our comprehensive documentation to learn how to use CopySnap effectively.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentationItems.map((item, index) => (
                <div key={index} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="text-3xl mr-4">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <Link href={item.url} className="text-primary font-medium">
                        Read guide →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h2>
              <p className="mb-4">Our documentation is constantly being updated. If you can't find the information you need, please contact our support team.</p>
              <Link href="/help" className="btn-primary inline-block">
                Contact Support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 