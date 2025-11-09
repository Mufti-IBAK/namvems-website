'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { format } from 'date-fns'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaUniversity, FaCalendarAlt, FaCreditCard, FaCheck, FaClock, FaTimesCircle, FaSpinner } from 'react-icons/fa'

interface RegistrationDetail {
  id: string
  event_id: number
  user_id: string
  full_name: string
  email: string
  phone_number: string | null
  university: string | null
  level_of_study: string | null
  specialization: string | null
  additional_info: string | null
  registration_date: string
  attendance_status: 'registered' | 'attended' | 'absent' | 'cancelled'
  created_at: string
  updated_at: string
}

interface EventDetail {
  id: number
  title: string
  date: string
  location: string | null
  description: string | null
}

interface PaymentDetail {
  id: string
  created_at: string
  paid_at: string | null
  full_name: string
  email: string
  amount: number
  currency: string
  status: 'successful' | 'pending' | 'failed'
  tx_ref: string
}

interface FormResponse {
  event_id: number
  user_id: string
  responses: Record<string, unknown>
  created_at: string
}

export default function RegistrationDetailsPage() {
  useAuth()
  const supabase = createClient()
  const params = useParams()
  const router = useRouter()
  const registrationId = params.id as string

  const [registration, setRegistration] = useState<RegistrationDetail | null>(null)
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [payments, setPayments] = useState<PaymentDetail[]>([])
  const [formResponses, setFormResponses] = useState<FormResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch registration details
        const { data: regData, error: regError } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('id', registrationId)
          .single()

        if (regError || !regData) {
          toast.error('Registration not found')
          router.push('/admin/registrations')
          return
        }

        setRegistration(regData as RegistrationDetail)

        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title, date, location, description')
          .eq('id', regData.event_id)
          .single()

        if (!eventError && eventData) {
          setEvent(eventData as EventDetail)
        }

        // Fetch payments for this email
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('email', regData.email)
          .order('created_at', { ascending: false })

        if (!paymentError && paymentData) {
          setPayments(paymentData as PaymentDetail[])
        }

        // Fetch form responses if available
        const { data: formData, error: formError } = await supabase
          .from('event_form_responses')
          .select('*')
          .eq('user_id', regData.user_id)
          .eq('event_id', regData.event_id)
          .maybeSingle()

        if (!formError && formData) {
          setFormResponses(formData as FormResponse)
        }
      } catch (error) {
        console.error('Error fetching details:', error)
        toast.error('Failed to load registration details')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [registrationId, supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-primary text-3xl mr-3" />
        <span className="text-lg">Loading registration details...</span>
      </div>
    )
  }

  if (!registration || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Registration not found</p>
      </div>
    )
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'attended':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getPaymentStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/registrations"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft /> Back to Registrations
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <FaUser className="text-primary text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaUser /> Full Name
                  </label>
                  <p className="text-lg font-medium text-gray-900">{registration.full_name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaEnvelope /> Email
                  </label>
                  <p className="text-lg font-medium text-gray-900 break-all">{registration.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaPhone /> Phone Number
                  </label>
                  <p className="text-lg font-medium text-gray-900">{registration.phone_number || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaUniversity /> University/Institution
                  </label>
                  <p className="text-lg font-medium text-gray-900">{registration.university || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaGraduationCap /> Level of Study
                  </label>
                  <p className="text-lg font-medium text-gray-900">{registration.level_of_study || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaUniversity /> Specialization
                  </label>
                  <p className="text-lg font-medium text-gray-900">{registration.specialization || 'N/A'}</p>
                </div>
              </div>

              {registration.additional_info && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Additional Information</label>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{registration.additional_info}</p>
                </div>
              )}
            </div>
          </div>

          {/* Event & Registration Status */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <FaCalendarAlt className="text-primary text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Event Title</label>
                  <p className="text-lg font-medium text-gray-900">{event.title}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaCalendarAlt /> Event Date
                  </label>
                  <p className="text-lg font-medium text-gray-900">{format(new Date(event.date), 'MMM d, yyyy hh:mm a')}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Location</label>
                  <p className="text-lg font-medium text-gray-900">{event.location || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Attendance Status</label>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeStyle(registration.attendance_status)}`}>
                    {registration.attendance_status.charAt(0).toUpperCase() + registration.attendance_status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <FaCalendarAlt /> Registration Date
                  </label>
                  <p className="text-lg font-medium text-gray-900">{format(new Date(registration.created_at), 'MMM d, yyyy hh:mm a')}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Last Updated</label>
                  <p className="text-lg font-medium text-gray-900">{format(new Date(registration.updated_at), 'MMM d, yyyy hh:mm a')}</p>
                </div>
              </div>

              {event.description && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Event Description</label>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Responses */}
          {formResponses && formResponses.responses && Object.keys(formResponses.responses).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <FaUser className="text-primary text-2xl" />
                <h2 className="text-2xl font-bold text-gray-900">Custom Form Responses</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(formResponses.responses).map(([key, value]) => (
                  <div key={key} className="pb-4 border-b last:border-b-0">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">{key}</label>
                    <p className="text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Payment Info */}
        <div className="space-y-6">
          {/* Payment Status Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <FaCreditCard className="text-primary text-2xl" />
              <h2 className="text-xl font-bold text-gray-900">Payment Status</h2>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-8">
                <FaClock className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No payments recorded</p>
                <p className="text-sm text-gray-500 mt-1">This event may be free or payment may be pending</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {payment.currency} {Number(payment.amount).toFixed(2)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadgeStyle(payment.status)}`}>
                        {payment.status === 'successful' && <FaCheck className="text-sm" />}
                        {payment.status === 'pending' && <FaClock className="text-sm" />}
                        {payment.status === 'failed' && <FaTimesCircle className="text-sm" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Ref:</span>
                        <span className="font-mono text-gray-900 break-all text-right">{payment.tx_ref}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{format(new Date(payment.created_at), 'MMM d, yyyy hh:mm a')}</span>
                      </div>

                      {payment.paid_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paid:</span>
                          <span className="text-gray-900">{format(new Date(payment.paid_at), 'MMM d, yyyy hh:mm a')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl shadow-lg p-6 border border-primary/20">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Payments:</span>
                <span className="font-bold text-lg text-gray-900">{payments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Successful Payments:</span>
                <span className="font-bold text-lg text-green-600">{payments.filter(p => p.status === 'successful').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Payments:</span>
                <span className="font-bold text-lg text-yellow-600">{payments.filter(p => p.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                <span className="text-gray-700 font-semibold">Total Amount:</span>
                <span className="font-bold text-lg text-gray-900">
                  {payments.length > 0 && payments[0]?.currency ? payments[0].currency + ' ' : ''}
                  {payments.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
