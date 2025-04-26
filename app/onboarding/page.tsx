'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SiteHeader from '@/app/components/SiteHeader';
import OnboardingWizard from '@/app/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Check if user is authenticated and hasn't completed onboarding
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }
      
      // Check if user has already completed onboarding
      const { data: userData, error } = await supabase
        .from('users')
        .select('has_completed_onboarding')
        .eq('id', session.user.id)
        .single();
      
      if (!error && userData?.has_completed_onboarding) {
        // Already completed onboarding, redirect to dashboard
        router.push('/dashboard');
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader isLoggedIn={true} />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full">
          <OnboardingWizard />
        </div>
      </main>
    </div>
  );
} 