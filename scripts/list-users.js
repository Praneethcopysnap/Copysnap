import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listUsers() {
  try {
    console.log('Fetching profiles from the database...\n')
    
    // Fetch profiles with detailed error logging
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profileError) {
      console.error('\nError fetching profiles:', profileError)
      if (profileError.message.includes('does not exist')) {
        console.log('\nThe profiles table might not exist in the database.')
        console.log('Please check if the table was created properly.')
      }
      return
    }

    if (!profiles || profiles.length === 0) {
      console.log('\nNo profiles found in the database.')
      console.log('This could mean:')
      console.log('1. No users have signed up yet')
      console.log('2. Profiles are not being created during signup')
      console.log('3. The profiles table exists but is empty')
      return
    }

    console.log('Found Profiles:')
    console.log('-----------------------------')
    profiles.forEach((profile, index) => {
      console.log(`Profile ${index + 1}:`)
      console.log(`  ID: ${profile.id}`)
      console.log(`  Full Name: ${profile.full_name || 'Not set'}`)
      console.log(`  Company: ${profile.company || 'Not set'}`)
      console.log(`  Job Title: ${profile.job_title || 'Not set'}`)
      console.log(`  Created At: ${new Date(profile.created_at).toLocaleString()}`)
      console.log('-----------------------------')
    })

    console.log('\nTo delete a profile, run:')
    console.log('node scripts/delete-user.js USER_ID')
    console.log('\nReplace USER_ID with the ID of the profile you want to delete.')
    console.log('\nNote: This will only delete the profile data. To fully delete the user account,')
    console.log('you need to also delete them from the Supabase Authentication dashboard:')
    console.log('https://app.supabase.com/project/_/auth/users')
  } catch (err) {
    console.error('Unexpected error:', err)
    console.log('\nPlease check:')
    console.log('1. Your Supabase URL and anon key are correct')
    console.log('2. You have an internet connection')
    console.log('3. The Supabase service is running')
  }
}

listUsers() 