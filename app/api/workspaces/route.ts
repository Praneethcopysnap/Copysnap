import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// CORS headers for Figma plugin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Extract the token
    const token = authHeader.substring(7);
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the token by getting the user session
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Fetch workspaces from database
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (workspacesError) {
      console.error('Database error:', workspacesError);
      return NextResponse.json(
        { error: 'Error fetching workspaces' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Format workspaces for response
    const formattedWorkspaces = workspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      description: ws.description || '',
      copyCount: ws.copy_count || 0,
      updatedAt: ws.updated_at,
      createdAt: ws.created_at
    }));
    
    // If no workspaces exist, create a default workspace
    if (formattedWorkspaces.length === 0) {
      const { data: newWorkspace, error: createError } = await supabase
        .from('workspaces')
        .insert({
          user_id: user.id,
          name: 'My First Workspace',
          description: 'Default workspace for your copy',
          copy_count: 0
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating default workspace:', createError);
      } else if (newWorkspace) {
        formattedWorkspaces.push({
          id: newWorkspace.id,
          name: newWorkspace.name,
          description: newWorkspace.description || '',
          copyCount: newWorkspace.copy_count || 0,
          updatedAt: newWorkspace.updated_at,
          createdAt: newWorkspace.created_at
        });
      }
    }
    
    // Return workspaces
    return NextResponse.json({ 
      workspaces: formattedWorkspaces 
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create a new workspace
export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Extract the token
    const token = authHeader.substring(7);
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the token by getting the user session
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Parse request body
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Create new workspace
    const { data: workspace, error: createError } = await supabase
      .from('workspaces')
      .insert({
        user_id: user.id,
        name,
        description: description || '',
        copy_count: 0
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating workspace:', createError);
      return NextResponse.json(
        { error: 'Failed to create workspace' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Format and return the new workspace
    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description || '',
        copyCount: workspace.copy_count || 0,
        updatedAt: workspace.updated_at,
        createdAt: workspace.created_at
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 