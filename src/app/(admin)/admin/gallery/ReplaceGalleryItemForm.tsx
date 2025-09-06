// src/app/(admin)/admin/gallery/ReplaceGalleryItemForm.tsx
'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { getCroppedImageBlob } from '@/lib/utils/cropImage'
import { useRouter } from 'next/navigation'

export default function ReplaceGalleryItemForm({
  id,
  defaultCaption,
  replaceAction,
  replaceActionRpc,
}: {
  id: string
  defaultCaption: string
  replaceAction: (formData: FormData) => Promise<void>
  replaceActionRpc: (formData: FormData) => Promise<{ ok: boolean; error?: string; message?: string }>
}) {
  const router = useRouter()
  const [caption, setCaption] = useState<string>(defaultCaption)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const disabled = useMemo(() => submitting, [submitting])

  const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const onCropComplete = useCallback((_area: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped)
  }, [])

  const handleCropAndUpload = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return
    try {
      setSubmitting(true)
      const blob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels as { x: number; y: number; width: number; height: number },
        1600,
        900,
        'image/jpeg',
        0.9
      )
      const file = new File([blob], 'gallery-image.jpg', { type: 'image/jpeg' })
      const fd = new FormData()
      fd.append('id', id)
      fd.append('image', file)
      if (caption) fd.append('caption', caption)
      const res = await replaceActionRpc(fd)
      if (res?.ok) {
        setShowCropper(false)
        setImageSrc(null)
        setZoom(1)
        setCrop({ x: 0, y: 0 })
        router.push('/admin/gallery?message=updated')
        return
      }
      await replaceAction(fd)
    } finally {
      setSubmitting(false)
    }
  }, [imageSrc, croppedAreaPixels, id, caption, replaceActionRpc, replaceAction, router])

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="New caption (optional)"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="w-full"
          onChange={onSelectFile}
          disabled={disabled}
        />
        <span className="text-xs text-gray-500 whitespace-nowrap">Crop to 16:9</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="url"
          name="image_url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Or new image URL"
          className="w-full border rounded px-3 py-2"
        />
        <form action={replaceAction}>
          <input type="hidden" name="id" value={id} />
          {caption && <input type="hidden" name="caption" value={caption} />}
          {imageUrl && <input type="hidden" name="image_url" value={imageUrl} />}
          <button type="submit" className="btn-primary px-4 py-2">Apply</button>
        </form>
      </div>

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
                  {submitting ? 'Uploading…' : 'Crop & Replace'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

