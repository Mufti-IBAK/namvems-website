// src/app/(admin)/admin/gallery/AdminGalleryUploader.tsx
'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { getCroppedImageBlob } from '@/lib/utils/cropImage'
import { useRouter } from 'next/navigation'

type EventOption = { id: number; title: string }

export default function AdminGalleryUploader({
  events,
  count,
  addAction,
  addActionRpc,
}: {
  events: EventOption[]
  count: number
  addAction: (formData: FormData) => Promise<void>
  addActionRpc: (formData: FormData) => Promise<{ ok: boolean; error?: string; message?: string }>
}) {
  const [eventId, setEventId] = useState<string>('')
  const [caption, setCaption] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')

  const router = useRouter()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const disabled = useMemo(() => count >= 10 || submitting, [count, submitting])

  const onSelectFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
    // reset file input so selecting the same file again works
    e.target.value = ''
  }, [])

  const onCropComplete = useCallback((_area: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped)
  }, [])

  const handleCropAndUpload = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return
    try {
      setSubmitting(true)
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels as { x: number; y: number; width: number; height: number }, 1600, 900, 'image/jpeg', 0.9)
      const file = new File([blob], 'gallery-image.jpg', { type: 'image/jpeg' })
      const fd = new FormData()
      if (eventId) fd.append('event_id', eventId)
      if (caption) fd.append('caption', caption)
      fd.append('image', file)
      const res = await addActionRpc(fd)
      if (res?.ok) {
        setShowCropper(false)
        setImageSrc(null)
        setZoom(1)
        setCrop({ x: 0, y: 0 })
        setCaption('')
        setEventId('')
        setImageUrl('')
        router.push('/admin/gallery?message=added')
        return
      }
      // fallback: if RPC failed, try legacy redirect action
      await addAction(fd)
    } finally {
      setSubmitting(false)
    }
  }, [imageSrc, croppedAreaPixels, addActionRpc, addAction, eventId, caption, router])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Event</label>
          <select
            name="event_id"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Unspecified</option>
            {events.map((ev) => (
              <option key={ev.id} value={String(ev.id)}>{ev.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Caption</label>
          <input
            name="caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Image caption"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image file (≤ 5MB)</label>
          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={onSelectFile}
            aria-label="Select an image to crop before uploading"
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">You will be able to crop to 16:9 before upload.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Or image URL</label>
          <input
            name="image_url"
            type="url"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">URL bypasses cropping. Use only if already 16:9.</p>
        </div>
      </div>
      <div>
        {/* Fallback simple submit for URL-only uploads */}
        <form
          action={addAction}
          className="inline-flex items-center gap-2"
        >
          {eventId && <input type="hidden" name="event_id" value={eventId} />}
          {caption && <input type="hidden" name="caption" value={caption} />}
          {imageUrl && <input type="hidden" name="image_url" value={imageUrl} />}
          <button
            type="submit"
            className="btn-primary px-4 py-2 disabled:opacity-60"
            disabled={count >= 10 || (!imageUrl && !imageSrc)}
            title={count >= 10 ? 'Gallery is full' : undefined}
          >
            {submitting ? 'Uploading…' : 'Add Image'}
          </button>
        </form>
      </div>

      {/* Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b font-semibold">Crop image (16:9)</div>
            <div className="relative w-full aspect-video bg-neutral-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full">
                <label className="text-sm text-gray-700">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setShowCropper(false); setImageSrc(null); setZoom(1); setCrop({ x: 0, y: 0 }) }}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropAndUpload}
                  className="btn-primary px-4 py-2"
                  disabled={submitting}
                >
                  {submitting ? 'Uploading…' : 'Crop & Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

