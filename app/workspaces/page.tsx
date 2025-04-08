'use client';

import React, { useState } from 'react'
import Header from '../components/Header'
import DashboardSidebar from '../components/Dashboard_Sidebar'
import WorkspaceGrid from '../components/Workspace_Grid'
import { useWorkspaces } from '../context/workspaces'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function WorkspacesPage() {
  const { workspaces, addWorkspace } = useWorkspaces();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateWorkspace = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newWorkspace = addWorkspace(formData.name, formData.description);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      
      // Navigate to the new workspace
      router.push(`/workspaces/${newWorkspace.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      
      <div className="fixed-layout">
        <DashboardSidebar />
        
        <main className="flex-grow overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full pl-6 pr-6"
          >
            <div className="flex justify-between items-center mb-6 pt-6">
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
                className="btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create New Workspace
              </motion.button>
            </div>
            
            <WorkspaceGrid 
              workspaces={workspaces} 
              onCreateWorkspace={() => setShowCreateModal(true)} 
            />
            
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
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
                  
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateWorkspace(); }}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Workspace Name
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
                    </div>
                    
                    <div className="flex justify-end space-x-3">
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
          </motion.div>
        </main>
      </div>
    </div>
  )
} 