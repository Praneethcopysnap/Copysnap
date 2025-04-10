import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
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
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="w-full justify-start"
    >
      Sign out
    </Button>
  )
} 