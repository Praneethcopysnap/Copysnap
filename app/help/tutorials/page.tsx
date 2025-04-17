'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from "@/app/components/SiteHeader";
import SidebarNav from "@/app/components/SidebarNav";
import Link from 'next/link';

// Tutorial data
const tutorials = [
  {
    id: 'intro',
    title: 'Introduction to CopySnap',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=Introduction+to+CopySnap',
    duration: '3:42',
    description: 'Get a quick overview of CopySnap and its core features.',
    category: 'Beginner'
  },
  {
    id: 'figma-plugin',
    title: 'Setting Up the Figma Plugin',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=Figma+Plugin+Setup',
    duration: '5:17',
    description: 'Learn how to install and configure the CopySnap Figma plugin for your design workflow.',
    category: 'Integration'
  },
  {
    id: 'brand-voice',
    title: 'Configuring Your Brand Voice',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=Brand+Voice+Setup',
    duration: '7:23',
    description: 'Define your brand voice parameters to ensure consistent copy generation.',
    category: 'Configuration'
  },
  {
    id: 'copy-generation',
    title: 'Generating Context-Aware Copy',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=Copy+Generation',
    duration: '6:05',
    description: 'Learn how to create copy that fits perfectly with your design context.',
    category: 'Advanced'
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=Team+Collaboration',
    duration: '4:50',
    description: 'Set up team workflows and collaborate effectively on copy projects.',
    category: 'Teamwork'
  },
  {
    id: 'api-usage',
    title: 'Using the CopySnap API',
    thumbnail: 'https://via.placeholder.com/320x180.png?text=API+Usage',
    duration: '8:12',
    description: 'Integrate CopySnap copy generation into your applications.',
    category: 'Developer'
  }
];

// Categories for filtering
const categories = ['All', 'Beginner', 'Integration', 'Configuration', 'Advanced', 'Teamwork', 'Developer'];

export default function TutorialsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);
  
  const filteredTutorials = activeCategory === 'All' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === activeCategory);
  
  const handlePlayVideo = (id: string) => {
    setActiveVideo(id);
    // In a real app, this would trigger a video player modal
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <SidebarNav />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full p-6">
            <div className="flex items-center mb-8">
              <Link href="/help" className="text-primary mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Video Tutorials</h1>
            </div>
            
            <div className="mb-8">
              <p className="text-lg">
                Learn how to use CopySnap with our step-by-step video tutorials.
              </p>
            </div>
            
            {/* Category filters */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tutorial grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredTutorials.map((tutorial) => (
                <div key={tutorial.id} className="card hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative mb-3">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-auto"
                    />
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </span>
                    <button 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity"
                      onClick={() => handlePlayVideo(tutorial.id)}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="p-4 pt-0">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded mb-2">
                      {tutorial.category}
                    </span>
                    <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600 text-sm">{tutorial.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Request section */}
            <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Request a Tutorial</h2>
              <p className="mb-4">Can't find a tutorial for what you need? Let us know what topics you'd like us to cover in future videos.</p>
              <Link href="/help" className="btn-primary inline-block">
                Request a Topic
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 