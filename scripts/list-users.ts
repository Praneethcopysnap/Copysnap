import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listUsers() {
  try {
    console.log('Fetching user profiles...')
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (error) {
      console.error('Error fetching profiles:', error)
      return
    }

    if (!profiles || profiles.length === 0) {
      console.log('No user profiles found')
      return
    }

    console.log('\nUser Profiles in the database:')
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

    console.log('\nTo delete a user profile, run:')
    console.log('npx ts-node scripts/delete-user.ts USER_ID')
    console.log('\nReplace USER_ID with the ID of the profile you want to delete.')
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

listUsers() 