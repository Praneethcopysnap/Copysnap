'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import DashboardSidebar from '../components/Dashboard_Sidebar'
import { FiEdit2, FiFileText, FiUser, FiShare2, FiCheckCircle, FiPlus, FiBell, FiInfo } from 'react-icons/fi'

// Mock recent activity data
const recentActivities = [
  {
    id: 'act1',
    type: 'edit',
    description: 'Updated "Homepage Hero" in E-commerce Redesign',
    timestamp: '2 hours ago',
    workspace: 'E-commerce Redesign',
    icon: <FiEdit2 size={16} />,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'act2',
    type: 'create',
    description: 'Created "Transaction Success" in Mobile Banking App',
    timestamp: '5 hours ago',
    workspace: 'Mobile Banking App',
    icon: <FiFileText size={16} />,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'act3',
    type: 'share',
    description: 'Shared "Product Features" with team',
    timestamp: 'Yesterday',
    workspace: 'Marketing Website',
    icon: <FiShare2 size={16} />,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'act4',
    type: 'member',
    description: 'Added Sarah Johnson to Mobile Banking App',
    timestamp: '2 days ago',
    workspace: 'Mobile Banking App',
    icon: <FiUser size={16} />,
    color: 'bg-yellow-100 text-yellow-600'
  }
];

// Mock usage statistics data
const usageStats = {
  wordsGenerated: {
    current: 3240,
    total: 10000,
    percentage: 32.4
  },
  savedPrompts: {
    current: 15,
    total: 50,
    percentage: 30
  },
  completedProjects: {
    count: 5,
    thisMonth: 2
  },
  lastRefresh: 'May 15, 2023'
};

// Mock workspaces data
const mockWorkspaces = [
  {
    id: 'ws1',
    name: 'E-commerce Redesign',
    description: 'UX copy for the new shopping experience',
    lastEdited: '2 days ago'
  },
  {
    id: 'ws2',
    name: 'Mobile Banking App',
    description: 'Security and transaction messaging',
    lastEdited: '5 hours ago'
  },
  {
    id: 'ws3',
    name: 'Marketing Website',
    description: 'Homepage and product messaging',
    lastEdited: '1 week ago'
  }
];

// Summary metrics
const summaryMetrics = [
  {
    title: 'Active Projects',
    value: '3',
    change: '+1',
    trend: 'up',
    icon: <div className="text-blue-500"><FiFileText size={20} /></div>,
    color: 'bg-blue-50'
  },
  {
    title: 'Weekly Words',
    value: '1,250',
    change: '+12%',
    trend: 'up',
    icon: <div className="text-green-500"><FiFileText size={20} /></div>,
    color: 'bg-green-50'
  },
  {
    title: 'Team Activity',
    value: '24',
    change: '+5',
    trend: 'up',
    icon: <div className="text-purple-500"><FiUser size={20} /></div>,
    color: 'bg-purple-50'
  },
  {
    title: 'Avg. Response Time',
    value: '1.2s',
    change: '-0.3s',
    trend: 'down',
    icon: <div className="text-amber-500"><FiUser size={20} /></div>,
    color: 'bg-amber-50'
  }
];

