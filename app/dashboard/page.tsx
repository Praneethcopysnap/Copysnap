'use client';

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '../components/SiteHeader'
import SidebarNav from '../components/SidebarNav'
import { FiEdit2, FiFileText, FiUser, FiShare2, FiCheckCircle, FiPlus, FiBell, FiInfo, FiFolder } from 'react-icons/fi'
import { Activity, activityService } from '../services/activity'
import { SummaryMetric, statsService } from '../services/stats'
import { Workspace } from '../types/workspace'
import { useWorkspaces } from '../context/workspaces'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { supabase } from '@/app/lib/supabase'
import { profileService } from '../services/profile'

// Form data type
interface FormDataType {
  name: string;
  description: string;
}

// Tips data
const tipsAndUpdates = [
  {
    id: 'tip1',
    title: 'New Figma Plugin',
    description: 'Generate copy directly from your Figma designs. Connect your workspace for seamless integration.',
    icon: <div className="text-blue-500"><FiInfo size={20} /></div>,
    actionText: 'Learn more',
    link: '/figma-plugin'
  },
  {
    id: 'tip2',
    title: 'Brand Voice Templates',
    description: 'We\'ve added 5 new brand voice templates to help you get started quickly.',
    icon: <div className="text-green-500"><FiBell size={20} /></div>,
    actionText: 'Explore templates',
    link: '/brand-voice'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { workspaces: workspacesContext, refreshWorkspaces } = useWorkspaces();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wordsThisWeek, setWordsThisWeek] = useState(0);
  const [authError, setAuthError] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesLoading, setWorkspacesLoading] = useState(true);
  // Reference to hold the last known valid workspace count
  const workspaceCountRef = useRef(0);
  
  // Skip auth and load with dummy data for development if needed
  const skipAuth = () => {
    setAuthError(false);
    setIsLoading(false);
    setProfileData({ full_name: 'Demo User' });
    setActivities([]);
    setMetrics(getDefaultMetrics(workspaces?.length || 0));
  };
  
  // Mock auth by creating a temporary session
  const createMockSession = async () => {
    try {
      const response = await fetch('/api/mock-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set-user' })
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to create mock session');
      }
    } catch (error) {
      console.error('Error creating mock session:', error);
    }
  };
  
  // Fetch user data and stats on mount
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First phase - check authentication
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Authentication error:', error);
          // Immediately set loading to false and enable fallback options
          setIsLoading(false);
          setAuthError(true);
          setMetrics(getDefaultMetrics(0));
          return;
        }
        
        // Second phase - get profile data
        try {
          const profile = await profileService.getCurrentUserProfile();
          if (mounted) {
            setProfileData(profile);
            setWordsThisWeek(profile?.words_this_week || 0);
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          // Continue with default profile
        }
        
        // Third phase - get workspaces
        try {
          const { data: workspacesData, error: workspacesError } = await supabase
            .from('workspaces')
            .select('*')
            .eq('owner_id', user.id)
            .order('updated_at', { ascending: false });
          
          if (workspacesError) {
            console.error('Error fetching workspaces:', workspacesError);
          } else if (mounted) {
            // Format last edited date
            const formattedWorkspaces = workspacesData?.map(workspace => ({
              ...workspace,
              lastEdited: formatTimeAgo(workspace.updated_at || workspace.created_at)
            })) || [];
            
            setWorkspaces(formattedWorkspaces);
            
            // Store the workspace count for persistence
            if (formattedWorkspaces.length > 0) {
              console.log('Setting workspace count ref to:', formattedWorkspaces.length);
              workspaceCountRef.current = formattedWorkspaces.length;
            }
          }
        } catch (workspaceError) {
          console.error('Error processing workspaces:', workspaceError);
        } finally {
          if (mounted) {
            setWorkspacesLoading(false);
          }
        }
        
        // Fourth phase - load activities and metrics
        try {
          console.log('Starting to fetch activities and metrics...');
          
          // Fetch real activities
          console.log('Fetching activities...');
          const activities = await activityService.getUserActivities(10);
          console.log('Activities fetched:', activities?.length || 0);
          if (mounted) {
            setActivities(activities || []);
          }
          
          // Fetch real metrics data
          console.log('Fetching metrics...');
          try {
            const realMetrics = await statsService.getSummaryMetrics();
            console.log('Metrics fetched successfully:', realMetrics);
            
            // Get the best workspace count we have (from ref or current workspaces)
            const bestWorkspaceCount = Math.max(workspaceCountRef.current, workspaces?.length || 0);
            console.log('Best workspace count:', bestWorkspaceCount, 'Current ref:', workspaceCountRef.current, 'Current workspaces:', workspaces?.length || 0);
            
            // If we have workspaces, ensure the active projects metric shows the correct count
            if (bestWorkspaceCount > 0) {
              console.log('Updating active projects count to match best count:', bestWorkspaceCount);
              const updatedMetrics = realMetrics.map(metric => {
                if (metric.title === 'Active Projects') {
                  return {
                    ...metric,
                    value: bestWorkspaceCount.toString(),
                    change: '+1',
                    trend: 'up'
                  };
                }
                return metric;
              });
              
              if (mounted) {
                setMetrics(updatedMetrics);
              }
            } else {
              if (mounted) {
                setMetrics(realMetrics);
              }
            }
          } catch (metricsError) {
            console.error('Error fetching metrics:', metricsError);
            // Always fall back to default metrics on error
            if (mounted) {
              const defaultMetrics = getDefaultMetrics(workspaces?.length || 0);
              console.log('Using updated default metrics:', defaultMetrics);
              setMetrics(defaultMetrics);
            }
          }
        } catch (error) {
          console.error('Error loading activities or metrics:', error);
          // Fall back to default metrics if real data fetching fails
          if (mounted) {
            const defaultMetrics = getDefaultMetrics(workspaces?.length || 0);
            console.log('Using default metrics due to error:', defaultMetrics);
            setMetrics(defaultMetrics);
          }
        }
      } catch (error) {
        console.error('Error in dashboard:', error);
        // Make sure to set these states even if there's an error
        if (mounted) {
          setIsLoading(false);
          setMetrics(getDefaultMetrics(workspaces?.length || 0));
        }
      } finally {
        // Ensure loading is always turned off
        if (mounted) {
          setIsLoading(false);
        }
        
        // Add a safety timeout to ensure loading state is cleared even if something goes wrong
        setTimeout(() => {
          if (mounted && isLoading) {
            console.log('Safety timeout triggered - forcing loading state to false');
            setIsLoading(false);
            // If we got here, we likely had an issue, so set defaults
            setMetrics(getDefaultMetrics(workspaces?.length || 0));
          }
        }, 5000); // 5-second safety timeout
      }
    };

    checkAuth();
    
    // Cleanup function to handle component unmount
    return () => { mounted = false; };
  }, []);
  
  // Helper function to provide default metrics
  const getDefaultMetrics = (workspaceCount?: number): SummaryMetric[] => {
    // Use the ref value if available and greater than the provided count
    const actualCount = Math.max(workspaceCountRef.current || 0, workspaceCount || 0);
    
    return [
      {
        title: 'Active Projects',
        value: actualCount.toString(),
        change: actualCount > 0 ? '+1' : '0',
        trend: actualCount > 0 ? 'up' : 'neutral',
        color: 'bg-blue-50'
      },
      {
        title: 'Weekly Words',
        value: '0',
        change: '0%',
        trend: 'neutral',
        color: 'bg-green-50'
      },
      {
        title: 'Total Generations',
        value: '0',
        change: '0',
        trend: 'neutral',
        color: 'bg-purple-50'
      },
      {
        title: 'Words Available',
        value: '10K',
        change: '100%',
        trend: 'up',
        color: 'bg-amber-50'
      }
    ];
  };
  
  // Helper function to get icon for activity type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'edit':
        return <FiEdit2 size={16} />;
      case 'create':
        return <FiFileText size={16} />;
      case 'share':
        return <FiShare2 size={16} />;
      case 'member':
        return <FiUser size={16} />;
      case 'generate':
        return <FiCheckCircle size={16} />;
      default:
        return <FiFileText size={16} />;
    }
  };
  
  // Helper function to get color for activity type
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'edit':
        return 'bg-blue-100 text-blue-600';
      case 'create':
        return 'bg-green-100 text-green-600';
      case 'share':
        return 'bg-purple-100 text-purple-600';
      case 'member':
        return 'bg-yellow-100 text-yellow-600';
      case 'generate':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await refreshWorkspaces();
      router.push('/workspaces');
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace');
    } finally {
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleInstallFigmaPlugin = () => {
    router.push('/figma-plugin');
  };
  
  const userName = profileData?.full_name || 'there';
  const filteredWorkspaces = workspaces.slice(0, 3);

  // Helper function to format timestamps
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <SidebarNav />
        
        <main className="flex-grow overflow-y-auto w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : authError ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Authentication Issue</h2>
                <p className="text-gray-600 mb-6">
                  There was an issue with your authentication. This can happen if your session has expired or there's a problem connecting to the authentication service.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => router.push('/login')}
                    className="btn-primary"
                  >
                    Go to Login
                  </button>
                  <button 
                    onClick={skipAuth}
                    className="btn-secondary"
                  >
                    Continue with Demo Data
                  </button>
                  <button 
                    onClick={createMockSession}
                    className="btn-secondary"
                  >
                    Create Mock Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
          <div className="w-full p-6">
              {/* If the metrics are empty, show a button to load demo data */}
              {(!metrics || metrics.length === 0) && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border text-center">
                  <p className="mb-2">Unable to load your dashboard data</p>
                  <button 
                    onClick={skipAuth}
                    className="btn-primary"
                  >
                    Continue with Demo Data
                  </button>
                </div>
              )}
              
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Hi {userName} 👋 Welcome back!</h1>
                    <p className="text-gray-600 mt-1">
                      {wordsThisWeek > 0 ? 
                        `You've generated ${wordsThisWeek.toLocaleString()} words this week. Keep up the great work!` : 
                        "Start generating copy to see your word count here!"}
                    </p>
                </div>
                <div className="mt-4 md:mt-0">
                    <button 
                      className="btn-secondary text-sm"
                      onClick={() => router.push('/library')}
                    >
                    View my activity
                  </button>
                </div>
              </div>
            </div>
            
              {/* Summary Metrics - Direct rendering instead of lazy loaded */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Always show metrics even if they're not loaded yet */}
                {(metrics && metrics.length > 0) ? (
                  metrics.map((metric: SummaryMetric) => (
                <div 
                  key={metric.title}
                  className="card p-4 flex items-center"
                >
                  <div className={`rounded-full p-3 mr-4 ${metric.color}`}>
                        {metric.title === 'Active Projects' ? <FiFolder size={20} /> :
                          metric.title === 'Weekly Words' ? <FiFileText size={20} /> :
                          metric.title === 'Total Generations' ? <FiUser size={20} /> :
                          <FiCheckCircle size={20} />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold">{metric.value}</span>
                          <span className={`ml-2 text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
                  ))
                ) : (
                  // Fallback hardcoded metrics if metrics array is empty
                  <>
                    <div className="card p-4 flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-blue-50">
                        <FiFolder size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Projects</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">{Math.max(workspaceCountRef.current, workspaces?.length || 0)}</span>
                          <span className="ml-2 text-xs font-medium text-green-500">+1</span>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4 flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-green-50">
                        <FiFileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Weekly Words</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">1,250</span>
                          <span className="ml-2 text-xs font-medium text-green-500">+12%</span>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4 flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-purple-50">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Team Activity</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">24</span>
                          <span className="ml-2 text-xs font-medium text-green-500">+5</span>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4 flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-amber-50">
                        <FiCheckCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg. Response Time</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">1.2s</span>
                          <span className="ml-2 text-xs font-medium text-red-500">-0.3s</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                        onClick={() => router.push('/workspaces')}
                    >
                      Create Workspace
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={handleInstallFigmaPlugin}
                    >
                        Connect Figma
                    </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Workspaces */}
                <div className="lg:col-span-2">
                  <div className="card h-full">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Recent Workspaces</h2>
                        <Link href="/workspaces" className="text-primary text-sm font-medium">
                          View All
                        </Link>
              </div>
            </div>
            
                    {workspacesLoading ? (
                      <div className="p-6 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : workspaces.length === 0 ? (
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                          <FiFolder size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
                        <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
                <button 
                          className="btn-primary"
                          onClick={() => router.push('/workspaces')}
                >
                          Create Workspace
                </button>
              </div>
                    ) : (
                      <div>
                        {filteredWorkspaces.map((workspace: Workspace) => (
                          <Link 
                            href={`/workspaces/${workspace.id}`} 
                            key={workspace.id}
                            className="block p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{workspace.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{workspace.description || 'No description'}</p>
                      </div>
                              <div className="text-sm text-gray-500">
                                Updated {workspace.lastEdited}
                    </div>
                  </div>
                          </Link>
                        ))}
                        
                        {workspaces.length > 3 && (
                          <div className="p-4 text-center">
                            <Link href="/workspaces" className="text-primary text-sm">
                              View all {workspaces.length} workspaces
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
              
                {/* Activity Feed + Tips */}
                <div className="flex flex-col space-y-6">
                  {/* Recent Activity */}
                  <div className="card h-full">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">Recent Activity</h2>
                    </div>
                    
                    <div className="p-6">
                      {activities.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                            <FiFileText size={24} className="text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                          <p className="text-gray-500">
                            Your recent actions will appear here
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {activities.slice(0, 4).map((activity: Activity) => (
                            <div key={activity.id} className="flex items-start">
                              <div className={`rounded-full p-2 mr-3 ${getActivityColor(activity.type)}`}>
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {activity.timestamp} 
                                  {activity.workspace_name && (
                                    <> · {activity.workspace_name}</>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tips and Updates */}
                  <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">Tips & Updates</h2>
            </div>

                    <div className="p-4">
                      {tipsAndUpdates.map((tip) => (
                        <div key={tip.id} className="p-2 mb-2 last:mb-0">
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">{tip.icon}</div>
                      <div>
                              <h3 className="font-medium text-sm">{tip.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                              <Link href={tip.link} className="text-primary text-sm font-medium mt-2 inline-block">
                                {tip.actionText}
                              </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 