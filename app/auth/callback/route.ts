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
  try {
    // Get auth code and state from URL
    const requestUrl = new URL(request.url)
    console.log("Auth callback URL received");
    
    const code = requestUrl.searchParams.get('code')
    const state = requestUrl.searchParams.get('state')
    
    // Check if we have a code from Figma
    if (!code) {
      console.error('Auth callback missing code parameter')
      return NextResponse.redirect(new URL('/login?error=No+authorization+code', 'https://www.copysnap.in'))
    }
    
    // Check if there's an error returned from Figma
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')
    
    if (error) {
      console.error(`Auth error: ${error}`, errorDescription);
      return NextResponse.redirect(new URL(`/login?error=${error}&description=${errorDescription || ''}`, 'https://www.copysnap.in'))
    }
    
    try {
      // DEMO MODE: Since we don't have a client secret in this demo, 
      // we'll use mock data instead of actual token exchange
      
      // In production, you would do:
      // 1. const tokenData = await exchangeCodeForToken(code, 'https://www.copysnap.in/auth/callback');
      // 2. if (!tokenData) throw new Error('Failed to exchange code for token');
      // 3. const userData = await fetchFigmaUserData(tokenData.access_token);
      
      // Instead, we'll use mock data for the demo
      const userData: FigmaUser = {
        id: `figma-${Date.now()}`,
        email: `user-${Date.now().toString(36)}@figmauser.com`,
        handle: 'Figma User',
        img_url: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      };
      
      // Create a Supabase client
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Generate a secure password for this user
      // In production, you would use a proper auth provider integration
      const securePassword = `secure-pwd-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
      
      // Try to sign in the user or create a new account
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: securePassword
      });
      
      if (signInError?.message.includes('Invalid login credentials')) {
        // User doesn't exist, create a new account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: securePassword,
          options: {
            data: {
              full_name: userData.handle,
              avatar_url: userData.img_url,
              figma_user_id: userData.id,
              provider: 'figma'
            }
          }
        });
        
        if (signUpError) {
          console.error('Error creating user account:', signUpError);
          return NextResponse.redirect(new URL('/login?error=Account+creation+failed', 'https://www.copysnap.in'));
        }
        
        // Store the Figma token data for future API calls (in production)
        // In a real implementation, you would securely store the tokens
        // await supabase.from('user_integrations').insert({
        //   user_id: signUpData.user.id,
        //   provider: 'figma',
        //   access_token: tokenData.access_token,
        //   refresh_token: tokenData.refresh_token,
        //   expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        // });
        
        // New user created, redirect to onboarding
        return NextResponse.redirect(new URL('/onboarding', 'https://www.copysnap.in'));
      } else if (signInError) {
        // Other error
        console.error('Error signing in:', signInError);
        return NextResponse.redirect(new URL(`/login?error=Authentication+failed&details=${encodeURIComponent(signInError.message)}`, 'https://www.copysnap.in'));
      }
      
      // User already exists, check if they need onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      // Redirect based on onboarding status
      if (!profile || !profile.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', 'https://www.copysnap.in'));
      } else {
        return NextResponse.redirect(new URL('/dashboard', 'https://www.copysnap.in'));
      }
    } catch (processError) {
      console.error("Exception during auth process:", processError);
      const errorMessage = processError instanceof Error ? processError.message : 'Unknown error';
      return NextResponse.redirect(new URL(`/login?error=Authentication+failed&details=${encodeURIComponent(errorMessage)}`, 'https://www.copysnap.in'));
    }
  } catch (error) {
    console.error('Error in auth callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(new URL(`/login?error=Authentication+failed&details=${encodeURIComponent(errorMessage)}`, 'https://www.copysnap.in'));
  }
} 