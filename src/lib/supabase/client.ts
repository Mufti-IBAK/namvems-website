import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables are missing. Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    )
  }

  if (supabaseUrl.includes('your-supabase-url') || supabaseAnonKey.includes('your-supabase-anon-key')) {
    throw new Error(
      'Supabase environment variables contain placeholder values. Please replace them with your actual Supabase project credentials.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
