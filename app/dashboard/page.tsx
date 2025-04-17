'use client';

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import SiteHeader from '../components/SiteHeader'
import SidebarNav from '../components/SidebarNav'
import { FiEdit2, FiFileText, FiUser, FiShare2, FiCheckCircle, FiPlus, FiBell, FiInfo, FiFolder, FiClock, FiArrowRight } from 'react-icons/fi'
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
    <div className="min-h-screen flex flex-col bg-background wave-bg">
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
              <div className="glass-card-gradient rounded-lg p-8 max-w-md text-center">
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
          <div className="w-full p-6 md:p-8 relative">
              {/* Background ornaments */}
              <div className="gradient-ornament w-64 h-64 top-20 right-5 opacity-30"></div>
              <div className="gradient-ornament w-48 h-48 bottom-20 left-10 opacity-20"></div>
              <div className="gradient-ornament w-32 h-32 top-60 left-1/3 opacity-10"></div>
              
              {/* If the metrics are empty, show a button to load demo data */}
              {(!metrics || metrics.length === 0) && (
                <div className="mb-6 glass-card-gradient rounded-lg shadow-sm border text-center p-4">
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
            <div className="glass-card-gradient mb-8 relative overflow-hidden gradient-bg-primary">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="avatar-neon h-14 w-14 flex-shrink-0">
                    {profileData?.full_name ? (
                      <span className="text-lg font-semibold text-white">
                        {profileData.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    ) : (
                      <FiUser size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Hi {userName} <span className="wave inline-block animate-pulse">👋</span>
                    </h1>
                    <p className="text-gray-700 mt-1">
                      {wordsThisWeek > 0 ? 
                        `You've generated ${wordsThisWeek.toLocaleString()} words this week. Keep up the great work!` : 
                        "Start generating copy to see your word count here!"}
                    </p>
                  </div>
                </div>
                <div>
                  <motion.button 
                    className="bg-white text-primary font-medium py-2 px-4 rounded-md shadow-lg flex items-center gap-2 hover:shadow-xl"
                    onClick={() => router.push('/library')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View my activity
                    <FiArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 z-0"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 z-0"></div>
              <div className="absolute bottom-10 right-20 w-20 h-20 bg-white/10 rounded-full z-0"></div>
            </div>
            
            {/* Summary Metrics - Direct rendering instead of lazy loaded */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Always show metrics even if they're not loaded yet */}
              {(metrics && metrics.length > 0) ? (
                metrics.map((metric: SummaryMetric, index) => (
                  <div 
                    key={metric.title}
                    className={`stat-card-2025 ${
                      index === 0 ? 'primary' : 
                      index === 1 ? 'success' : 
                      index === 2 ? 'warning' : 
                      'accent'
                    } group`}
                  >
                    <div className="tooltip flex items-center">
                      <div className={`rounded-full p-3 mr-4 ${metric.color}`}>
                        {metric.title === 'Active Projects' ? <FiFolder size={20} /> :
                          metric.title === 'Weekly Words' ? <FiFileText size={20} /> :
                          metric.title === 'Total Generations' ? <FiUser size={20} /> :
                          <FiCheckCircle size={20} />}
                      </div>
                      <span className="tooltip-text">
                        {metric.title === 'Active Projects' ? 'Number of workspaces you have created' :
                          metric.title === 'Weekly Words' ? 'Words generated in the last 7 days' :
                          metric.title === 'Total Generations' ? 'Total AI-generated text outputs' :
                          'Words available in your current plan'}
                      </span>
                      <div>
                        <p className="text-sm text-gray-600">{metric.title}</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold count-up">{metric.value}</span>
                          <span className={`ml-2 text-xs font-medium ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback hardcoded metrics if metrics array is empty
                <>
                  <div className="stat-card-2025 primary group">
                    <div className="tooltip flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-blue-50">
                        <FiFolder size={20} />
                      </div>
                      <span className="tooltip-text">Number of workspaces you have created</span>
                      <div>
                        <p className="text-sm text-gray-600">Active Projects</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold count-up">{Math.max(workspaceCountRef.current, workspaces?.length || 0)}</span>
                          <span className="ml-2 text-xs font-medium text-green-500">+1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card-2025 success group">
                    <div className="tooltip flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-green-50">
                        <FiFileText size={20} />
                      </div>
                      <span className="tooltip-text">Words generated in the last 7 days</span>
                      <div>
                        <p className="text-sm text-gray-600">Weekly Words</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold count-up">1,250</span>
                          <span className="ml-2 text-xs font-medium text-green-500">+12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card-2025 warning group">
                    <div className="tooltip flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-purple-50">
                        <FiUser size={20} />
                      </div>
                      <span className="tooltip-text">Recent account activity</span>
                      <div>
                        <p className="text-sm text-gray-600">Team Activity</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold count-up">24</span>
                          <span className="ml-2 text-xs font-medium text-green-500">+5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-card-2025 accent group">
                    <div className="tooltip flex items-center">
                      <div className="rounded-full p-3 mr-4 bg-amber-50">
                        <FiCheckCircle size={20} />
                      </div>
                      <span className="tooltip-text">Average response time for AI operations</span>
                      <div>
                        <p className="text-sm text-gray-600">Avg. Response Time</p>
                        <div className="flex items-center">
                          <span className="text-xl font-bold count-up">1.2s</span>
                          <span className="ml-2 text-xs font-medium text-red-500">-0.3s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Call to Action Banner */}
            <div className="mb-8">
              <div className="glass-card-gradient gradient-bg-accent">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 gap-4 relative z-10">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Get Started with CopySnap</h2>
                    <p className="mb-0 text-gray-700">Create a workspace to start generating context-aware UX copy for your product.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <motion.button 
                      className="bg-white text-accent font-medium py-2 px-4 rounded-md shadow-lg flex items-center gap-2 hover:shadow-xl"
                      onClick={() => router.push('/workspaces')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiPlus size={16} />
                      Create Workspace
                    </motion.button>
                    <motion.button 
                      className="bg-white/20 text-white border border-white/30 font-medium py-2 px-4 rounded-md shadow-lg flex items-center gap-2 hover:bg-white/30"
                      onClick={handleInstallFigmaPlugin}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#FFFFFF">
                        <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8Z"/>
                        <path d="M8 16h4V8H8a4 4 0 0 0 0 8Z" style={{ opacity: 0.9 }}/>
                        <path d="M8 8h4V0H8a4 4 0 0 0 0 8Z" style={{ opacity: 0.8 }}/>
                        <path d="M16 8a4 4 0 0 0 4-4 4 4 0 0 0-4-4h-4v8h4Z" style={{ opacity: 0.7 }}/>
                        <path d="M20 12a4 4 0 0 0-4-4h-4v8h4a4 4 0 0 0 4-4Z" style={{ opacity: 0.6 }}/>
                      </svg>
                      Connect Figma
                    </motion.button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20 z-0"></div>
              </div>
            </div>
            
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Workspaces */}
              <div className="lg:col-span-2">
                <div className="glass-card-gradient h-full flex flex-col">
                  <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold">Recent Workspaces</h2>
                      <Link href="/workspaces" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                        View All
                        <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                
                  {workspacesLoading ? (
                    <div className="p-6 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : workspaces.length === 0 ? (
                    <div className="empty-state p-6 text-center flex-grow empty-state-animation">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <FiFolder size={28} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
                      <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
                      <motion.button 
                        className="btn-primary flex items-center gap-2 mx-auto"
                        onClick={() => router.push('/workspaces')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiPlus size={16} />
                        Create Workspace
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex-grow">
                      {filteredWorkspaces.map((workspace: Workspace) => (
                        <motion.div 
                          key={workspace.id}
                          whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                        >
                          <Link 
                            href={`/workspaces/${workspace.id}`}
                            className="block p-6 border-b border-white/10 last:border-b-0 hover:bg-white/20 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-grow">
                                <h3 className="font-medium">{workspace.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{workspace.description || 'No description'}</p>
                                <div className="mt-2 flex gap-2">
                                  {workspace.figmaLink && (
                                    <span className="pill-badge-glow primary">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="#4F46E5">
                                        <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8Z"/>
                                        <path d="M8 16h4V8H8a4 4 0 0 0 0 8Z" style={{ opacity: 0.9 }}/>
                                        <path d="M8 8h4V0H8a4 4 0 0 0 0 8Z" style={{ opacity: 0.8 }}/>
                                        <path d="M16 8a4 4 0 0 0 4-4 4 4 0 0 0-4-4h-4v8h4Z" style={{ opacity: 0.7 }}/>
                                        <path d="M20 12a4 4 0 0 0-4-4h-4v8h4a4 4 0 0 0 4-4Z" style={{ opacity: 0.6 }}/>
                                      </svg>
                                      Figma
                                    </span>
                                  )}
                                  {workspace.brandVoiceFile && (
                                    <span className="pill-badge-glow success">
                                      <FiFileText size={12} className="text-success-dark" />
                                      Brand Voice
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="pill-badge-glow accent">
                                  <FiClock size={12} className="text-accent-dark" />
                                  Updated {workspace.lastEdited}
                                </div>
                                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <FiArrowRight size={16} className="text-primary" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                      
                      {workspaces.length > 3 && (
                        <div className="p-4 text-center border-t border-white/10">
                          <Link href="/workspaces" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                            View all {workspaces.length} workspaces
                            <FiArrowRight size={14} />
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
                <div className="glass-card-gradient h-full flex flex-col">
                  <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    {activities.length === 0 ? (
                      <div className="empty-state text-center py-6 empty-state-animation">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                          <FiFileText size={28} className="text-accent" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Ready when you are</h3>
                        <p className="text-gray-500 mb-4">
                          Create your first copy to start building your activity feed
                        </p>
                        <motion.button 
                          className="bg-accent text-white font-medium py-2 px-4 rounded-md shadow-lg flex items-center gap-2 mx-auto"
                          onClick={() => router.push('/workspaces')}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiPlus size={16} />
                          Start creating
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.slice(0, 4).map((activity: Activity) => (
                          <div key={activity.id} className="flex items-start group hover:bg-white/10 p-3 rounded-md transition-colors">
                            <div className={`rounded-full p-2 mr-3 ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activity.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="pill-badge-glow">
                                  <FiClock size={12} />
                                  {activity.timestamp}
                                </span>
                                {activity.workspace_name && (
                                  <span className="pill-badge-glow primary">
                                    {activity.workspace_name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tips and Updates */}
                <div className="glass-card-gradient">
                  <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold">Tips & Updates</h2>
                  </div>

                  <div className="p-4">
                    {tipsAndUpdates.map((tip) => (
                      <motion.div 
                        key={tip.id}
                        className="p-3 mb-2 last:mb-0 rounded-lg hover:bg-white/10 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm p-2 flex-shrink-0">
                            {tip.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{tip.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                            <Link 
                              href={tip.link} 
                              className="text-primary text-sm font-medium mt-2 inline-flex items-center gap-1 hover:underline"
                            >
                              {tip.actionText}
                              <FiArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
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