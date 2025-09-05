// src/app/(public)/gallery/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )
}

export default async function GalleryPage() {
  const supabase = await getSupabase()
  const { data: images } = await supabase
    .from('gallery_images')
    .select('id, caption, image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      {!images || images.length === 0 ? (
        <p className="text-gray-600">No images yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img: { id: string; caption: string | null; image_url: string | null }) => (
            <div key={img.id} className="rounded-xl overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url || ''} alt={img.caption || ''} className="w-full h-64 object-cover" />
              <div className="p-3 text-sm text-gray-700">{img.caption}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

