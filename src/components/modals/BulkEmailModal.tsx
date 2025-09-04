'use client'

import { useState } from 'react'
import { FaTimes, FaSpinner, FaEnvelope } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface BulkEmailModalProps {
  isOpen: boolean
  onClose: () => void
  recipients: Array<{
    email: string
    name: string
  }>
  eventTitle?: string
  eventId?: number
}

export default function BulkEmailModal({
  isOpen,
  onClose,
  recipients,
  eventTitle,
  eventId
}: BulkEmailModalProps) {
  const [emailType, setEmailType] = useState<'event-update' | 'reminder' | 'announcement'>('event-update')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setSending(true)

    try {
      const response = await fetch('/api/bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emailType,
          eventId,
          eventTitle,
          subject: subject || undefined,
          message: message.trim(),
          recipients
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Email sent to ${recipients.length} recipient(s)!`)
        onClose()
        setSubject('')
        setMessage('')
      } else {
        toast.error(result.error || 'Failed to send emails')
      }
    } catch (error) {
      console.error('Error sending bulk email:', error)
      toast.error('Failed to send emails')
    } finally {
      setSending(false)
    }
  }

  const getDefaultSubject = () => {
    switch (emailType) {
      case 'event-update':
        return `Important Update: ${eventTitle || 'Event'}`
      case 'reminder':
        return `Reminder: ${eventTitle || 'Event'} is Coming Up!`
      case 'announcement':
        return 'Important Announcement from NAMVEMS'
      default:
        return ''
    }
  }

  const getPlaceholderMessage = () => {
    switch (emailType) {
      case 'event-update':
        return 'Enter important updates about the event (e.g., time change, venue change, requirements, etc.)'
      case 'reminder':
        return 'Enter reminder details (e.g., what to bring, arrival time, parking instructions, etc.)'
      case 'announcement':
        return 'Enter your announcement message (e.g., general information, new policies, opportunities, etc.)'
      default:
        return 'Enter your message here...'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-blue-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">
              Send Bulk Email to {recipients.length} Recipient(s)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={sending}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Type
            </label>
            <select
              value={emailType}
              onChange={(e) => {
                setEmailType(e.target.value as any)
                setSubject('')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            >
              <option value="event-update">📢 Event Update</option>
              <option value="reminder">⏰ Event Reminder</option>
              <option value="announcement">📣 General Announcement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject (Optional - will use default if empty)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={getDefaultSubject()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={getPlaceholderMessage()}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
              disabled={sending}
            />
            <p className="mt-1 text-xs text-gray-500">
              This message will be formatted in a professional email template with NAMVEMS branding.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Recipients Preview</h3>
            <p className="text-sm text-gray-600 mb-2">
              Email will be sent to {recipients.length} recipient(s):
            </p>
            <div className="max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {recipients.slice(0, 10).map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {recipient.name}
                  </span>
                ))}
                {recipients.length > 10 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{recipients.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={sending}
            >
              {sending ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FaEnvelope />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
