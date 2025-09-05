// src/lib/types/gallery.ts
export interface GalleryImage {
  id: string
  event_id: number | null
  caption: string | null
  storage_path: string | null
  image_url: string | null
  created_at: string
  created_by: string | null
}

