import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteUserProfile(userId: string) {
  try {
    console.log('Deleting user profile...')

    // First delete from profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return
    }

    console.log('Profile deleted successfully')
    console.log('Note: To fully delete the user, you need to delete them from the Supabase dashboard Authentication section.')
    console.log('Dashboard URL: https://app.supabase.com/project/_/auth/users')

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Check if user ID was provided as command line argument
const userId = process.argv[2]
if (!userId) {
  console.error('Please provide a user ID as an argument')
  console.log('Usage: npx ts-node scripts/delete-user.ts USER_ID')
  process.exit(1)
}

deleteUserProfile(userId) 