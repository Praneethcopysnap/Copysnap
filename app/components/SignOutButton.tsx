'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        return;
      }
      console.log('Successfully signed out');
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className={className || "block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"}
    >
      Sign out
    </button>
  )
} 