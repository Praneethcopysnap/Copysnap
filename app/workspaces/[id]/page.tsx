'use client';

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../components/Header'
import DashboardSidebar from '../../components/Dashboard_Sidebar'
import { useWorkspaces } from '../../context/workspaces'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const { getWorkspaceById } = useWorkspaces();
  
  // State for modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Get workspace data from context
  const workspace = getWorkspaceById(workspaceId);

  if (!workspace) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header isLoggedIn={true} />
        
        <div className="fixed-layout">
          <DashboardSidebar />
          
          <main className="flex-grow overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="mb-6 px-6 pt-6">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => router.push('/workspaces')}
                  className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                  whileHover={{ x: -5 }}
                >
                  <span className="mr-2"><FiArrowLeft size={16} /></span>
                  <span>Back to Workspaces</span>
                </motion.button>
              </div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-6"
              >
                <h1 className="text-2xl font-bold mb-6">Workspace Not Found</h1>
                <p>The workspace you're looking for doesn't exist.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary mt-4"
                  onClick={() => router.push('/workspaces')}
                >
                  Back to Workspaces
                </motion.button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    );
  }
  
  // Handle clicking on content category
  const handleContentClick = (category: string) => {
    alert(`Opening ${category} content (Demo only)`);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      
      <div className="fixed-layout">
        <DashboardSidebar />
        
        <main className="flex-grow overflow-y-auto">
          <div className="w-full">
            <div className="mb-4 px-6 pt-6">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => router.push('/workspaces')}
                className="flex items-center text-gray-600 hover:text-gray-900"
                whileHover={{ x: -5 }}
              >
                <span className="mr-2"><FiArrowLeft size={16} /></span>
                <span>Back to Workspaces</span>
              </motion.button>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-6 px-6"
            >
              <div>
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {workspace.name}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600"
                >
                  {workspace.description}
                </motion.p>
              </div>
              
              <div className="flex space-x-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                  onClick={() => setShowGenerateModal(true)}
                >
                  Generate Copy
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Workspace
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6"
            >
              <motion.div variants={itemVariants} className="md:col-span-2">
                <motion.div 
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white p-6 rounded-lg shadow-sm border mb-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Content Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleContentClick('CTAs & Buttons')}
                    >
                      <h3 className="font-medium">CTAs & Buttons</h3>
                      <p className="text-gray-600 text-sm mt-1">12 items</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleContentClick('Error Messages')}
                    >
                      <h3 className="font-medium">Error Messages</h3>
                      <p className="text-gray-600 text-sm mt-1">8 items</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleContentClick('Form Labels')}
                    >
                      <h3 className="font-medium">Form Labels</h3>
                      <p className="text-gray-600 text-sm mt-1">15 items</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleContentClick('Tooltips')}
                    >
                      <h3 className="font-medium">Tooltips</h3>
                      <p className="text-gray-600 text-sm mt-1">6 items</p>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="border-b pb-3"
                    >
                      <p className="font-medium">Updated "Add to Cart" button</p>
                      <p className="text-gray-600 text-sm">Today at 2:30 PM</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border-b pb-3"
                    >
                      <p className="font-medium">Generated error messages for payment form</p>
                      <p className="text-gray-600 text-sm">Yesterday at 11:15 AM</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="border-b pb-3"
                    >
                      <p className="font-medium">Added product description templates</p>
                      <p className="text-gray-600 text-sm">3 days ago</p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <motion.div 
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white p-6 rounded-lg shadow-sm border mb-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Workspace Info</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">March 15, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last updated</p>
                      <p className="font-medium">{workspace.lastEdited}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Members</p>
                      <p className="font-medium">{workspace.members} members</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <motion.button 
                      whileHover={{ 
                        x: 5, 
                        backgroundColor: "rgba(var(--color-primary-rgb), 0.05)"
                      }}
                      className="btn-secondary w-full text-left"
                      onClick={() => setShowFigmaModal(true)}
                    >
                      Import from Figma
                    </motion.button>
                    <motion.button 
                      whileHover={{ 
                        x: 5, 
                        backgroundColor: "rgba(var(--color-primary-rgb), 0.05)"
                      }}
                      className="btn-secondary w-full text-left"
                      onClick={() => setShowExportModal(true)}
                    >
                      Export Content
                    </motion.button>
                    <motion.button 
                      whileHover={{ 
                        x: 5, 
                        backgroundColor: "rgba(var(--color-primary-rgb), 0.05)"
                      }}
                      className="btn-secondary w-full text-left"
                      onClick={() => setShowInviteModal(true)}
                    >
                      Invite Team Member
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* Modals with AnimatePresence for smooth enter/exit animations */}
      <AnimatePresence>
        {/* Generate Copy Modal */}
        {showGenerateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowGenerateModal(false);
              }
            }}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Generate UX Copy</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select className="input focus:ring-2 focus:ring-primary transition-all duration-200">
                    <option>CTA Button</option>
                    <option>Error Message</option>
                    <option>Tooltip</option>
                    <option>Form Label</option>
                    <option>Confirmation Message</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Context
                  </label>
                  <textarea
                    className="input focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Describe the context where this copy will be used..."
                    rows={3}
                    autoFocus
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <motion.button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowGenerateModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="button" 
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      alert('Copy generated! (Demo only)');
                      setShowGenerateModal(false);
                    }}
                  >
                    Generate
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Workspace Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Workspace</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    defaultValue={workspace.name}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input"
                    defaultValue={workspace.description}
                    rows={3}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => {
                      alert('Workspace updated! (Demo only)');
                      setShowEditModal(false);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Figma Import Modal */}
        {showFigmaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Import from Figma</h2>
              
              <p className="mb-4">Connect your Figma account to import content directly from your designs.</p>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowFigmaModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                    router.push('/figma-plugin');
                    setShowFigmaModal(false);
                  }}
                >
                  Connect Figma
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Export Content</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export Format
                  </label>
                  <select className="input">
                    <option>JSON</option>
                    <option>CSV</option>
                    <option>Text</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowExportModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => {
                      alert('Content exported! (Demo only)');
                      setShowExportModal(false);
                    }}
                  >
                    Export
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Invite Team Members</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Addresses
                  </label>
                  <textarea
                    className="input"
                    placeholder="Enter email addresses separated by commas..."
                    rows={3}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permission Level
                  </label>
                  <select className="input">
                    <option>View Only</option>
                    <option>Edit</option>
                    <option>Admin</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => {
                      alert('Invitations sent! (Demo only)');
                      setShowInviteModal(false);
                    }}
                  >
                    Send Invites
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 