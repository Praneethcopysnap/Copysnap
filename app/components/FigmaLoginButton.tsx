'use client';

import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';

interface FigmaLoginButtonProps {
  mode?: 'login' | 'signup';
  className?: string;
}

export default function FigmaLoginButton({ mode = 'login', className = '' }: FigmaLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Clear errors on component mount
  useEffect(() => {
    // Check if there are errors in the URL to display
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get('error');
    const errorDetails = searchParams.get('details');
    
    if (errorParam) {
      setError(`${errorParam}${errorDetails ? `: ${errorDetails}` : ''}`);
    }
    
    return () => setError(null);
  }, []);

  // Function to handle Figma OAuth login
  const handleFigmaLogin = () => {
    try {
      setLoading(true);
      
      // Get client ID from environment variable - MAKE SURE THIS MATCHES EXACTLY
      // IP8DgmLrOAgHIGqxFryeV seems incorrect - using the value from the screenshot
      const clientId = process.env.NEXT_PUBLIC_FIGMA_CLIENT_ID || 'lP80gmLrQMgHiGqxjFryeV';
      
      // Create the Figma OAuth URL
      const figmaAuthUrl = new URL('https://www.figma.com/oauth');
      
      // Determine the correct redirect URI based on environment
      const isProduction = window.location.hostname !== 'localhost';
      const redirectUri = isProduction 
        ? 'https://www.copysnap.in/auth/callback'  // Production
        : `${window.location.origin}/auth/callback`; // Development
      
      // Add required parameters
      figmaAuthUrl.searchParams.append('client_id', clientId);
      figmaAuthUrl.searchParams.append('redirect_uri', redirectUri);
      figmaAuthUrl.searchParams.append('scope', 'files:read');
      figmaAuthUrl.searchParams.append('state', 'figma-auth');
      figmaAuthUrl.searchParams.append('response_type', 'code');
      
      // Log the URL and redirect URI for debugging
      console.log('Figma Auth URL:', figmaAuthUrl.toString());
      console.log('Redirect URI:', redirectUri);
      console.log('Client ID:', clientId);
      
      // Redirect to Figma for OAuth
      window.location.href = figmaAuthUrl.toString();
    } catch (error) {
      console.error('Error during Figma login:', error);
      setError('Failed to initiate Figma login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        onClick={handleFigmaLogin}
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.5641 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.5641 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.5641 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.5641 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.5641 1.00089 2.78249 2.78249C1.00089 4.5641 0 6.98044 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.5641 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.5641 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF"/>
          </svg>
        )}
        {loading ? 'Connecting...' : 'Login with Figma'}
      </Button>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <p className="text-xs text-muted-foreground text-center">
        Connect with your Figma account to access your designs and collaborate seamlessly.
      </p>
    </div>
  );
} 