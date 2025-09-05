// src/components/GalleryCarousel.tsx
'use client'

import React, { useEffect, useState } from 'react'

export interface CarouselItem {
  id: string
  url: string
  caption?: string | null
}

export default function GalleryCarousel({ items }: { items: CarouselItem[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % Math.max(items.length, 1)), 4000)
    return () => clearInterval(t)
  }, [items.length])

  if (!items || items.length === 0) return null

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)
  const next = () => setIndex((i) => (i + 1) % items.length)

  const current = items.length > 0 ? items[index % items.length] : null

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {current && <img src={current.url} alt={current.caption || ''} className="w-full h-72 md:h-96 object-cover" />}
      {current?.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-sm">
          {current.caption}
        </div>
      )}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full px-3 py-1">‹</button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full px-3 py-1">›</button>
      <div className="absolute bottom-2 right-2 flex gap-1">
        {items.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}></span>
        ))}
      </div>
    </div>
  )
}

