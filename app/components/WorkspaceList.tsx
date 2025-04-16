'use client';

import React from 'react'
import Link from 'next/link'
import { useWorkspaces } from '../context/workspaces'
import { Workspace } from '../types/workspace'

const WorkspaceList = () => {
  const { workspaces } = useWorkspaces();
  
  // Show only most recent 3 workspaces
  const recentWorkspaces = workspaces.slice(0, 3);
  
  return (
    <div className="space-y-4">
      {recentWorkspaces.map((workspace: Workspace) => (
        <Link 
          key={workspace.id}
          href={`/workspaces/${workspace.id}`}
          className="block border rounded-lg p-4 hover:border-primary transition-colors bg-white"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{workspace.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{workspace.description}</p>
            </div>
            <span className="text-xs text-gray-500">Last edited {workspace.lastEdited}</span>
          </div>
        </Link>
      ))}
      
      <Link href="/workspaces" className="block text-primary text-sm font-medium mt-2">
        View all workspaces →
      </Link>
    </div>
  )
}

export default WorkspaceList; 