// Tips and updates data
const tipsAndUpdates = [
  {
    id: 'tip1',
    title: 'New Figma Plugin',
    description: 'Generate copy directly from your Figma designs. Connect your workspace for seamless integration.',
    icon: <div className="text-blue-500"><FiInfo size={20} /></div>,
    actionText: 'Learn more'
  },
  {
    id: 'tip2',
    title: 'Brand Voice Templates',
    description: 'We\'ve added 5 new brand voice templates to help you get started quickly.',
    icon: <div className="text-green-500"><FiBell size={20} /></div>,
    actionText: 'Explore templates'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This would normally check if user is authenticated
  // For demo purposes, we'll assume they are
  const isLoggedIn = true;
  
  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      setIsSubmitting(false);
      // In a real app, this would navigate to the new workspace
      router.push('/workspaces');
    }, 1000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleInstallFigmaPlugin = () => {
    router.push('/figma-plugin');
  };
  
  // Mock user data - in a real app, this would come from authentication context
  const user = {
    name: 'John',
    wordsThisWeek: 1250
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={isLoggedIn} />
      
      <div className="fixed-layout">
        <DashboardSidebar />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full p-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Hi {user.name} 👋 Welcome back!</h1>
                  <p className="text-gray-600 mt-1">You've generated {user.wordsThisWeek.toLocaleString()} words this week. Keep up the great work!</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="btn-secondary text-sm">
                    View my activity
                  </button>
                </div>
              </div>
            </div>
            
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {summaryMetrics.map((metric) => (
                <div 
                  key={metric.title}
                  className="card p-4 flex items-center"
                >
                  <div className={`rounded-full p-3 mr-4 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold">{metric.value}</span>
                      <span className={`ml-2 text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action Banner */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold mb-2">Get Started with CopySnap</h2>
                    <p className="mb-0">Create a workspace to start generating context-aware UX copy for your product.</p>
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      className="btn-primary"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Create Workspace
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={handleInstallFigmaPlugin}
                    >
                      Install Figma Plugin
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Workspaces Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Workspaces</h2>
                <button 
                  className="text-primary text-sm hover:underline flex items-center"
                  onClick={() => setShowCreateModal(true)}
                >
                  <div className="mr-1"><FiPlus size={16} /></div>
                  New Workspace
                </button>
              </div>
              <div className="space-y-4">
                {mockWorkspaces.map(workspace => (
                  <div 
                    key={workspace.id}
                    className="block border rounded-lg p-4 hover:border-primary transition-colors bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{workspace.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{workspace.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">Last edited {workspace.lastEdited}</span>
                    </div>
                  </div>
                ))}
                
                <button onClick={() => router.push('/workspaces')} className="block text-primary text-sm font-medium mt-2">
                  View all workspaces →
                </button>
              </div>
            </div>
            
            {/* Activity and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
                
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-start border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className={`rounded-full p-2 mr-3 ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-medium text-primary">{activity.workspace}</span>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent activity.</p>
                )}
                <div className="mt-4 text-right">
                  <button className="text-primary text-sm hover:underline">
                    View all activity
                  </button>
                </div>
              </div>
              
              {/* Usage Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Usage Stats</h3>
                {usageStats ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Words Generated</span>
                        <span className="text-sm text-gray-600">{usageStats.wordsGenerated.current.toLocaleString()} / {usageStats.wordsGenerated.total.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${usageStats.wordsGenerated.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Saved Prompts</span>
                        <span className="text-sm text-gray-600">{usageStats.savedPrompts.current} / {usageStats.savedPrompts.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${usageStats.savedPrompts.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Completed Projects</p>
                          <div className="flex items-center mt-1">
                            <span className="text-green-500 mr-1"><FiCheckCircle size={14} /></span>
                            <span className="text-sm text-gray-600">{usageStats.completedProjects.count} total ({usageStats.completedProjects.thisMonth} this month)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Last updated</p>
                          <p className="text-xs font-medium">{usageStats.lastRefresh}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No usage data available yet.</p>
                )}
                <div className="mt-4 text-right">
                  <button className="text-primary text-sm hover:underline">
                    View detailed stats
                  </button>
                </div>
              </div>
            </div>

            {/* What's New / Tips Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">What's New</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tipsAndUpdates.map(tip => (
                  <div key={tip.id} className="card p-4 border-l-4 border-l-primary">
                    <div className="flex">
                      <div className="mr-4">
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{tip.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-2">{tip.description}</p>
                        <button className="text-primary text-sm hover:underline">{tip.actionText}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
            
            <form className="space-y-4" onSubmit={handleCreateWorkspace}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input"
                  placeholder="e.g. E-commerce Redesign"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="input"
                  placeholder="What is this workspace for?"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 