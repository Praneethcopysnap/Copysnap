'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SettingsPageLayout from '../../components/SettingsPageLayout'

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  buttonText: string;
}

export default function IntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState([
    {
      id: 'figma',
      name: 'Figma',
      description: 'Import designs directly from Figma for content creation.',
      icon: '🎨',
      isConnected: false,
      buttonText: 'Connect'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Share content and get notifications in your Slack channels.',
      icon: '💬',
      isConnected: true,
      buttonText: 'Disconnect'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sync your copy directly with your codebase repositories.',
      icon: '📦',
      isConnected: false,
      buttonText: 'Connect'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Import and export content between CopySnap and Notion.',
      icon: '📝',
      isConnected: false,
      buttonText: 'Connect'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Create automated workflows with thousands of apps.',
      icon: '⚡',
      isConnected: false,
      buttonText: 'Connect'
    },
    {
      id: 'asana',
      name: 'Asana',
      description: 'Link copy tasks with your project management workflow.',
      icon: '📋',
      isConnected: false,
      buttonText: 'Connect'
    }
  ]);
  
  const toggleConnection = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              isConnected: !integration.isConnected,
              buttonText: integration.isConnected ? 'Connect' : 'Disconnect'
            } 
          : integration
      )
    );
  };
  
  return (
    <SettingsPageLayout
      title="Integrations"
      description="Connect CopySnap with your favorite tools and services"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map(integration => (
            <div 
              key={integration.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-start">
                <div className="text-3xl mr-4">{integration.icon}</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">{integration.name}</h2>
                    {integration.isConnected && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
                  <button
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      integration.isConnected 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                    onClick={() => toggleConnection(integration.id)}
                  >
                    {integration.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">API Access</h2>
          <p className="text-gray-600 mb-4">
            Use our API to build custom integrations with your internal tools and services.
          </p>
          <button 
            className="btn-primary"
            onClick={() => router.push('/settings/api')}
          >
            Manage API Keys
          </button>
        </div>
      </div>
    </SettingsPageLayout>
  )
} 