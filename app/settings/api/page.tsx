'use client';

import React, { useState } from 'react';
import SettingsPageLayout from '../../components/SettingsPageLayout';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  scopes: string[];
}

export default function ApiAccessPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key1',
      name: 'Development API Key',
      key: 'sk_test_1234567890abcdef',
      createdAt: 'Mar 15, 2023',
      lastUsed: '2 hours ago',
      scopes: ['read:content', 'write:content']
    },
    {
      id: 'key2',
      name: 'Production API Key',
      key: 'sk_live_1234567890abcdef',
      createdAt: 'Apr 1, 2023',
      lastUsed: '10 minutes ago',
      scopes: ['read:content', 'write:content', 'read:user', 'write:user']
    }
  ] as ApiKey[]);

  const [showKeyForm, setShowKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState(['read:content']);
  const [showNewKey, setShowNewKey] = useState(null as ({ name: string, key: string } | null));

  const availableScopes = [
    { value: 'read:content', label: 'Read Content', description: 'Read access to content data' },
    { value: 'write:content', label: 'Write Content', description: 'Create and update content' },
    { value: 'read:user', label: 'Read User Data', description: 'Access user profile information' },
    { value: 'write:user', label: 'Write User Data', description: 'Update user profiles' },
    { value: 'read:billing', label: 'Read Billing', description: 'Access billing information' },
    { value: 'write:billing', label: 'Write Billing', description: 'Update payment methods' }
  ];

  const handleScopeToggle = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(prev => prev.filter(s => s !== scope));
    } else {
      setSelectedScopes(prev => [...prev, scope]);
    }
  };

  const handleCreateKey = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (!newKeyName) {
      alert('Please enter a name for your API key');
      return;
    }

    if (selectedScopes.length === 0) {
      alert('Please select at least one scope for your API key');
      return;
    }
    
    // In a real app, this would make an API call to create a new key
    const newKeyString = `sk_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
    
    const newKey: ApiKey = {
      id: `key${apiKeys.length + 1}`,
      name: newKeyName,
      key: newKeyString,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scopes: selectedScopes
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setSelectedScopes(['read:content']);
    setShowKeyForm(false);
    
    // Show the new key to the user (only displayed once)
    setShowNewKey({ name: newKeyName, key: newKeyString });
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    }
  };

  return (
    <SettingsPageLayout
      title="API Access"
      description="Manage your API keys and access tokens"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* API Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">API Documentation</h2>
          <p className="text-gray-600 mb-4">
            Use our API to programmatically access and manage your CopySnap content. 
            Create, read, update, and integrate with your existing tools and workflows.
          </p>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-primary hover:underline font-medium"
              onClick={(e) => { e.preventDefault(); alert('This would link to API documentation'); }}
            >
              View Documentation
            </a>
            <a 
              href="#" 
              className="text-primary hover:underline font-medium"
              onClick={(e) => { e.preventDefault(); alert('This would link to API examples'); }}
            >
              Code Examples
            </a>
          </div>
        </div>
        
        {/* API Keys */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">API Keys</h2>
              <p className="text-sm text-gray-500">Manage your API keys for authentication</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowKeyForm(true)}
            >
              Create New API Key
            </button>
          </div>
          
          {/* New key alert */}
          {showNewKey && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-yellow-800">
                  This is the only time your full API key will be shown. Copy it now.
                </p>
              </div>
              <div className="mt-3">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">Name: {showNewKey.name}</span>
                </div>
                <div className="flex">
                  <code className="flex-1 bg-gray-100 p-2 text-sm font-mono rounded overflow-x-auto">
                    {showNewKey.key}
                  </code>
                  <button
                    className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                    onClick={() => {
                      navigator.clipboard.writeText(showNewKey.key);
                      alert('API key copied to clipboard');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <button 
                  className="text-yellow-800 hover:underline"
                  onClick={() => setShowNewKey(null)}
                >
                  I've saved my API key
                </button>
              </div>
            </div>
          )}
          
          {/* Create API key form */}
          {showKeyForm && (
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Create New API Key</h3>
              <form onSubmit={handleCreateKey}>
                <div className="mb-4">
                  <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    id="keyName"
                    type="text"
                    className="input w-full"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Production API Key"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    A name to help you identify this key
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-3">
                    {availableScopes.map(scope => (
                      <div key={scope.value} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`scope-${scope.value}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedScopes.includes(scope.value)}
                            onChange={() => handleScopeToggle(scope.value)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`scope-${scope.value}`} className="font-medium text-gray-700">
                            {scope.label}
                          </label>
                          <p className="text-gray-500">{scope.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowKeyForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create API Key
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* API key list */}
          {apiKeys.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Used
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map(key => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{key.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono bg-gray-100 p-1 rounded">
                          {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.lastUsed || 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No API keys available
            </div>
          )}
        </div>
        
        {/* Webhook Settings (Optional) */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Webhooks</h2>
              <p className="text-sm text-gray-500">Configure webhooks to receive real-time updates</p>
            </div>
            <button className="btn-secondary" onClick={() => alert('This would open the webhook creation form')}>
              Add Webhook
            </button>
          </div>
          
          <div className="text-center py-6 text-gray-500">
            No webhooks configured
          </div>
        </div>
        
        {/* Rate Limits */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Rate Limits</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">API Requests (Current Plan)</span>
                <span className="text-sm text-gray-500">1,500 / 10,000 this month</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Your current Pro plan includes 10,000 API requests per month. Need more? 
              <a href="#" className="text-primary hover:underline ml-1">Upgrade your plan</a>
            </p>
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  );
} 