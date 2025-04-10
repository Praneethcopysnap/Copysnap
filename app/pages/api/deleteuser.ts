import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client using service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role required!
)

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ message: 'Missing or invalid userId' }, { status: 400 })
  }

  try {
    // Step 1: Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      return NextResponse.json(
        { message: 'Failed to delete user from auth', error: authError.message },
        { status: 500 }
      )
    }

    // Step 2: Delete user profile from your `profiles` table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      return NextResponse.json(
        { message: 'User deleted from auth, but failed to delete profile', error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'User and profile deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
