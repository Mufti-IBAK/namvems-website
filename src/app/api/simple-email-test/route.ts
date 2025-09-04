// src/app/api/simple-email-test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { to, fromFormat, testType } = (await request.json()) as { to?: string; fromFormat?: string; testType?: 'simple' | 'complex' }
    
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured'
      }, { status: 400 })
    }

    const resend = new Resend(apiKey)

    // Test different from formats
    const fromOptions = {
      'onboarding': 'onboarding@resend.dev',
      'namvems-onboarding': 'NAMVEMS <onboarding@resend.dev>',
      'namvems-api': 'NAMVEMS@resend.dev',
      'namvems-api-named': 'NAMVEMS <NAMVEMS@resend.dev>'
    } as const

    const validFromFormats = Object.keys(fromOptions) as Array<keyof typeof fromOptions>
    const isValidFromFormat = (val: unknown): val is keyof typeof fromOptions =>
      typeof val === 'string' && (validFromFormats as string[]).includes(val)
    const fromKey: keyof typeof fromOptions = isValidFromFormat(fromFormat) ? fromFormat : 'onboarding'
    const fromAddress = fromOptions[fromKey]

    // Simple vs Complex email content
    const simpleEmail = {
      from: fromAddress,
      to: [to || 'delivered@resend.dev'],
      subject: `Test Email - ${testType} - ${fromFormat}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Simple Test Email</h1>
          <p>This is a minimal test email to isolate issues.</p>
          <p><strong>From Format:</strong> ${fromAddress}</p>
          <p><strong>Test Type:</strong> ${testType}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    }

    const complexEmail = {
      from: fromAddress,
      to: [to || 'delivered@resend.dev'],
      subject: `Complex Test Email - ${testType} - ${fromFormat}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Complex Test</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #FFD700, #228B22); color: white; text-align: center; padding: 30px 20px; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Complex Test Email</h1>
            </div>
            <div class="content">
              <p><strong>From Format:</strong> ${fromAddress}</p>
              <p><strong>Test Type:</strong> ${testType}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p>This email tests complex HTML formatting to see if template size is the issue.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailToSend = testType === 'simple' ? simpleEmail : complexEmail

    console.log('Sending email with config:', {
      from: emailToSend.from,
      to: emailToSend.to,
      subject: emailToSend.subject,
      htmlLength: emailToSend.html.length
    })

    const { data, error } = await resend.emails.send(emailToSend)

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Resend API error',
        details: error,
        config: {
          from: emailToSend.from,
          to: emailToSend.to,
          htmlLength: emailToSend.html.length
        }
      }, { status: 500 })
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json({
      success: true,
      message: `${testType} email sent successfully!`,
      data: data,
      config: {
        from: emailToSend.from,
        to: emailToSend.to,
        htmlLength: emailToSend.html.length
      }
    })

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
