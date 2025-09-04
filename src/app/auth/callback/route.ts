import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sendWelcomeEmail } from '@/lib/services/emailService'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isNewUser = requestUrl.searchParams.get('new_user') === 'true'

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    // If this is a new user signup, send welcome email
    if (isNewUser && data?.user && !error) {
      try {
        const userMetadata = data.user.user_metadata
        const email = data.user.email
        const name = userMetadata?.full_name || userMetadata?.name || email?.split('@')[0] || 'New Member'
        
        await sendWelcomeEmail({
          recipientEmail: email!,
          recipientName: name,
        })
        
        console.log('Welcome email sent to new user:', email)
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail the signup if email fails
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
