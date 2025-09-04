// src/app/api/bulk-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }
  return new Resend(apiKey)
}

interface BulkEmailRequest {
  type: 'event-update' | 'announcement' | 'reminder'
  eventId?: number
  eventTitle?: string
  subject?: string
  message?: string
  recipients: Array<{
    email: string
    name: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkEmailRequest = await request.json()
    const { type, eventId, eventTitle, subject, message, recipients } = body

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recipients provided' },
        { status: 400 }
      )
    }

    const resend = getResendClient()

    // Generate email content based on type
    let emailSubject: string
    let emailHtml: string

    switch (type) {
      case 'event-update':
        emailSubject = subject || `Important Update: ${eventTitle || 'Event'}`
        emailHtml = generateEventUpdateEmail(eventTitle || 'Event', message || 'We have an important update regarding this event.')
        break
      
      case 'reminder':
        emailSubject = subject || `Reminder: ${eventTitle || 'Event'} is Coming Up!`
        emailHtml = generateEventReminderEmail(eventTitle || 'Event', message || 'This is a friendly reminder about the upcoming event.')
        break
      
      case 'announcement':
        emailSubject = subject || 'Important Announcement from NAMVEMS'
        emailHtml = generateAnnouncementEmail(message || 'We have an important announcement for you.')
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
          { status: 400 }
        )
    }

    // Send emails in batches to avoid rate limits
    const batchSize = 50
    const results = []
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      try {
        const { data, error } = await resend.emails.send({
          from: 'NAMVEMS@resend.dev', // Using NAMVEMS API name
          to: batch.map(recipient => recipient.email),
          subject: emailSubject,
          html: emailHtml,
        })

        if (error) {
          console.error('Error sending batch email:', error)
          results.push({ success: false, error: error.message, batch: i / batchSize + 1 })
        } else {
          results.push({ success: true, data, batch: i / batchSize + 1 })
        }
      } catch (error) {
        console.error('Batch email error:', error)
        results.push({ success: false, error: 'Failed to send batch', batch: i / batchSize + 1 })
      }
    }

    const successfulBatches = results.filter(r => r.success).length
    const totalBatches = results.length

    return NextResponse.json({
      success: successfulBatches > 0,
      message: `Successfully sent emails to ${successfulBatches}/${totalBatches} batches`,
      totalRecipients: recipients.length,
      results
    })

  } catch (error) {
    console.error('Bulk email error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send bulk emails' },
      { status: 500 }
    )
  }
}

function generateEventUpdateEmail(eventTitle: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Update</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FFD700, #228B22); color: white; text-align: center; padding: 30px 20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .update-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f8f9fa; text-align: center; padding: 20px; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 Event Update</h1>
          <p>Nigerian Association of Muslim Veterinary Medical Students</p>
        </div>
        
        <div class="content">
          <h2>Update Regarding: ${eventTitle}</h2>
          
          <div class="update-box">
            <h3>📋 Important Information</h3>
            <p>${message}</p>
          </div>
          
          <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          <strong>NAMVEMS Team</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS)</strong></p>
          <p>Empowering Nigerian Veterinary Medical Students Nationwide</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateEventReminderEmail(eventTitle: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Reminder</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FFD700, #228B22); color: white; text-align: center; padding: 30px 20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .reminder-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; margin: 20px 0; border-radius: 6px; }
        .footer { background: #f8f9fa; text-align: center; padding: 20px; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Event Reminder</h1>
          <p>Nigerian Association of Muslim Veterinary Medical Students</p>
        </div>
        
        <div class="content">
          <h2>Don't Forget: ${eventTitle}</h2>
          
          <div class="reminder-box">
            <h3>📅 Reminder</h3>
            <p>${message}</p>
          </div>
          
          <p>We're looking forward to seeing you at the event!</p>
          
          <p>Best regards,<br>
          <strong>NAMVEMS Team</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS)</strong></p>
          <p>Empowering Nigerian Veterinary Medical Students Nationwide</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateAnnouncementEmail(message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NAMVEMS Announcement</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FFD700, #228B22); color: white; text-align: center; padding: 30px 20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .announcement-box { background: #e8f5e8; border: 2px solid #228B22; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #f8f9fa; text-align: center; padding: 20px; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📣 Important Announcement</h1>
          <p>Nigerian Association of Muslim Veterinary Medical Students</p>
        </div>
        
        <div class="content">
          <div class="announcement-box">
            <h3>📢 Announcement</h3>
            <p>${message}</p>
          </div>
          
          <p>Thank you for being part of the NAMVEMS community.</p>
          
          <p>Best regards,<br>
          <strong>NAMVEMS Team</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS)</strong></p>
          <p>Empowering Nigerian Veterinary Medical Students Nationwide</p>
        </div>
      </div>
    </body>
    </html>
  `
}
