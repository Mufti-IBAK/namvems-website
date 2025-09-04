// src/app/api/resend-test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.FROM_EMAIL
    
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'Not set',
      fromEmail: fromEmail || 'Not set'
    })

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY environment variable is not set',
        envCheck: {
          RESEND_API_KEY: 'Not set',
          FROM_EMAIL: fromEmail || 'Not set'
        }
      }, { status: 400 })
    }

    const resend = new Resend(apiKey)

    // Try to send a test email using the Resend test domain
    const testEmail = {
      from: 'NAMVEMS@resend.dev', // Using NAMVEMS API name
      to: ['delivered@resend.dev'], // Resend's test email that always works
      subject: 'NAMVEMS Email Integration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #228B22;">Test Email from NAMVEMS</h1>
          <p>This is a test email to verify Resend integration is working.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key:</strong> ${apiKey.substring(0, 8)}...</p>
          <div style="background: #f0f8f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>✅ If you see this email in your Resend dashboard, the integration is working!</strong></p>
          </div>
        </div>
      `
    }

    console.log('Sending test email with config:', {
      from: testEmail.from,
      to: testEmail.to,
      subject: testEmail.subject
    })

    const { data, error } = await resend.emails.send(testEmail)

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Resend API error',
        details: error,
        envCheck: {
          RESEND_API_KEY: `Set (${apiKey.length} chars)`,
          FROM_EMAIL: fromEmail || 'Not set'
        }
      }, { status: 500 })
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      data: data,
      envCheck: {
        RESEND_API_KEY: `Set (${apiKey.length} chars)`,
        FROM_EMAIL: fromEmail || 'Not set'
      },
      instructions: 'Check your Resend dashboard at https://resend.com/emails to see if the email was sent.'
    })

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json()
    
    if (!to || !to.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email address is required'
      }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY environment variable is not set'
      }, { status: 400 })
    }

    const resend = new Resend(apiKey)

    const testEmail = {
      from: 'NAMVEMS@resend.dev',
      to: [to],
      subject: 'NAMVEMS Email Test - Custom Recipient',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #228B22;">Test Email from NAMVEMS</h1>
          <p>This is a test email sent to your custom email address: <strong>${to}</strong></p>
          <p>If you received this, the Resend integration is working!</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>🎉 Success! Your email integration is working correctly.</strong></p>
          </div>
        </div>
      `
    }

    console.log('Sending custom test email to:', to)

    const { data, error } = await resend.emails.send(testEmail)

    if (error) {
      console.error('Custom test email error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to send custom test email',
        details: error
      }, { status: 500 })
    }

    console.log('Custom email sent successfully:', data)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${to}!`,
      data: data
    })

  } catch (error) {
    console.error('Custom test email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send custom test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
