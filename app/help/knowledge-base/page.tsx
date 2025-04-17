'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from "@/app/components/SiteHeader";
import SidebarNav from "@/app/components/SidebarNav";
import Link from 'next/link';

// Article data
const articles = [
  {
    id: 'account-setup',
    title: 'How to set up your CopySnap account',
    category: 'Getting Started',
    excerpt: 'Learn how to create and configure your CopySnap account for the first time.',
    tags: ['account', 'setup', 'onboarding']
  },
  {
    id: 'workspace-management',
    title: 'Managing workspaces and projects',
    category: 'Workspaces',
    excerpt: 'Organize your copy generation projects efficiently with workspaces.',
    tags: ['workspaces', 'projects', 'organization']
  },
  {
    id: 'figma-plugin-install',
    title: 'Installing the Figma plugin',
    category: 'Integrations',
    excerpt: 'Step-by-step guide to installing and authorizing the CopySnap Figma plugin.',
    tags: ['figma', 'plugin', 'installation']
  },
  {
    id: 'brand-voice-setup',
    title: 'Setting up your brand voice profile',
    category: 'Brand Voice',
    excerpt: 'Configure your brand voice settings to generate consistent copy that matches your brand identity.',
    tags: ['brand', 'voice', 'tone', 'style']
  },
  {
    id: 'team-members',
    title: 'Adding and managing team members',
    category: 'Teams',
    excerpt: 'Learn how to invite team members and set appropriate access permissions.',
    tags: ['team', 'collaboration', 'permissions']
  },
  {
    id: 'api-authentication',
    title: 'API authentication and access tokens',
    category: 'API',
    excerpt: 'How to authenticate with the CopySnap API and manage your access tokens securely.',
    tags: ['api', 'authentication', 'tokens', 'security']
  },
  {
    id: 'billing-plans',
    title: 'Understanding billing and subscription plans',
    category: 'Billing',
    excerpt: 'Details about different subscription tiers, billing cycles, and payment methods.',
    tags: ['billing', 'subscription', 'payment', 'plans']
  },
  {
    id: 'copy-generation',
    title: 'Generating context-aware UX copy',
    category: 'Copy Generation',
    excerpt: 'How to use design context to generate more relevant and effective UX copy.',
    tags: ['copy', 'generation', 'context', 'ux']
  }
];

// Categories for the sidebar
const categories = [
  'All Categories',
  'Getting Started',
  'Workspaces',
  'Integrations',
  'Brand Voice',
  'Teams',
  'API',
  'Billing',
  'Copy Generation'
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  
  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    // Filter by category
    const categoryMatch = activeCategory === 'All Categories' || article.category === activeCategory;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });
  
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
              <h1 className="text-2xl font-bold">Knowledge Base</h1>
            </div>
            
            <div className="mb-8">
              <p className="text-lg">
                Find answers to common questions and learn how to use CopySnap effectively.
              </p>
            </div>
            
            {/* Search bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Search the knowledge base..."
                  className="input pl-10 py-3 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg 
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Content area with sidebar */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Category sidebar */}
              <div className="md:w-64 flex-shrink-0">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeCategory === category
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Articles list */}
              <div className="flex-1">
                {filteredArticles.length > 0 ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      {activeCategory === 'All Categories' 
                        ? 'All Articles' 
                        : activeCategory + ' Articles'}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </h2>
                    
                    {filteredArticles.map((article) => (
                      <div key={article.id} className="card hover:shadow-md transition-shadow">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded mb-2">
                          {article.category}
                        </span>
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                              <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                            ))}
                          </div>
                          <Link href={`/help/knowledge-base/${article.id}`} className="text-primary font-medium">
                            Read more →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <svg 
                      className="w-12 h-12 mx-auto text-gray-400 mb-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any articles matching your criteria. Try adjusting your search or category.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('All Categories');
                      }}
                      className="btn-primary"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact support section */}
            <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h2>
              <p className="mb-4">If you couldn't find the information you need in our knowledge base, our support team is here to help.</p>
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