// src/app/(admin)/admin/gallery/actions.ts
'use server'

import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function createSupabaseSSR() {
  const getCookieStore = async () => await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await getCookieStore()
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await getCookieStore()
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await getCookieStore()
            cookieStore.set({ name, value: '', ...options })
          } catch {}
        },
      },
    }
  )
}

export async function addGalleryImageAction(formData: FormData) {
  const supabase = createSupabaseSSR()

  // Verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/admin/gallery?error=notauth')
  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
  if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'super_admin')) {
    return redirect('/admin/gallery?error=noperms')
  }

  // Limit: max 10 images
  const { count } = await supabase.from('gallery_images').select('*', { count: 'exact', head: true })
  if ((count ?? 0) >= 10) {
    return redirect('/admin/gallery?error=full')
  }

  const eventIdRaw = formData.get('event_id') as string | null
  const caption = (formData.get('caption') as string | null) || null
  const urlInput = (formData.get('image_url') as string | null) || null
  const file = formData.get('image') as File | null

  if (!file && !urlInput) {
    return redirect('/admin/gallery?error=missing')
  }

  let storage_path: string | null = null
  let image_url: string | null = null

  // If file upload provided, validate then upload to storage
  if (file) {
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
      return redirect('/admin/gallery?error=toolarge')
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const filename = `${user.id}/${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from('gallery').upload(filename, file, { contentType: file.type || 'image/jpeg', upsert: false })
    if (uploadErr) return redirect('/admin/gallery?error=upload')

    storage_path = filename
    const { data } = supabase.storage.from('gallery').getPublicUrl(filename)
    image_url = data.publicUrl
  }

  if (!image_url && urlInput) {
    image_url = urlInput
  }

  const event_id = eventIdRaw ? Number(eventIdRaw) : null

  const { error: insertErr } = await supabase.from('gallery_images').insert({
    event_id,
    caption,
    storage_path,
    image_url,
    created_by: user.id,
  })
  if (insertErr) return redirect('/admin/gallery?error=db')

  revalidatePath('/admin/gallery')
  revalidatePath('/')
  revalidatePath('/gallery')
  redirect('/admin/gallery?message=added')
}

export async function deleteGalleryImageAction(formData: FormData) {
  const supabase = createSupabaseSSR()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/admin/gallery?error=notauth')
  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
  if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'super_admin')) {
    return redirect('/admin/gallery?error=noperms')
  }
  const id = formData.get('id') as string | null
  if (!id) return redirect('/admin/gallery?error=missingid')

  // Fetch storage path to delete file if any
  const { data: img } = await supabase.from('gallery_images').select('storage_path').eq('id', id).maybeSingle()
  if (img?.storage_path) {
    await supabase.storage.from('gallery').remove([img.storage_path])
  }
  await supabase.from('gallery_images').delete().eq('id', id)

  revalidatePath('/admin/gallery')
  revalidatePath('/')
  revalidatePath('/gallery')
  redirect('/admin/gallery?message=deleted')
}

export async function replaceGalleryImageAction(formData: FormData) {
  const supabase = createSupabaseSSR()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/admin/gallery?error=notauth')
  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
  if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'super_admin')) {
    return redirect('/admin/gallery?error=noperms')
  }

  const id = formData.get('id') as string | null
  const caption = (formData.get('caption') as string | null) || null
  const urlInput = (formData.get('image_url') as string | null) || null
  const file = formData.get('image') as File | null

  if (!id) return redirect('/admin/gallery?error=missingid')
  if (!file && !urlInput && caption === null) return redirect('/admin/gallery?error=missing')

  let storage_path: string | null = null
  let image_url: string | null = null

  if (file) {
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) return redirect('/admin/gallery?error=toolarge')
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const filename = `${user.id}/${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from('gallery').upload(filename, file, { contentType: file.type || 'image/jpeg', upsert: false })
    if (uploadErr) return { ok: false, error: `Upload failed: ${uploadErr.message}` }
    storage_path = filename
    const { data } = supabase.storage.from('gallery').getPublicUrl(filename)
    image_url = data.publicUrl
  }

  if (!image_url && urlInput) image_url = urlInput

  const updates: Record<string, string | null> = {}
  if (caption !== null) updates.caption = caption
  if (storage_path !== null) updates.storage_path = storage_path
  if (image_url !== null) updates.image_url = image_url

  const { error: updateErr } = await supabase.from('gallery_images').update(updates).eq('id', id)
  if (updateErr) return redirect('/admin/gallery?error=db')

  revalidatePath('/admin/gallery')
  revalidatePath('/')
  revalidatePath('/gallery')
  redirect('/admin/gallery?message=updated')
}

