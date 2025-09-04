import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/services/emailService'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isNewUser = requestUrl.searchParams.get('new_user') === 'true'

  if (code) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    // Determine if this appears to be a brand new user (in addition to explicit new_user flag)
    const createdAt = data?.user?.created_at ? new Date(data.user.created_at).getTime() : 0
    const minutesSinceCreated = createdAt ? (Date.now() - createdAt) / 60000 : Infinity
    const looksNew = minutesSinceCreated >= 0 && minutesSinceCreated < 10

    // If this is a new user signup, send welcome email
    if ((isNewUser || looksNew) && data?.user && !error) {
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
