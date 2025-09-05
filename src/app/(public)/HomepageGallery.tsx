// src/app/(public)/HomepageGallery.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GalleryCarousel, { CarouselItem } from '@/components/GalleryCarousel'

export default function HomepageGallery() {
  const supabase = createClient()
  const [items, setItems] = useState<CarouselItem[]>([])

  useEffect(() => {
    let isMounted = true
    async function run() {
      const { data } = await supabase
        .from('gallery_images')
        .select('id, caption, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
      if (isMounted) {
        const mapped = (data || []).filter((d) => d.image_url).map((d) => ({ id: d.id, url: d.image_url as string, caption: d.caption }))
        setItems(mapped)
      }
    }
    run()
    return () => { isMounted = false }
  }, [supabase])

  if (items.length === 0) return null
  return (
    <div className="max-w-5xl mx-auto">
      <GalleryCarousel items={items} />
    </div>
  )
}

