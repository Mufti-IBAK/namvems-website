'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Event, EventRegistration } from '@/lib/types'
import { FaUsers, FaEnvelope, FaTrash, FaDownload, FaCalendarAlt, FaSearch, FaSpinner } from 'react-icons/fa'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import BulkEmailModal from '@/components/modals/BulkEmailModal'

export default function RegistrationsManagementPage() {
  useAuth() // Authentication check
  const supabase = createClient()
  
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([])
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Load events
  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Filter registrations based on search and status
  useEffect(() => {
    let filtered = registrations

    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.university?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(reg => reg.attendance_status === filterStatus)
    }

    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm, filterStatus])

  const fetchRegistrations = async (eventId: number) => {
    setLoadingRegistrations(true)
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
      setSelectedRegistrations([])
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast.error('Failed to load registrations')
    } finally {
      setLoadingRegistrations(false)
    }
  }

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event)
    fetchRegistrations(event.id)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRegistrations(filteredRegistrations.map(reg => reg.id))
    } else {
      setSelectedRegistrations([])
    }
  }

  const handleSelectRegistration = (registrationId: string, checked: boolean) => {
    if (checked) {
      setSelectedRegistrations(prev => [...prev, registrationId])
    } else {
      setSelectedRegistrations(prev => prev.filter(id => id !== registrationId))
    }
  }

  const handleDeleteRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', registrationId)

      if (error) throw error

      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId))
      toast.success('Registration deleted successfully')
    } catch (error) {
      console.error('Error deleting registration:', error)
      toast.error('Failed to delete registration')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedRegistrations.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedRegistrations.length} registration(s)?`)) return

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .in('id', selectedRegistrations)

      if (error) throw error

      setRegistrations(prev => prev.filter(reg => !selectedRegistrations.includes(reg.id)))
      setSelectedRegistrations([])
      toast.success(`${selectedRegistrations.length} registrations deleted successfully`)
    } catch (error) {
      console.error('Error deleting registrations:', error)
      toast.error('Failed to delete registrations')
    }
  }

  const handleSendBulkEmail = () => {
    if (selectedRegistrations.length === 0) {
      toast.error('Please select registrations to email')
      return
    }
    setShowEmailModal(true)
  }

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) return

    const csvContent = [
      ['Name', 'Email', 'Phone', 'University', 'Level of Study', 'Registration Date', 'Status'].join(','),
      ...filteredRegistrations.map(reg => [
        reg.full_name,
        reg.email,
        reg.phone_number || '',
        reg.university || '',
        reg.level_of_study || '',
        format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm'),
        reg.attendance_status
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedEvent?.title || 'event'}-registrations.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-primary text-2xl mr-3" />
        <span>Loading events...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-primary text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">Event Registrations Management</h1>
        </div>

        {/* Event Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Event to View Registrations
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => handleEventSelect(event)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedEvent?.id === event.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  {format(new Date(event.date), 'MMM d, yyyy')}
                </div>
                {event.location && (
                  <p className="text-sm text-gray-500 truncate">{event.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registration Management */}
        {selectedEvent && (
          <div className="border-t pt-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Registrations for &quot;{selectedEvent.title}&quot;
                </h2>
                <p className="text-gray-600">
                  {filteredRegistrations.length} of {registrations.length} registrations
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportToCSV}
                  disabled={filteredRegistrations.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaDownload /> Export CSV
                </button>
                <button
                  onClick={handleSendBulkEmail}
                  disabled={selectedRegistrations.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaEnvelope /> Email Selected ({selectedRegistrations.length})
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedRegistrations.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTrash /> Delete Selected ({selectedRegistrations.length})
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="lg:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="registered">Registered</option>
                  <option value="attended">Attended</option>
                  <option value="absent">Absent</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Registrations Table */}
            {loadingRegistrations ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-primary text-xl mr-3" />
                <span>Loading registrations...</span>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="text-gray-300 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">
                  {registrations.length === 0 
                    ? 'No registrations found for this event'
                    : 'No registrations match your search criteria'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">University</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Level</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Registration Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRegistrations.map(registration => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRegistrations.includes(registration.id)}
                            onChange={(e) => handleSelectRegistration(registration.id, e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{registration.full_name}</td>
                        <td className="px-4 py-3 text-gray-600">{registration.email}</td>
                        <td className="px-4 py-3 text-gray-600">{registration.university || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{registration.level_of_study || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {format(new Date(registration.created_at), 'MMM d, yyyy HH:mm')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            registration.attendance_status === 'attended' 
                              ? 'bg-green-100 text-green-800'
                              : registration.attendance_status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : registration.attendance_status === 'cancelled'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {registration.attendance_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteRegistration(registration.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete registration"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Bulk Email Modal */}
        {selectedEvent && (
          <BulkEmailModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            recipients={registrations
              .filter(reg => selectedRegistrations.includes(reg.id))
              .map(reg => ({
                email: reg.email,
                name: reg.full_name
              }))}
            eventTitle={selectedEvent.title}
            eventId={selectedEvent.id}
          />
        )}
      </div>
    </div>
  )
}
