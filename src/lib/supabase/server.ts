import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  type CookieSetOptions = CookieOptions & { name: string; value: string }
  type CookieStoreLike = { get: (name: string) => { value: string } | undefined; set: (options: CookieSetOptions) => void }
  const getCookieStore = () => cookies() as unknown as CookieStoreLike

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieStore = getCookieStore()
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = getCookieStore()
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = getCookieStore()
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}