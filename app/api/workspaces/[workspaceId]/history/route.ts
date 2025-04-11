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

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    // Get workspace ID from URL
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
    
    // Check if workspace exists and belongs to user
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .eq('user_id', user.id)
      .single();
    
    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Fetch copy history from database
    const { data: history, error: historyError } = await supabase
      .from('copy_history')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (historyError) {
      console.error('Database error:', historyError);
      return NextResponse.json(
        { error: 'Error fetching copy history' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Format history for response
    const formattedHistory = history.map(item => ({
      id: item.id,
      content: item.content,
      type: item.type,
      tone: item.tone,
      createdAt: item.created_at
    }));
    
    // For now, return some mock history for testing
    const mockHistory = [
      { id: 'h1', content: 'Get Started Today', type: 'button', tone: 'friendly', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'h2', content: 'Enterprise Solutions for Modern Teams', type: 'header', tone: 'professional', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'h3', content: 'Our platform is designed to help you succeed. Try it today and see the difference.', type: 'description', tone: 'professional', createdAt: new Date(Date.now() - 259200000).toISOString() }
    ];
    
    // Return formatted history (or mock data if none exists)
    return NextResponse.json({ 
      history: formattedHistory.length > 0 ? formattedHistory : mockHistory
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching copy history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 