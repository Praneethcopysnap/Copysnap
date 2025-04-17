'use client';

import React, { createContext, useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Workspace } from '../types/workspace';

// Define the context type
interface WorkspacesContextType {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  refreshWorkspaces: (forceRefresh?: boolean) => Promise<void>;
  addWorkspace: (
    name: string, 
    description: string, 
    options?: {
      figma_link?: string;
      brand_voice_file?: string;
      tone?: string;
      style?: string;
      voice?: string;
      persona_description?: string;
    }
  ) => Promise<Workspace>;
  getWorkspaceById: (id: string) => Workspace | undefined;
}

// Define props interface for WorkspacesProvider
interface WorkspacesProviderProps {
  children: any;
}

// Create the context with type assertion
const WorkspacesContext = createContext(undefined as unknown as WorkspacesContextType);

// Create a provider component
export function WorkspacesProvider({ children }: WorkspacesProviderProps) {
  const [workspaces, setWorkspaces] = useState([] as Workspace[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const supabase = createClientComponentClient();

  const refreshWorkspaces = async (forceRefresh = false) => {
    try {
      // Check if data was fetched recently (within last 60 seconds)
      const now = Date.now();
      if (!forceRefresh && lastFetchTime > 0 && now - lastFetchTime < 60000 && workspaces.length > 0) {
        console.log('Using cached workspaces data');
        return;
      }
      
      console.log('Starting refreshWorkspaces');
      
      // Set a flag to prevent multiple simultaneous refreshes
      if (loading) {
        console.log('Already loading workspaces, skipping duplicate refresh');
        return;
      }
      
      setLoading(true);
      setError(null);

      // Create a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timed out fetching workspaces')), 8000);
      });

      // Get the current user with timeout
      console.log('Fetching current user');
      const userPromise = supabase.auth.getUser();
      
      // Race between the actual request and the timeout
      const { data: { user }, error: userError } = await Promise.race([
        userPromise,
        timeoutPromise.then(() => {
          throw new Error('User authentication timed out');
        })
      ]) as any;
      
      if (userError) {
        console.error('Auth user error:', userError);
        throw new Error(userError.message);
      }

      if (!user) {
        console.log('No authenticated user found, returning empty workspaces');
        setWorkspaces([]);
        setLoading(false);
        setLastFetchTime(now);
        return;
      }

      console.log('User authenticated:', user.id);

      // Try to fetch real workspaces from the database with timeout
      console.log('Fetching workspaces from database');
      const workspacesPromise = supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });
      
      // Race between the actual request and the timeout
      const { data: workspacesData, error: workspacesError } = await Promise.race([
        workspacesPromise,
        timeoutPromise.then(() => {
          throw new Error('Fetching workspaces timed out');
        })
      ]) as any;

      if (workspacesError) {
        console.error('Error fetching workspaces:', workspacesError);
        throw new Error(workspacesError.message);
      }

      console.log('Workspaces fetched:', workspacesData ? workspacesData.length : 0);
      
      if (workspacesData && workspacesData.length > 0) {
        // Process the real data
        processWorkspaces(workspacesData);
      } else {
        // No workspaces found for this user
        console.log('No workspaces found for user, setting empty array');
        setWorkspaces([]);
      }
      
      // Update last fetch time
      setLastFetchTime(now);
    } catch (err) {
      console.error('Error in refreshWorkspaces:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workspaces');
      setWorkspaces([]); // Set empty array instead of mock data
    } finally {
      console.log('refreshWorkspaces completed');
      // Use setTimeout to prevent UI jitter when loading state changes rapidly
      setTimeout(() => {
        setLoading(false);
      }, 100); // Reduce timeout to 100ms for faster response
    }
  };

  // Helper function to process and transform workspace data
  const processWorkspaces = (data: any[]) => {
    if (!data || data.length === 0) {
      setWorkspaces([]);
      return;
    }

    // Transform data to match Workspace interface
    const transformedWorkspaces: Workspace[] = data.map(item => {
      if (!item) return null;

      try {
        const updatedAt = new Date(item.updated_at || new Date());
        const createdAt = new Date(item.created_at || new Date());
        
        // Format the last edited time
        let lastEdited = 'Unknown date';
        
        try {
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - updatedAt.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
              const diffMinutes = Math.floor(diffTime / (1000 * 60));
              lastEdited = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            } else {
              lastEdited = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            }
          } else if (diffDays < 7) {
            lastEdited = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
          } else {
            lastEdited = updatedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
        } catch (err) {
          console.error('Error formatting date:', err);
        }

        return {
          id: item.id || '',
          name: item.name || 'Untitled Workspace',
          description: item.description || '',
          lastEdited: lastEdited,
          members: item.members_count || 1,
          dateCreated: (createdAt || new Date()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          copyCount: item.copy_count || 0
        };
      } catch (err) {
        console.error('Error processing workspace item:', err, item);
        return null;
      }
    }).filter(Boolean) as Workspace[];

    setWorkspaces(transformedWorkspaces);
  };

  // Fetch workspaces on initial load
  useEffect(() => {
    refreshWorkspaces();
  }, []);

  const addWorkspace = async (
    name: string, 
    description: string,
    options?: {
      figma_link?: string;
      brand_voice_file?: string;
      tone?: string;
      style?: string;
      voice?: string;
      persona_description?: string;
    }
  ) => {
    try {
      console.log('Starting workspace creation process');
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User auth error:', userError);
        throw new Error(userError.message);
      }

      if (!user) {
        console.error('No authenticated user found');
        throw new Error('You must be logged in to create a workspace');
      }

      console.log('Authenticated user:', user.id);
      
      // First check if the workspaces table is accessible - use a simpler query
      const { data: testData, error: testError } = await supabase
        .from('workspaces')
        .select('id')
        .limit(1);
        
      if (testError) {
        console.error('Error testing workspaces table access:', testError);
        throw new Error(`Database access error: ${testError.message}`);
      }
      
      console.log('Workspaces table is accessible');
      
      // Get the columns available in the workspaces table
      const { data: columnsData, error: columnsError } = await supabase
        .from('workspaces')
        .select('*')
        .limit(1);
      
      // Create a set of valid column names from the database
      const validColumns = new Set(columnsData && columnsData.length > 0 
        ? Object.keys(columnsData[0]) 
        : ['owner_id', 'name', 'description', 'created_at', 'updated_at']);
      
      console.log('Valid columns in workspaces table:', Array.from(validColumns));
      
      // Prepare workspace data with only valid fields
      const workspaceData: any = {
        owner_id: user.id,
        name,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        members_count: 1,
        copy_count: 0,
      };
      
      // Add optional fields only if they exist in the database schema
      if (options) {
        if (options.figma_link && validColumns.has('figma_link')) {
          workspaceData.figma_link = options.figma_link;
        }
        
        // Use brand_voice_file_path instead of brand_voice_file for database compatibility
        if (options.brand_voice_file && validColumns.has('brand_voice_file_path')) {
          workspaceData.brand_voice_file_path = options.brand_voice_file;
        } else if (options.brand_voice_file && validColumns.has('brand_voice_file')) {
          workspaceData.brand_voice_file = options.brand_voice_file;
        }
        
        if (options.tone && validColumns.has('tone')) {
          workspaceData.tone = options.tone;
        }
        
        if (options.style && validColumns.has('style')) {
          workspaceData.style = options.style;
        }
        
        if (options.voice && validColumns.has('voice')) {
          workspaceData.voice = options.voice;
        }
        
        if (options.persona_description && validColumns.has('persona_description')) {
          workspaceData.persona_description = options.persona_description;
        }
      }
      
      console.log('Attempting to insert workspace with data:', workspaceData);
      
      // Try a simpler insert approach
      const { data, error: insertError } = await supabase
        .from('workspaces')
        .insert(workspaceData)
        .select();

      if (insertError) {
        console.error('Error inserting workspace:', insertError);
        throw new Error(`Failed to create workspace: ${insertError.message}`);
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert operation');
        throw new Error('Failed to create workspace: No data returned');
      }

      console.log('Workspace created successfully:', data);

      // Create a workspace object from the response
      const newWorkspace: Workspace = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description || '',
        lastEdited: 'Just now',
        members: 1,
        dateCreated: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        copyCount: 0,
        
        // Include additional fields in the workspace object only if they exist in the database response
        ...(data[0].figma_link && { figmaLink: data[0].figma_link }),
        ...(data[0].brand_voice_file_path && { brandVoiceFile: data[0].brand_voice_file_path }),
        ...(data[0].brand_voice_file && { brandVoiceFile: data[0].brand_voice_file }),
        ...(data[0].tone && { tone: data[0].tone }),
        ...(data[0].style && { style: data[0].style }),
        ...(data[0].voice && { voice: data[0].voice }),
        ...(data[0].persona_description && { personaDescription: data[0].persona_description })
      };

      // Update local state
      setWorkspaces((prevWorkspaces: Workspace[]) => [...prevWorkspaces, newWorkspace]);
      
      return newWorkspace;
    } catch (err) {
      console.error('Error creating workspace:', err);
      throw err;
    }
  };

  const getWorkspaceById = (id: string) => {
    return workspaces.find((workspace: Workspace) => workspace.id === id);
  };

  return (
    <WorkspacesContext.Provider value={{ 
      workspaces, 
      loading, 
      error, 
      refreshWorkspaces, 
      addWorkspace, 
      getWorkspaceById 
    }}>
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