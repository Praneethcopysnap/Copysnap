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
    
    // Parse the request body
    const { 
      workspaceId, 
      type, 
      tone, 
      context, 
      elementName, 
      elementType,
      elementData 
    } = await request.json();
    
    // For now, generate mock copy suggestions
    // In a real implementation, you would call your AI service here
    const suggestions = generateMockSuggestions(type, tone, 3);
    
    // Log the copy generation for analytics
    await supabase.from('copy_generations').insert({
      user_id: user.id,
      workspace_id: workspaceId,
      type,
      tone,
      context: context || null,
      element_name: elementName || null,
      element_type: elementType || null,
      timestamp: new Date().toISOString()
    });
    
    // Return the suggestions
    return NextResponse.json({ 
      suggestions,
      success: true
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error generating copy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Helper function to generate mock suggestions
function generateMockSuggestions(type: string, tone: string, count: number) {
  const examples: Record<string, Record<string, string[]>> = {
    button: {
      friendly: ['Get Started', 'Join Us Today', 'Try It Free'],
      professional: ['Request Demo', 'Start Free Trial', 'Learn More'],
      casual: ['Let\'s Go!', 'Count Me In', 'Show Me How'],
      formal: ['Proceed', 'Submit Request', 'Continue']
    },
    header: {
      friendly: ['Welcome to Your New Experience', 'You\'re Going to Love This', 'Join Thousands of Happy Users'],
      professional: ['Enterprise Solutions for Modern Teams', 'Streamline Your Workflow Today', 'Accelerate Your Business Growth'],
      casual: ['Hey There, Ready to Rock?', 'The Awesome Solution You\'ve Been Waiting For', 'Say Goodbye to Boring Software'],
      formal: ['Introducing Premium Enterprise Services', 'Professional Solutions for Discerning Clients', 'Optimized Productivity Framework']
    },
    description: {
      friendly: [
        'We built this tool to make your life easier. You\'ll find everything you need right at your fingertips.',
        'Our team worked hard to create something you\'ll love using every day. Let us know what you think!',
        'Join our community of happy users who have transformed their workflow with our simple solution.'
      ],
      professional: [
        'Our enterprise solution provides comprehensive tools to optimize your business processes and increase ROI.',
        'Designed for modern teams, this platform offers seamless integration with your existing workflow.',
        'Leverage our powerful features to gain meaningful insights and drive strategic decision-making.'
      ],
      casual: [
        'This thing is super easy to use - promise! Just click around and you\'ll figure it out in no time.',
        'We cut out all the boring stuff so you can focus on what matters. And it\'s actually fun to use!',
        'No more headaches! Our tool makes everything simple, even for the tech-challenged among us.'
      ],
      formal: [
        'The system has been meticulously engineered to facilitate optimal workflow integration and efficiency.',
        'We present a comprehensive suite of functionalities designed to address complex enterprise requirements.',
        'Our solution offers unparalleled performance metrics when implemented within established frameworks.'
      ]
    }
  };
  
  // Default to button if type not found
  const typeExamples = examples[type] || examples['button'] || {};
  // Default to professional if tone not found
  const toneExamples = typeExamples[tone] || typeExamples['professional'] || [];
  
  // Return all examples or up to count
  return toneExamples.slice(0, count);
} 