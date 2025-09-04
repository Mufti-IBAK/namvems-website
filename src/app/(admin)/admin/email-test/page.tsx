'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function EmailTestPage() {
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const testBasicResend = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/resend-test', { method: 'GET' })
      const result = await response.json()
      
      if (result.success) {
        toast.success('Basic Resend test successful!')
        console.log('Resend test result:', result)
      } else {
        toast.error('Resend test failed: ' + result.error)
      }
    } catch (error) {
      toast.error('Failed to test Resend')
      console.error('Resend test error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testCustomEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/resend-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail })
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success(`Test email sent to ${testEmail}!`)
        console.log('Custom email test result:', result)
      } else {
        toast.error('Custom email test failed: ' + result.error)
      }
    } catch (error) {
      toast.error('Failed to send custom test email')
      console.error('Custom email test error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testBulkEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'announcement',
          subject: 'Test Bulk Email from NAMVEMS',
          message: 'This is a test bulk email to verify the bulk email functionality is working correctly.',
          recipients: [
            { email: 'delivered@resend.dev', name: 'Test User 1' },
            { email: testEmail || 'delivered@resend.dev', name: 'Test User 2' }
          ]
        })
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success('Bulk email test successful!')
        console.log('Bulk email test result:', result)
      } else {
        toast.error('Bulk email test failed: ' + (result.error || 'Unknown error'))
        console.error('Bulk email error:', result)
      }
    } catch (error) {
      toast.error('Failed to test bulk email')
      console.error('Bulk email test error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testWelcomeEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          recipientEmail: testEmail,
          recipientName: 'Test User'
        })
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success('Welcome email test successful!')
        console.log('Welcome email test result:', result)
      } else {
        toast.error('Welcome email test failed: ' + (result.error || 'Unknown error'))
        console.error('Welcome email error:', result)
      }
    } catch (error) {
      toast.error('Failed to test welcome email')
      console.error('Welcome email test error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Integration Test</h1>
          
          <div className="space-y-6">
            {/* Test Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email (for testing custom recipients)
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testBasicResend}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Basic Resend'}
              </button>

              <button
                onClick={testCustomEmail}
                disabled={loading || !testEmail}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Custom Email'}
              </button>

              <button
                onClick={testWelcomeEmail}
                disabled={loading || !testEmail}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Welcome Email'}
              </button>

              <button
                onClick={testBulkEmail}
                disabled={loading}
                className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Bulk Email'}
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900 mb-2">Testing Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Basic Resend:</strong> Tests if the Resend API is configured correctly</li>
                <li>• <strong>Custom Email:</strong> Sends a test email to your specified address</li>
                <li>• <strong>Welcome Email:</strong> Tests the user signup email template</li>
                <li>• <strong>Bulk Email:</strong> Tests the bulk email functionality for announcements</li>
                <li>• Check your email inbox and also the browser console for detailed results</li>
                <li>• Check your Resend dashboard at https://resend.com/emails to see sent emails</li>
              </ul>
            </div>

            {/* Environment Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="font-medium text-gray-900 mb-2">Environment Status:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• API endpoints are available at /api/resend-test and /api/bulk-email</p>
                <p>• Using Resend API for email delivery</p>
                <p>• Fallback domain: onboarding@resend.dev</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
