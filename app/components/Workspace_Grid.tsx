'use client';

import React from 'react'
import Link from 'next/link'
import { Workspace } from '../types/workspace'
import { motion } from 'framer-motion'

interface WorkspaceGridProps {
  workspaces: Workspace[];
  onCreateWorkspace?: () => void;
}

export default function Workspace_Grid({ workspaces, onCreateWorkspace }: WorkspaceGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {workspaces.map((workspace, index) => (
        <motion.div 
          key={workspace.id}
          className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-all p-6"
          variants={item}
          whileHover={{ 
            y: -10, 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h3 className="text-lg font-semibold mb-2">{workspace.name}</h3>
          <p className="text-gray-600 mb-4">{workspace.description}</p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Last edited {workspace.lastEdited}</span>
            <span>{workspace.members} members</span>
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between">
            <motion.div
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/workspaces/${workspace.id}`} className="text-primary text-sm font-medium">
                Open Workspace
              </Link>
            </motion.div>
            <motion.button 
              className="text-gray-500 text-sm"
              whileHover={{ scale: 1.2, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              ⋮
            </motion.button>
          </div>
        </motion.div>
      ))}
      
      {/* New workspace card */}
      <motion.div 
        className="border border-dashed rounded-lg bg-white p-6 flex flex-col items-center justify-center text-center"
        variants={item}
        whileHover={{ 
          scale: 1.02, 
          borderColor: 'var(--color-primary)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <motion.div 
          className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(var(--color-primary-rgb), 0.2)'
          }}
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: "reverse"
          }}
        >
          <span className="text-primary text-xl">+</span>
        </motion.div>
        <h3 className="text-lg font-semibold mb-1">New Workspace</h3>
        <p className="text-gray-500 text-sm mb-4">Create a new context for your product</p>
        <motion.button 
          className="btn-secondary text-sm"
          onClick={onCreateWorkspace}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Workspace
        </motion.button>
      </motion.div>
    </motion.div>
  )
} 