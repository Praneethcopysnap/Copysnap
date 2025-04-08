'use client';

import React, { useState } from 'react'

// Mock data for demonstration
const mockLibraryData = [
  {
    id: 'item1',
    elementType: 'Button',
    text: 'Get started now',
    screen: 'Home Page',
    workspace: 'E-commerce Website',
    dateCreated: '2023-11-20',
    isFavorite: true
  },
  {
    id: 'item2',
    elementType: 'Error Message',
    text: 'Please enter a valid email address to continue.',
    screen: 'Signup Form',
    workspace: 'Mobile Banking App',
    dateCreated: '2023-11-18',
    isFavorite: false
  },
  {
    id: 'item3',
    elementType: 'Tooltip',
    text: 'This information helps us verify your identity and protect your account.',
    screen: 'Security Settings',
    workspace: 'Mobile Banking App',
    dateCreated: '2023-11-15',
    isFavorite: true
  },
  {
    id: 'item4',
    elementType: 'Heading',
    text: "Discover products you'll love",
    screen: 'Browse Page',
    workspace: 'E-commerce Website',
    dateCreated: '2023-11-12',
    isFavorite: false
  },
  {
    id: 'item5',
    elementType: 'Success Message',
    text: 'Your payment was successful! Your order is now being processed.',
    screen: 'Checkout',
    workspace: 'E-commerce Website',
    dateCreated: '2023-11-10',
    isFavorite: true
  }
];

export default function Content_Library() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryItems, setLibraryItems] = useState(mockLibraryData);
  
  const handleToggleFavorite = (id: string) => {
    setLibraryItems(items => 
      items.map(item => 
        item.id === id ? {...item, isFavorite: !item.isFavorite} : item
      )
    );
  };
  
  const filteredItems = libraryItems.filter(item => {
    if (activeFilter === 'favorites' && !item.isFavorite) return false;
    if (activeFilter !== 'all' && activeFilter !== 'favorites' && item.workspace !== activeFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.text.toLowerCase().includes(query) ||
        item.elementType.toLowerCase().includes(query) ||
        item.screen.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const workspaces = [...new Set(libraryItems.map(item => item.workspace))] as string[];
  
  return (
    <div>
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search content..."
              className="input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm font-medium ${activeFilter === 'favorites' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveFilter('favorites')}
            >
              Favorites
            </button>
            {workspaces.map(workspace => (
              <button 
                key={workspace}
                className={`px-3 py-1 rounded-md text-sm font-medium ${activeFilter === workspace ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveFilter(workspace)}
              >
                {workspace}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                    {item.elementType}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {item.screen}
                  </span>
                </div>
                <button 
                  onClick={() => handleToggleFavorite(item.id)}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  {item.isFavorite ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <p className="text-gray-900">{item.text}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                  {item.workspace} • {item.dateCreated}
                </div>
                <div className="flex gap-2">
                  <button className="text-primary hover:text-primary/80">Copy</button>
                  <button className="text-primary hover:text-primary/80">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium mb-1">No content found</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'No results match your search. Try adjusting your filters.' 
              : 'You haven\'t saved any copy yet. Use the Figma plugin to generate and save content.'}
          </p>
        </div>
      )}
    </div>
  )
} 