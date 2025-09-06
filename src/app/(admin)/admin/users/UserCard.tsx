// src/app/(admin)/admin/users/UserCard.tsx
'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import ConfirmSubmitButton from './ConfirmSubmitButton'
import { FaTrash, FaSave } from 'react-icons/fa'
import { updateUserRoleRPC } from './actions'

export default function UserCard({
  user,
  deleteAction,
}: {
  user: { id: string; email: string; role: string; created_at?: string }
  deleteAction: (formData: FormData) => Promise<void>
}) {
  const [role, setRole] = useState<string>(user.role)
  const [saving, setSaving] = useState(false)

  const roleClass = (r: string) => (
    r === 'super_admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
    r === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-200' :
    'bg-blue-100 text-blue-800 border-blue-200'
  )

  const onSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('userId', user.id)
      fd.append('role', role)
      const res = await updateUserRoleRPC(fd)
      if (res?.ok) {
        alert('Role updated successfully.')
      } else {
        alert('Failed to update role. Please try again.')
      }
    } catch {
      alert('Failed to update role. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl card-shadow p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{user.email}</p>
          <p className="text-xs text-gray-500">{user.created_at ? format(new Date(user.created_at), 'PP') : 'Joined: N/A'}</p>
        </div>
        <span className={`text-[11px] px-2 py-1 rounded-full border whitespace-nowrap ${roleClass(role)}`}>
          {role.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
            aria-label={`Update role for ${user.email}`}
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn-primary px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FaSave className="hidden sm:inline" />
            <span className="hidden sm:inline">Save Role</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
        <form action={deleteAction}>
          <input type="hidden" name="userId" value={user.id} />
          <ConfirmSubmitButton
            confirmText={`Delete ${user.email}? This cannot be undone.`}
            className="text-red-600 hover:text-red-800 inline-flex items-center justify-center rounded-md px-3 py-2 border border-red-200 bg-red-50/40"
            title="Delete user"
          >
            <FaTrash aria-hidden="true" />
            <span className="sr-only">Delete</span>
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  )
}

