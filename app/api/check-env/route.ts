import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Mask sensitive information for security
  const maskKey = (key: string | undefined) => {
    if (!key) return 'Not set';
    if (key.length < 10) return 'Invalid (too short)';
    // Only show first 4 and last 4 characters
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return NextResponse.json({
    environment: process.env.NODE_ENV || 'unknown',
    openaiKeyStatus: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
    openaiKeyMasked: maskKey(process.env.OPENAI_API_KEY),
    figmaTokenStatus: process.env.FIGMA_API_TOKEN ? 'Set' : 'Not set',
    figmaTokenMasked: maskKey(process.env.FIGMA_API_TOKEN),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
    supabaseKeyStatus: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    timestamp: new Date().toISOString()
  });
} 