'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
  title?: string;
  isSubmitting?: boolean;
}

export default function WorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = { name: '', description: '' },
  title = 'Create New Workspace',
  isSubmitting = false
}: WorkspaceModalProps) {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
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
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input focus:ring-2 focus:ring-primary transition-all duration-200 w-full"
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
              className="input focus:ring-2 focus:ring-primary transition-all duration-200 w-full"
              placeholder="What is this workspace for?"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
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
      </motion.div>
    </motion.div>
  );
} 