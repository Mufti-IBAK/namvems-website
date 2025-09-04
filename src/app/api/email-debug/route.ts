// src/app/api/email-debug/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    resendApiKey: process.env.RESEND_API_KEY ? 'Set (length: ' + process.env.RESEND_API_KEY.length + ')' : 'Not set',
    fromEmail: process.env.FROM_EMAIL || 'Not set',
    nodeEnv: process.env.NODE_ENV || 'Not set',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('RESEND') || key.includes('EMAIL')),
  })
}
