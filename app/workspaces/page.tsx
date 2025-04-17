'use client';

import React, { useState, useEffect, Suspense } from 'react'
import SiteHeader from '../components/SiteHeader'
import SidebarNav from '../components/SidebarNav'
import WorkspaceGrid from '../components/WorkspaceGrid'
import { useWorkspaces } from '../context/workspaces'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Filter, X, CheckCircle2, AlertCircle, LogIn } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Import workspace type
import { Workspace } from '../types/workspace'
import { getWorkspaces, addWorkspace } from '../services/workspace'
import { getSession } from '../services/auth'
import WorkspaceSidePanel from '../components/WorkspaceSidePanel'

// Create a simple loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <p className="ml-2 text-gray-700">Loading...</p>
  </div>
);

// Toast notification type
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface FormData {
  name: string;
  description: string;
  figma_link?: string;
  brand_voice_file?: string;
  tone?: string;
  style?: string;
  voice?: string;
  persona_description?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

// Extend Workspace type with properties we need for filtering
interface ExtendedWorkspace extends Workspace {
  updated_at: string;
  isOwner?: boolean;
}

export default function WorkspacesPage() {
  const { workspaces, loading: workspacesLoading, error: workspacesError, addWorkspace, refreshWorkspaces } = useWorkspaces();
  const router = useRouter();
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState<FormData>({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClientComponentClient();
  
  // Check authentication and initialize data
  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout;
    
    // Only check for loading state, not workspaces.length which can be legitimately 0
    if (!loading && !workspacesLoading && authChecked) {
      console.log('Workspaces already checked, skipping authentication check');
      return;
    }
    
    const checkAuthAndFetchData = async () => {
      try {
        if (mounted) {
          setLoading(true);
          setAuthChecked(false); // Reset auth check status
        }
        
        // Set a timeout to prevent indefinite loading
        authTimeout = setTimeout(() => {
          if (mounted && !authChecked) {
            console.error('Auth check timeout occurred');
            setError('Authentication check timed out. Please refresh the page.');
            setLoading(false);
            setAuthChecked(true);
          }
        }, 5000); // 5 second timeout
        
        // Check if user is authenticated
        const session = await getSession();
        
        // Clear the timeout since we got a response
        clearTimeout(authTimeout);
        
        if (!mounted) return;
        
        if (session) {
          setIsAuthenticated(true);
          await fetchWorkspaces();
        } else {
          console.log('No active session');
          setError('No active session. Please log in.');
          setLoading(false);
          setAuthChecked(true);
          
          // Redirect to login after a brief delay
          setTimeout(() => {
            if (mounted) router.push('/login');
          }, 2000);
          return;
        }
        
        if (mounted) {
          setAuthChecked(true);
        }
      } catch (err) {
        console.error('Error in authentication check:', err);
        clearTimeout(authTimeout);
        if (mounted) {
          setError('An error occurred while accessing your account.');
          setAuthChecked(true);
          setLoading(false);
        }
      } finally {
        // Add a slight delay before turning off loading to prevent UI flicker
        if (mounted) {
          setTimeout(() => {
            setLoading(false);
          }, 100); // Reduced to 100ms for faster response
        }
      }
    };
    
    checkAuthAndFetchData();
    
    // Cleanup function
    return () => { 
      mounted = false; 
      clearTimeout(authTimeout);
    };
  }, [router, supabase.auth, refreshWorkspaces, workspacesLoading]);
  
  const fetchWorkspaces = async () => {
    try {
      const fetchedWorkspaces = await getWorkspaces();
      await refreshWorkspaces(true); // Force refresh to ensure we have the latest data
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      
      // Check if it's an auth error
      if (error instanceof Error && error.message.includes('auth')) {
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        setError('Failed to load workspaces. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Filter options
  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All Workspaces' },
    { value: 'recent', label: 'Recently Updated' },
    { value: 'owned', label: 'Owned by Me' },
    { value: 'shared', label: 'Shared with Me' },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };
  
  const handleCreateWorkspace = async (workspaceData: FormData) => {
    if (!workspaceData.name.trim()) {
      showToast('Please enter a workspace name', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Attempting to create workspace:', workspaceData);
      const newWorkspace = await addWorkspace(workspaceData.name, workspaceData.description);
      console.log('Workspace created successfully:', newWorkspace);
      setShowCreatePanel(false);
      setFormData({ name: '', description: '' });
      
      // Show success toast
      showToast('Workspace created successfully!', 'success');
      
      // Navigate to the new workspace
      router.push(`/workspaces/${newWorkspace.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
      
      // Check if it's an auth error
      if (error instanceof Error && error.message.includes('auth')) {
        showToast('Authentication error. Please log in again.', 'error');
        router.push('/login');
      } else {
        showToast(`Failed to create workspace: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toast notification system
  const showToast = (message: string, type: ToastType = 'info') => {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== newToast.id));
    }, 5000);
  };
  
  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  // Treat workspaces as ExtendedWorkspace to handle additional properties
  const extendedWorkspaces = workspaces as ExtendedWorkspace[];

  // Filter workspaces based on search query and filter
  const filteredWorkspaces = extendedWorkspaces
    .filter((workspace) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          workspace.name.toLowerCase().includes(query) ||
          (workspace.description && workspace.description.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter((workspace) => {
      // Category filter
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      switch (filter) {
        case 'recent':
          // Assuming updated_at is within the last 7 days
          return workspace.updated_at ? new Date(workspace.updated_at) > weekAgo : false;
        case 'owned':
          return workspace.isOwner === true;
        case 'shared':
          return workspace.isOwner === false;
        default:
          return true;
      }
    });

  // Close panel with escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCreatePanel(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  // If authentication hasn't been checked yet, show a loading state
  if (!authChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 mb-4">Checking authentication...</p>
      </div>
    );
  }
  
  // If authentication check completed but user is not authenticated, show a message
  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-md p-8 rounded-lg bg-white shadow-md">
          <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access your workspaces. Redirecting you to the login page...</p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary px-6 py-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <div className="fixed-layout">
        <Suspense fallback={<LoadingFallback />}>
          <SidebarNav />
        </Suspense>
        
        <main className="flex-grow overflow-y-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full px-6 py-6"
          >
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold"
                >
                  Workspaces
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600"
                >
                  Create and manage your product workspaces.
                </motion.p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center gap-2"
                onClick={() => setShowCreatePanel(true)}
              >
                <Plus size={18} />
                <span>Create New Workspace</span>
              </motion.button>
            </div>
            
            {/* Search and filters */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-1/2 lg:w-1/3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    className="input pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <Filter size={18} className="text-gray-500" />
                    <select
                      className="input pr-10 appearance-none bg-white"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Workspace grid */}
            <WorkspaceGrid 
              workspaces={filteredWorkspaces}
              onCreateWorkspace={() => setShowCreatePanel(true)}
              loading={loading}
            />
            
            {/* No workspaces message */}
            {filteredWorkspaces.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                    <Plus size={30} className="text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-1">No workspaces yet</h3>
                <p className="text-gray-500 mb-4">Create your first workspace to get started!</p>
                <button
                  className="btn-primary"
                  onClick={() => setShowCreatePanel(true)}
                >
                  Create Workspace
                </button>
              </div>
            )}
            
            {/* Error message */}
            {workspacesError && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">Error Loading Workspaces</h3>
                <p className="text-gray-500 mt-1">{workspacesError}</p>
                <button
                  className="mt-4 btn-outline"
                  onClick={() => { setError(''); fetchWorkspaces(); }}
                >
                  Retry
                </button>
              </div>
            )}
            
            {/* Side panel for creating workspaces */}
            <AnimatePresence>
              {showCreatePanel && (
                <WorkspaceSidePanel 
                  isOpen={showCreatePanel}
                  onClose={() => setShowCreatePanel(false)}
                  onSubmit={handleCreateWorkspace}
                  isSubmitting={isSubmitting}
                  title="Create New Workspace"
                />
              )}
            </AnimatePresence>
            
            {/* Toast notifications */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
              <AnimatePresence>
                {toasts.map((toast) => (
                  <motion.div 
                    key={toast.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className={`rounded-md shadow-md p-4 flex items-start gap-3 max-w-md ${
                      toast.type === 'success' ? 'bg-green-50 border border-green-200' :
                      toast.type === 'error' ? 'bg-red-50 border border-red-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {toast.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : toast.type === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <span className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0">ℹ️</span>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        toast.type === 'success' ? 'text-green-800' :
                        toast.type === 'error' ? 'text-red-800' :
                        'text-blue-800'
                      }`}>
                        {toast.message}
                      </p>
                    </div>
                    <button 
                      className={`flex-shrink-0 ${
                        toast.type === 'success' ? 'text-green-500 hover:text-green-700' :
                        toast.type === 'error' ? 'text-red-500 hover:text-red-700' :
                        'text-blue-500 hover:text-blue-700'
                      }`}
                      onClick={() => removeToast(toast.id)}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
} 