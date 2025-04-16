'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react'
import SiteHeader from '../components/SiteHeader'
// Lazy load sidebar
const SidebarNavigation = lazy(() => import('../components/SidebarNav'))
// Lazy load workspace grid
const WorkspaceGrid = lazy(() => import('../components/WorkspaceGrid'))
import { useWorkspaces } from '../context/workspaces'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Filter, X, CheckCircle2, AlertCircle, LogIn } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Import workspace type
import { Workspace } from '../types/workspace'

// Create a simple loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center p-6 h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
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
        const { data, error } = await supabase.auth.getSession();
        
        // Clear the timeout since we got a response
        clearTimeout(authTimeout);
        
        if (!mounted) return;
        
        if (error) {
          console.error('Auth error:', error);
          setError('Authentication failed. Please try logging in again.');
          setLoading(false);
          setAuthChecked(true);
          
          // Redirect to login after a brief delay to show the error
          setTimeout(() => {
            if (mounted) router.push('/login');
          }, 2000);
          return;
        }
        
        if (!data.session) {
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
        
        // User is authenticated
        setIsAuthenticated(true);
        
        // Fetch workspaces
        await refreshWorkspaces(true); // Force refresh to ensure we have the latest data
        
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
  
  const handleCreateWorkspace = async () => {
    if (!formData.name.trim()) {
      showToast('Please enter a workspace name', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Attempting to create workspace:', formData);
      const newWorkspace = await addWorkspace(formData.name, formData.description);
      console.log('Workspace created successfully:', newWorkspace);
      setShowCreateModal(false);
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

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCreateModal(false);
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
          <SidebarNavigation />
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
                onClick={() => setShowCreateModal(true)}
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
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    className="btn-secondary flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter size={18} />
                    <span>Filter</span>
                  </button>
                  
                  {showFilters && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 z-10 bg-white rounded-md shadow-lg p-2 min-w-48 border"
                    >
                      {filterOptions.map(option => (
                        <button
                          key={option.value}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                            filter === option.value ? 'bg-primary/10 text-primary font-medium' : ''
                          }`}
                          onClick={() => {
                            setFilter(option.value);
                            setShowFilters(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Active filters display */}
              {filter !== 'all' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex"
                >
                  <span className="text-sm text-gray-500 mr-2">Active filter:</span>
                  <span className="bg-primary/10 text-primary text-sm rounded-full px-3 py-1 flex items-center">
                    {filterOptions.find(o => o.value === filter)?.label}
                    <button 
                      className="ml-2 hover:text-primary-dark" 
                      onClick={() => setFilter('all')}
                    >
                      <X size={14} />
                    </button>
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Main content */}
            {loading || workspacesLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium">Error loading workspaces</h3>
                    <p>{error}</p>
                    <button 
                      className="mt-2 text-sm underline hover:text-red-800"
                      onClick={() => {
                        setError(null);
                        refreshWorkspaces(true);
                      }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredWorkspaces.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                {searchQuery ? (
                  <div>
                    <div className="text-gray-400 mb-2">
                      <Search size={40} className="mx-auto mb-2" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No workspaces found</h3>
                    <p className="text-gray-500 mb-4">No workspaces match your search query "{searchQuery}"</p>
                    <button 
                      className="btn-secondary"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                        <Plus size={30} className="text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-1">No workspaces yet</h3>
                    <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
                    <button 
                      className="btn-primary"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Create Workspace
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Suspense fallback={<LoadingFallback />}>
                <WorkspaceGrid 
                  workspaces={filteredWorkspaces} 
                  onCreateWorkspace={() => setShowCreateModal(true)} 
                />
              </Suspense>
            )}
            
            {/* Create workspace modal */}
            <AnimatePresence>
              {showCreateModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setShowCreateModal(false);
                    }
                  }}
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Create New Workspace</h2>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowCreateModal(false)}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateWorkspace(); }}>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Workspace Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="input focus:ring-2 focus:ring-primary transition-all duration-200"
                          placeholder="e.g. E-commerce Redesign"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This will be the main identifier for your workspace.
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          className="input focus:ring-2 focus:ring-primary transition-all duration-200"
                          placeholder="What is this workspace for?"
                          rows={3}
                          value={formData.description}
                          onChange={handleInputChange}
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                          Add details about the project, product, or team this workspace is for.
                        </p>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-2">
                        <motion.button 
                          type="button" 
                          className="btn-secondary"
                          onClick={() => setShowCreateModal(false)}
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button 
                          type="submit" 
                          className="btn-primary"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating...
                            </span>
                          ) : 'Create Workspace'}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
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