'use client';

import React, { useState } from 'react'

// Mock data for copy suggestions
const mockCopySuggestions = {
  'login-header': [
    'Welcome back',
    'Sign in to your account',
    'Log in to continue'
  ],
  'login-button': [
    'Sign in',
    'Log in',
    'Continue'
  ],
  'forgot-password': [
    'Forgot your password?',
    'Can\'t remember your password?',
    'Need to reset your password?'
  ],
  'error-message': [
    'Invalid email or password. Please try again.',
    'We couldn\'t find an account with those credentials.',
    'The email and password you entered don\'t match our records.'
  ]
};

export default function Figma_PluginDemo() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedCopy, setSelectedCopy] = useState({});
  
  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
  };
  
  const handleCopySelect = (text: string) => {
    if (selectedElement) {
      setSelectedCopy({
        ...selectedCopy,
        [selectedElement]: text
      });
      setSelectedElement(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Figma Design Preview */}
      <div className="border rounded-lg p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Design Preview</h2>
        <div className="bg-gray-100 p-6 rounded-md">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h3 
              className={`text-xl font-bold mb-4 cursor-pointer ${selectedElement === 'login-header' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleElementClick('login-header')}
            >
              {selectedCopy['login-header'] || 'Welcome back'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input" placeholder="you@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              
              {selectedCopy['error-message'] && (
                <p className="text-red-500 text-sm">
                  {selectedCopy['error-message']}
                </p>
              )}
              
              <div>
                <button 
                  className={`btn-primary w-full cursor-pointer ${selectedElement === 'login-button' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleElementClick('login-button')}
                >
                  {selectedCopy['login-button'] || 'Log in'}
                </button>
              </div>
              
              <div className="text-center">
                <a 
                  href="#" 
                  className={`text-sm text-primary cursor-pointer ${selectedElement === 'forgot-password' ? 'ring-2 ring-primary' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleElementClick('forgot-password');
                  }}
                >
                  {selectedCopy['forgot-password'] || 'Forgot your password?'}
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-gray-500 text-sm">
            Click on any text element to generate suggestions
          </div>
          
          <div className="mt-2 flex justify-center">
            <button 
              className={`text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded cursor-pointer ${selectedElement === 'error-message' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleElementClick('error-message')}
            >
              Show Error Message
            </button>
          </div>
        </div>
      </div>
      
      {/* Copy Suggestions Panel */}
      <div className="border rounded-lg p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">CopySnap Suggestions</h2>
        
        {selectedElement ? (
          <div>
            <h3 className="font-medium text-lg mb-3">
              {selectedElement === 'login-header' ? 'Page Heading' : 
                selectedElement === 'login-button' ? 'Primary Button' :
                selectedElement === 'forgot-password' ? 'Helper Link' :
                'Error Message'}
            </h3>
            
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Context Analysis:</h4>
              <p className="text-sm">
                This appears to be a {selectedElement === 'error-message' ? 'validation error for ' : ''} 
                login screen for a finance application. The brand voice is professional but friendly, 
                emphasizing security and trust.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500">Suggestions based on your brand voice:</h4>
              
              {mockCopySuggestions[selectedElement as keyof typeof mockCopySuggestions]?.map((suggestion, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleCopySelect(suggestion)}
                >
                  <p>{suggestion}</p>
                </div>
              ))}
              
              <button className="text-sm text-primary mt-2">
                Generate more options
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">Select an element in the design to see copy suggestions</p>
            <div className="flex justify-center gap-2">
              <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded">Brand Voice: Professional</div>
              <div className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded">Context: Finance</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 