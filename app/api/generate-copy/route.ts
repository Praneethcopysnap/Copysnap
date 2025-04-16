import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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

    // Validate required fields
    if (!type || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields: type and tone are required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Fetch the user's brand voice settings
    const { data: brandVoice, error: brandVoiceError } = await supabase
      .from('brand_voice')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (brandVoiceError && brandVoiceError.code !== 'PGRST116') {
      console.error('Error fetching brand voice:', brandVoiceError);
    }
    
    // Generate suggestions based on the user's input and brand voice
    let suggestions: string[] = [];
    
    if (openai) {
      try {
        // Build prompt based on context, element data, and brand voice
        let prompt = `Generate ${type === 'button' ? '3' : '2'} options for ${type} text in a ${tone} tone`;
        
        if (elementName) {
          prompt += ` for a UI element named "${elementName}"`;
        }
        
        if (context) {
          prompt += `. Context: ${context}`;
        }
        
        if (brandVoice) {
          if (brandVoice.custom_rules) {
            prompt += `. Follow these rules: ${brandVoice.custom_rules}`;
          }
          
          if (brandVoice.examples) {
            prompt += `. Reference these examples of the brand voice: ${brandVoice.examples}`;
          }
        }
        
        if (elementData && Object.keys(elementData).length > 0) {
          prompt += `. Element data: ${JSON.stringify(elementData)}`;
        }
        
        // Call OpenAI
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional UX writer. Generate concise, effective copy for product interfaces.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
          n: 1
        });
        
        // Parse the response to extract suggestions
        if (response.choices?.[0]?.message?.content) {
          const content = response.choices[0].message.content;
          // Split into separate suggestions (assumes numbered list or similar)
          suggestions = content
            .split(/\d+\.\s+/)
            .filter(s => s.trim())
            .map(s => s.trim().replace(/^["']|["']$/g, ''));
        }
      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        // Fall back to mock suggestions if OpenAI fails
        suggestions = generateMockSuggestions(type, tone, type === 'button' ? 3 : 2);
      }
    } else {
      // Use mock suggestions if OpenAI is not available
      suggestions = generateMockSuggestions(type, tone, type === 'button' ? 3 : 2);
    }
    
    // Default to mock suggestions if none were generated
    if (!suggestions || suggestions.length === 0) {
      suggestions = generateMockSuggestions(type, tone, type === 'button' ? 3 : 2);
    }
    
    // Store the generation in the database
    const { data: copyGeneration, error: saveError } = await supabase
      .from('copy_generations')
      .insert({
        user_id: user.id,
        workspace_id: workspaceId,
        type,
        tone,
        context: context || null,
        element_name: elementName || null,
        element_type: elementType || null,
        suggestions: suggestions,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('Error saving copy generation:', saveError);
    } else {
      // Increment the workspace copy count
      await supabase
        .from('workspaces')
        .update({ 
          copy_count: supabase.rpc('increment', { x: 1 }),
          updated_at: new Date().toISOString()
        })
        .eq('id', workspaceId);
    }
    
    // Add to copy history if the workspace exists
    if (workspaceId) {
      // Create a summary of the generation for history
      const historySummary = `${type.charAt(0).toUpperCase() + type.slice(1)} for ${elementName || elementType || 'UI element'}`;
      
      await supabase.from('copy_history').insert({
        user_id: user.id,
        workspace_id: workspaceId,
        type: type,
        content: historySummary,
      });
    }
    
    // Return the suggestions
    return NextResponse.json({ 
      suggestions,
      generationId: copyGeneration?.id || null,
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