'use client'

import React from 'react'

export default function ConfirmSubmitButton({
  children,
  confirmText,
  className,
  title,
}: {
  children: React.ReactNode
  confirmText: string
  className?: string
  title?: string
}) {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const ok = window.confirm(confirmText)
    if (!ok) return
    const form = (e.currentTarget.closest('form') as HTMLFormElement | null)
    if (form) form.requestSubmit()
  }

  return (
    <button type="button" onClick={onClick} className={className} title={title}>
      {children}
    </button>
  )
}
