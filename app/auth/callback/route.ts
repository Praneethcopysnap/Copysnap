import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Figma API types
interface FigmaUser {
  id: string;
  email: string;
  handle: string;
  img_url: string;
  [key: string]: any;
}

interface FigmaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Make sure this matches EXACTLY with the client ID in your Figma Developer Dashboard
const FIGMA_CLIENT_ID = process.env.FIGMA_CLIENT_ID || 'lP80gmLrQMgHiGqxjFryeV';
// IMPORTANT: You must set your actual Figma client secret in environment variables
// for production authentication to work properly
const FIGMA_CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET || '';

// Set to false to enable real Figma authentication in production
const DEMO_MODE = false;

// Exchange the authorization code for an access token
async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<FigmaTokenResponse | null> {
  const clientId = process.env.FIGMA_CLIENT_ID || 'lP80gmLrQMgHiGqxjFryeV';
  const clientSecret = process.env.FIGMA_CLIENT_SECRET || '';
  
  try {
    const response = await fetch('https://www.figma.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
        grant_type: 'authorization_code'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token exchange failed:', response.status, errorData);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

// Fetch user data from Figma API
async function fetchFigmaUserData(accessToken: string): Promise<FigmaUser | null> {
  try {
    const response = await fetch('https://api.figma.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      console.error('Figma API error:', response.status);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Figma user data:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Get the URL object to extract query parameters
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  
  // Create a Supabase client
  const supabase = createRouteHandlerClient({ cookies });
  
  // Log the full callback URL for debugging
  console.log('Auth callback received at URL:', request.url);
  console.log('Query parameters:', Object.fromEntries(requestUrl.searchParams));
  
  // Handle errors from Figma
  if (error) {
    console.error('Figma OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=authentication_failed&reason=${errorDescription || error}`);
  }
  
  // Check if the code is present
  if (!code) {
    console.error('No code received from Figma');
    return NextResponse.redirect(`${requestUrl.origin}/login?error=missing_code`);
  }
  
  // Validate state parameter for security (prevents CSRF)
  if (state !== 'figma-auth') {
    console.error('Invalid state parameter');
    return NextResponse.redirect(`${requestUrl.origin}/login?error=invalid_state`);
  }
  
  try {
    if (DEMO_MODE) {
      // DEMO MODE: Create a demo user instead of making real API calls
      console.log('Running in DEMO mode - creating mock user session');
      
      // Get or create demo user
      const { data: { user }, error: userError } = await supabase.auth.signInWithPassword({
        email: 'demo@copysnap.in',
        password: process.env.DEMO_USER_PASSWORD || 'demo-password-123'
      }).catch(async () => {
        // If sign-in fails, try to create the user
        return await supabase.auth.signUp({
          email: 'demo@copysnap.in',
          password: process.env.DEMO_USER_PASSWORD || 'demo-password-123',
          options: {
            data: {
              full_name: 'Demo User',
              figma_id: 'demo-figma-user',
              figma_name: 'Demo User',
              figma_email: 'demo@copysnap.in',
              figma_img: 'https://placehold.co/200x200/5000ff/ffffff?text=DEMO'
            }
          }
        });
      });
      
      if (userError) {
        console.error('Error with demo user:', userError);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=demo_user_error`);
      }
      
      console.log('Demo user session created:', user?.id);
      return NextResponse.redirect(`${requestUrl.origin}/dashboard?success=demo_login`);
    } else {
      // PRODUCTION MODE: Exchange the authorization code for an access token
      console.log('Exchanging authorization code for Figma access token');
      
      const tokenResponse = await fetch('https://www.figma.com/api/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: FIGMA_CLIENT_ID,
          client_secret: FIGMA_CLIENT_SECRET,
          redirect_uri: `${requestUrl.origin}/auth/callback`,
          code,
          grant_type: 'authorization_code'
        })
      });
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('Token exchange failed:', tokenResponse.status, errorData);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=token_exchange_failed`);
      }
      
      const tokenData = await tokenResponse.json();
      console.log('Received token from Figma:', Object.keys(tokenData));
      
      // Fetch user information from Figma
      const userResponse = await fetch('https://api.figma.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        console.error('Failed to fetch Figma user data:', userResponse.status);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=user_fetch_failed`);
      }
      
      const figmaUser = await userResponse.json();
      console.log('Figma user data:', figmaUser);
      
      // Check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('figma_id', figmaUser.id)
        .single();
      
      if (existingUser) {
        // User exists, sign them in
        console.log('Existing user found:', existingUser.id);
        const { error: signInError } = await supabase.auth.signInWithIdToken({
          provider: 'figma',
          token: tokenData.access_token,
          nonce: state,
        });
        
        if (signInError) {
          console.error('Error signing in user:', signInError);
          return NextResponse.redirect(`${requestUrl.origin}/login?error=signin_failed`);
        }
      } else {
        // New user, create an account
        console.log('Creating new user for Figma user:', figmaUser.id);
        
        // Generate a random password for the user
        const password = Math.random().toString(36).slice(-10);
        
        // Create a new user in Supabase
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: figmaUser.email,
          password,
          options: {
            data: {
              full_name: figmaUser.name,
              figma_id: figmaUser.id,
              figma_name: figmaUser.name,
              figma_email: figmaUser.email,
              figma_img: figmaUser.img_url,
              // Store encrypted access token if needed for API calls
              figma_access_token: tokenData.access_token,
              figma_refresh_token: tokenData.refresh_token
            }
          }
        });
        
        if (signUpError) {
          console.error('Error creating new user:', signUpError);
          return NextResponse.redirect(`${requestUrl.origin}/login?error=signup_failed`);
        }
        
        console.log('New user created:', newUser?.user?.id);
      }
      
      // Success! Redirect to the dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard?success=true`);
    }
  } catch (error) {
    console.error('Error in Figma authentication flow:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=authentication_failed&reason=server_error`);
  }
} 