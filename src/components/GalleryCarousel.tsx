// src/components/GalleryCarousel.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export interface CarouselItem {
  id: string
  url: string
  caption?: string | null
}

export default function GalleryCarousel({ items }: { items: CarouselItem[] }) {
  const [index, setIndex] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const play = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % Math.max(items.length, 1)), 10000) // 10s
  }

  useEffect(() => {
    play()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  useEffect(() => {
    // animate in on index change
    if (slideRef.current) {
      gsap.fromTo(
        slideRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
      )
    }
    if (captionRef.current) {
      gsap.fromTo(
        captionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      )
    }
  }, [index])

  if (!items || items.length === 0) return null

  const prev = () => { setIndex((i) => (i - 1 + items.length) % items.length); play() }
  const next = () => { setIndex((i) => (i + 1) % items.length); play() }

  const current = items.length > 0 ? items[index % items.length] : null

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 md:px-0 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      {/* image area with fixed aspect ratio */}
      <div ref={slideRef} className="relative aspect-[16/9] bg-neutral-900">
        {/* gradients */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/30 to-transparent" />
        {current && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.caption || ''}
              className="absolute inset-0 w-full h-full object-cover select-none"
              draggable={false}
            />
          </>
        )}
        {/* caption */}
        {current?.caption && (
          <div ref={captionRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[70%] text-center" aria-live="polite">
            <div className="backdrop-blur-sm bg-black/80 text-white px-6 py-4 md:px-8 md:py-5 rounded-2xl shadow-2xl">
              <p className="text-base md:text-xl lg:text-2xl font-semibold leading-snug tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                {current.caption}
              </p>
            </div>
          </div>
        )}
        {/* nav buttons */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 transition"
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 transition"
        >
          <FiChevronRight className="text-2xl" />
        </button>
        {/* dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => { setIndex(i); play() }}
              className={`h-2.5 rounded-full transition-all border border-white/30 backdrop-blur-sm ${i === index ? 'w-6 bg-white/90 shadow' : 'w-2.5 bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
      {/* outer padding/margins handled by container */}
    </div>
  )
}

