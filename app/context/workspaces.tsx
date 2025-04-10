'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Workspace } from '../types/workspace';

// Initial workspaces data
const initialWorkspaces: Workspace[] = [
  {
    id: 'ws1',
    name: 'E-commerce Redesign',
    description: 'UX copy for the new shopping experience',
    lastEdited: '2 days ago',
    members: 3,
    dateCreated: 'March 15, 2023',
  },
  {
    id: 'ws2',
    name: 'Mobile Banking App',
    description: 'Security and transaction messaging',
    lastEdited: '5 hours ago',
    members: 2,
    dateCreated: 'April 20, 2023',
  },
  {
    id: 'ws3',
    name: 'Marketing Website',
    description: 'Homepage and product messaging',
    lastEdited: '1 week ago',
    members: 4,
    dateCreated: 'January 10, 2023',
  },
];

// Define the context type
interface WorkspacesContextType {
  workspaces: Workspace[];
  addWorkspace: (name: string, description: string) => Workspace;
  getWorkspaceById: (id: string) => Workspace | undefined;
}

// Define props interface for WorkspacesProvider
interface WorkspacesProviderProps {
  children: ReactNode;
}

// Create the context
const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

// Create a provider component
export function WorkspacesProvider({ children }: WorkspacesProviderProps) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);

  const addWorkspace = (name: string, description: string) => {
    const newWorkspace: Workspace = {
      id: `ws${workspaces.length + 1}${Date.now().toString().slice(-4)}`, // Generate a unique ID
      name,
      description,
      lastEdited: 'Just now',
      members: 1,
      dateCreated: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
    
    setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
    return newWorkspace;
  };

  const getWorkspaceById = (id: string) => {
    return workspaces.find(workspace => workspace.id === id);
  };

  return (
    <WorkspacesContext.Provider value={{ workspaces, addWorkspace, getWorkspaceById }}>
      {children}
    </WorkspacesContext.Provider>
  );
}

// Create a hook to use the workspaces context
export function useWorkspaces() {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider');
  }
  return context;
} 