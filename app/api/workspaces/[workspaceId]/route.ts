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

// Get a specific workspace
export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { workspaceId } = params;
    
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
    
    // Fetch the workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .eq('user_id', user.id)
      .single();
    
    if (workspaceError) {
      if (workspaceError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      console.error('Database error:', workspaceError);
      return NextResponse.json(
        { error: 'Error fetching workspace' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Fetch recent copy generations for this workspace
    const { data: generations, error: generationsError } = await supabase
      .from('copy_generations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(5);
    
    if (generationsError) {
      console.error('Error fetching generations:', generationsError);
    }
    
    // Format the workspace for response
    const formattedWorkspace = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description || '',
      copyCount: workspace.copy_count || 0,
      updatedAt: workspace.updated_at,
      createdAt: workspace.created_at,
      recentGenerations: generations || []
    };
    
    return NextResponse.json({ 
      workspace: formattedWorkspace 
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error getting workspace:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update a workspace
export async function PUT(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { workspaceId } = params;
    
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
    
    // First check if the workspace exists and belongs to this user
    const { data: existingWorkspace, error: checkError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', user.id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Workspace not found or you do not have permission to update it' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      console.error('Database error:', checkError);
      return NextResponse.json(
        { error: 'Error checking workspace' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Update the workspace
    const { data: updatedWorkspace, error: updateError } = await supabase
      .from('workspaces')
      .update({
        name,
        description: description || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', workspaceId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating workspace:', updateError);
      return NextResponse.json(
        { error: 'Failed to update workspace' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Format and return the updated workspace
    return NextResponse.json({
      workspace: {
        id: updatedWorkspace.id,
        name: updatedWorkspace.name,
        description: updatedWorkspace.description || '',
        copyCount: updatedWorkspace.copy_count || 0,
        updatedAt: updatedWorkspace.updated_at,
        createdAt: updatedWorkspace.created_at
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete a workspace
export async function DELETE(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { workspaceId } = params;
    
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
    
    // Check if there are other workspaces for this user
    const { data: workspaceCount, error: countError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id);
    
    if (countError) {
      console.error('Error counting workspaces:', countError);
      return NextResponse.json(
        { error: 'Error checking workspace count' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Don't allow deleting the only workspace
    if (workspaceCount.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete your only workspace. Please create another workspace first.' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // First check if the workspace exists and belongs to this user
    const { data: existingWorkspace, error: checkError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', user.id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Workspace not found or you do not have permission to delete it' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      console.error('Database error:', checkError);
      return NextResponse.json(
        { error: 'Error checking workspace' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Delete the workspace
    const { error: deleteError } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId)
      .eq('user_id', user.id);
    
    if (deleteError) {
      console.error('Error deleting workspace:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete workspace' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Workspace deleted successfully'
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 