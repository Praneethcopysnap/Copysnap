'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { Workspace } from '../types/workspace'
import { motion, AnimatePresence } from 'framer-motion'
import { workspaceService } from '../services/workspace'
import { useWorkspaces } from '../context/workspaces';
import { MoreVertical, Edit, Share2, Trash2, X, Copy, Check, AlertTriangle } from 'lucide-react';

interface WorkspaceMenuProps {
  workspace: Workspace;
}

const WorkspaceMenu = ({ workspace }: WorkspaceMenuProps) => {
  const { refreshWorkspaces } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as any).contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    try {
      await workspaceService.deleteWorkspace(workspace.id);
      setDeleteConfirmOpen(false);
      refreshWorkspaces();
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      // Toast notification could be added here
    }
  };

  const handleEditClick = () => {
    setFormData({
      name: workspace.name,
      description: workspace.description || ''
    });
    setEditModalOpen(true);
    setIsOpen(false);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await workspaceService.updateWorkspace(workspace.id, formData);
      setEditModalOpen(false);
      refreshWorkspaces();
    } catch (error) {
      console.error('Failed to update workspace:', error);
      // Toast notification could be added here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareClick = async () => {
    try {
      const link = await workspaceService.shareWorkspace(workspace.id);
      setShareableLink(link);
      setIsShareModalOpen(true);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create shareable link:', error);
      // Toast notification could be added here
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button 
        className="text-gray-400 p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Workspace options"
      >
        <MoreVertical size={18} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <button 
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleEditClick}
            >
              <Edit size={16} className="mr-2 text-gray-500" />
              Edit Workspace
            </button>
            <button 
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleShareClick}
            >
              <Share2 size={16} className="mr-2 text-gray-500" />
              Share Workspace
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                setDeleteConfirmOpen(true);
                setIsOpen(false);
              }}
            >
              <Trash2 size={16} className="mr-2 text-red-500" />
              Delete Workspace
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Workspace</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setEditModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={handleEditSubmit}>
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace Name
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    className="input focus:ring-2 focus:ring-primary transition-all duration-200"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    className="input focus:ring-2 focus:ring-primary transition-all duration-200"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <motion.button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setEditModalOpen(false)}
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
                        Saving...
                      </span>
                    ) : 'Save Changes'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsShareModalOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Share Workspace</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsShareModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Share this link with others to give them access to your workspace.
              </p>
              
              <div className="group relative flex items-center mb-6 border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="w-full py-2 px-3 border-0 focus:outline-none text-sm"
                />
                <motion.button
                  className="px-3 py-2 bg-primary text-white rounded-md mr-1 flex items-center"
                  onClick={handleCopyLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <>
                      <Check size={16} className="mr-1" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
              
              <div className="flex justify-end">
                <motion.button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsShareModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirmOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center mb-4 text-red-600">
                <AlertTriangle size={24} className="mr-2" />
                <h2 className="text-xl font-bold">Delete Workspace</h2>
              </div>
              
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <span className="font-semibold">{workspace.name}</span>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone and all workspace data will be permanently deleted.
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setDeleteConfirmOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  type="button" 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  onClick={handleDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Permanently
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceMenu; 