// src/app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEventRegistrationEmail, sendWelcomeEmail } from '@/lib/services/emailService'

export async function POST(request: NextRequest) {
  try {
    const { type, recipientEmail, recipientName, eventData } = await request.json()

    if (type === 'welcome') {
      const result = await sendWelcomeEmail({
        recipientEmail,
        recipientName,
      })
      return NextResponse.json({ success: true, result })
    } 
    
    else if (type === 'event-registration' && eventData) {
      const result = await sendEventRegistrationEmail({
        recipientEmail,
        recipientName,
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventLocation: eventData.location,
        eventDescription: eventData.description,
      })
      return NextResponse.json({ success: true, result })
    }
    
    else {
      return NextResponse.json(
        { success: false, error: 'Invalid email type or missing data' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Simple GET endpoint to test if API is working
export async function GET() {
  return NextResponse.json({ 
    message: 'Email test API is working',
    availableTypes: ['welcome', 'event-registration']
  })
}
