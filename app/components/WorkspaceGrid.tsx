'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Workspace } from '../types/workspace';
import { FiFileText, FiArchive, FiEdit, FiLayout, FiPlus, FiClock, FiLink } from 'react-icons/fi';
import { Zap, FileText, Figma, Users } from 'lucide-react';

interface WorkspaceGridProps {
  workspaces: Workspace[];
  onCreateWorkspace?: () => void;
  loading?: boolean;
}

type ColorScheme = {
  from: string;
  to: string;
  icon: string;
  border: string;
};

const colorPairs: ColorScheme[] = [
  { from: 'from-primary-100', to: 'to-primary-200', icon: 'text-primary-700', border: 'border-primary-200' },
  { from: 'from-accent-light', to: 'to-pink-100', icon: 'text-accent-dark', border: 'border-pink-200' },
  { from: 'from-green-100', to: 'to-success-light', icon: 'text-success-dark', border: 'border-green-200' },
  { from: 'from-amber-100', to: 'to-warning-light', icon: 'text-warning-dark', border: 'border-amber-200' },
  { from: 'from-sky-100', to: 'to-info-light', icon: 'text-info-dark', border: 'border-sky-200' },
];

// Default color scheme in case we can't determine one
const defaultColorScheme: ColorScheme = { 
  from: 'from-gray-100', 
  to: 'to-gray-200', 
  icon: 'text-gray-700', 
  border: 'border-gray-200' 
};

// Get a random icon for the workspace
const getWorkspaceIcon = (id: string) => {
  const icons = [
    <FiFileText key="file-text" size={18} />, 
    <FiLayout key="layout" size={18} />, 
    <FiEdit key="edit" size={18} />, 
    <FiArchive key="archive" size={18} />
  ];
  // Use the last character of the id to determine the icon
  const lastChar = id.slice(-1);
  const index = parseInt(lastChar, 16) % icons.length;
  return icons[index];
};

// Get a random color for the workspace based on id
const getWorkspaceColor = (id: string): ColorScheme => {
  if (!id) return defaultColorScheme;
  
  // Use the first character of the id to determine the color
  const firstChar = id.slice(0, 1);
  const index = parseInt(firstChar, 16) % colorPairs.length;
  return colorPairs[index] || defaultColorScheme;
};

// Main component
const WorkspaceGrid = ({ workspaces, onCreateWorkspace, loading = false }: WorkspaceGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="bg-gray-50 animate-pulse rounded-xl h-48 border border-gray-100 p-5"
          />
        ))}
      </div>
    );
  }
  
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Create New Workspace Card */}
      <motion.div 
        variants={item}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300"
        onClick={onCreateWorkspace}
      >
        <div className="rounded-full w-12 h-12 bg-primary-50 mb-4 flex items-center justify-center">
          <FiPlus className="text-primary h-6 w-6" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">Create New Workspace</h3>
        <p className="text-sm text-gray-500 text-center">Start a new project with copy suggestions</p>
      </motion.div>
      
      {/* Workspace Cards */}
      {workspaces.map((workspace) => {
        const colorScheme = getWorkspaceColor(workspace.id);
        const icon = getWorkspaceIcon(workspace.id);
        
        // Check if workspace has AI settings
        const hasAI = !!(workspace.tone || workspace.style || workspace.voice || workspace.personaDescription);
        
        // Determine tone style display if available
        let toneDisplay = '';
        if (workspace.tone && workspace.style) {
          const toneValue = parseInt(workspace.tone);
          const styleValue = parseInt(workspace.style);
          
          const toneLabel = toneValue < 40 ? 'Friendly' : toneValue > 70 ? 'Formal' : 'Balanced';
          const styleLabel = styleValue < 40 ? 'Brief' : styleValue > 70 ? 'Descriptive' : 'Balanced';
          
          toneDisplay = `${toneLabel} | ${styleLabel}`;
        }
        
        return (
          <motion.div
            key={workspace.id}
            variants={item}
            whileHover={{ 
              y: -5, 
              transition: { duration: 0.2 } 
            }}
            className={`group relative overflow-hidden rounded-xl border ${colorScheme.border} shadow-sm hover:shadow-lg transition-all duration-300 h-48`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} opacity-50`}></div>
            
            <Link href={`/workspaces/${workspace.id}`} className="absolute inset-0 p-5 flex flex-col">
              {/* Header section */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-2">
                  <div className={`rounded-full p-2 ${colorScheme.from} ${colorScheme.icon}`}>
                    {icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1 pt-1">{workspace.name}</h3>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <FiClock size={14} />
                  <span>{workspace.lastEdited || 'Recently'}</span>
                </div>
              </div>
              
              {/* Description section */}
              <div className="relative group">
                <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                  {workspace.description || 'No description available'}
                </p>
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="absolute top-6 left-0 max-w-[90%] bg-gray-800 text-white text-xs p-2 rounded shadow-lg">
                    {workspace.description || 'No description available'}
                  </div>
                </div>
              </div>
              
              {/* Metadata badges */}
              <div className="flex flex-wrap gap-1 mb-2">
                {workspace.figmaLink && (
                  <div className="group relative">
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-white/80 text-gray-700 border border-gray-200">
                      <Figma size={12} className="mr-1 text-[#F24E1E]" />
                      Figma
                    </span>
                    <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10">
                      <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded">
                        Figma design linked
                      </div>
                    </div>
                  </div>
                )}
                
                {workspace.brandVoiceFile && (
                  <div className="group relative">
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-white/80 text-gray-700 border border-gray-200">
                      <FileText size={12} className="mr-1 text-blue-600" />
                      Voice
                    </span>
                    <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10">
                      <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded">
                        Brand voice document added
                      </div>
                    </div>
                  </div>
                )}
                
                {hasAI && (
                  <div className="group relative">
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-primary-50 text-primary-700 border border-primary-100">
                      <Zap size={12} className="mr-1" />
                      AI On
                    </span>
                    <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10">
                      <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded">
                        AI copy generation enabled
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tone and style section - if available */}
              {toneDisplay && (
                <div className="text-xs text-gray-600 mb-2 flex items-center">
                  <span className="text-xs font-medium">Tone:</span>
                  <span className="ml-1">{toneDisplay}</span>
                </div>
              )}
              
              {/* Bottom section */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 text-gray-700 border border-gray-200">
                    {workspace.copyCount || 0} copies
                  </span>
                  
                  {workspace.members > 1 && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 text-gray-700 border border-gray-200 flex items-center">
                      <Users size={12} className="mr-1" />
                      {workspace.members}
                    </span>
                  )}
                </div>
                
                <motion.div 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="rounded-full p-2 bg-white text-primary shadow-sm">
                    <FiEdit size={14} />
                  </div>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WorkspaceGrid; 