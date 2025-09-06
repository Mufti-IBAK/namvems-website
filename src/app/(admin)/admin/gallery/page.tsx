// src/app/(admin)/admin/gallery/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { addGalleryImageAction, deleteGalleryImageAction, replaceGalleryImageAction, addGalleryImageRPC, replaceGalleryImageRPC } from './actions'
import AdminGalleryUploader from './AdminGalleryUploader'
import ReplaceGalleryItemForm from './ReplaceGalleryItemForm'

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

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = await getSupabase()

  // Server action wrappers to satisfy React's expected signatures
  const addAction = async (fd: FormData) => {
    "use server"
    await addGalleryImageAction(fd)
  }
  const addActionRpc = async (fd: FormData) => {
    "use server"
    return await addGalleryImageRPC(fd)
  }
  const deleteAction = async (fd: FormData) => {
    "use server"
    await deleteGalleryImageAction(fd)
  }
  const replaceAction = async (fd: FormData) => {
    "use server"
    await replaceGalleryImageAction(fd)
  }
  const replaceActionRpc = async (fd: FormData) => {
    "use server"
    return await replaceGalleryImageRPC(fd)
  }

  // Auth and role check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <div className="p-6 bg-white rounded-xl">Please sign in to manage the gallery.</div>
  }
  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
  if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'super_admin')) {
    return <div className="p-6 bg-white rounded-xl">Access denied. Admins only.</div>
  }

  // Fetch events for dropdown
  const { data: events } = await supabase.from('events').select('id, title').order('date', { ascending: false })

  // Fetch current gallery images
  const { data: images } = await supabase
    .from('gallery_images')
    .select('id, event_id, caption, image_url, created_at')
    .order('created_at', { ascending: false })

  const count = images?.length ?? 0

  const sp = await searchParams
  const message = sp?.message as string | undefined
  const error = sp?.error as string | undefined

  return (
    <div className="space-y-6">
      {message && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          {message === 'added' && 'Image uploaded successfully.'}
          {message === 'deleted' && 'Image deleted successfully.'}
          {message === 'updated' && 'Image updated successfully.'}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded">
          {error === 'full' && 'Gallery limit reached (10). Remove or replace an image, or upload to Telegram.'}
          {error === 'toolarge' && 'Each image must be less than 5MB. Please compress or upload to Telegram.'}
          {error === 'upload' && 'Upload failed. Please check the bucket exists and is public.'}
          {error === 'db' && 'Database error. Please ensure gallery_images table exists.'}
          {error === 'missing' && 'Provide an image file or a URL.'}
          {error === 'missingid' && 'Missing image id.'}
          {error === 'noperms' && 'Insufficient permissions.'}
          {error === 'notauth' && 'Not authenticated.'}
        </div>
      )}
      <div className="bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Gallery Management</h1>
        <p className="text-sm text-gray-600 mb-4">You can upload up to 10 images. Each image must be less than 5MB.</p>
        {count >= 10 && (
          <div className="p-3 rounded bg-yellow-100 text-yellow-800 text-sm mb-4">
            Gallery is full (10 images). Remove or replace an image, or upload to Telegram instead.
          </div>
        )}
        {/* Client-side uploader with cropping */}
        <AdminGalleryUploader
          events={(events || []) as { id: number; title: string }[]}
          count={count}
          addAction={addAction}
          addActionRpc={addActionRpc}
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Existing Images</h2>
        {!images || images.length === 0 ? (
          <p className="text-gray-600">No images yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img: { id: string; caption: string | null; image_url: string | null }) => (
              <div key={img.id} className="border rounded-xl overflow-hidden">
                <div className="aspect-[16/9] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url || ''} alt={img.caption || ''} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="font-medium text-gray-900 truncate">{img.caption || 'Untitled'}</p>
                  <div className="flex gap-2">
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={img.id} />
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </form>
                  </div>
                  <div className="mt-2">
                    <ReplaceGalleryItemForm
                      id={img.id}
                      defaultCaption={img.caption || ''}
                      replaceAction={replaceAction}
                      replaceActionRpc={replaceActionRpc}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

