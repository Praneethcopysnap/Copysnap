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
      copyCount: ws.copy_count || 0,
      updatedAt: ws.updated_at,
      createdAt: ws.created_at
    }));
    
    // For now, return some mock workspaces for testing
    const mockWorkspaces = [
      { id: 'ws-1', name: 'My First Project', copyCount: 12, updatedAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'ws-2', name: 'Website Redesign', copyCount: 28, updatedAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'ws-3', name: 'Mobile App Copy', copyCount: 7, updatedAt: new Date(Date.now() - 259200000).toISOString() }
    ];
    
    // Return formatted workspaces (or mock data if none exist)
    return NextResponse.json({ 
      workspaces: formattedWorkspaces.length > 0 ? formattedWorkspaces : mockWorkspaces
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 