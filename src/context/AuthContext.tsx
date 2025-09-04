// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  error: string | null; // FIX: Add error to interface
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []); // FIX: Memoize Supabase client
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // FIX: Add error state

  useEffect(() => {
    const getSessionAndRole = async () => {
      // setLoading(true) should be here to show loading on re-fetch
      setLoading(true); 
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', currentUser.id)
            .single();
          
          if (roleError && roleError.code !== 'PGRST116') throw roleError;
          setUserRole(roleData?.role || 'member');
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error in getSessionAndRole:", error);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        // This listener will now trigger our function on login/logout
        getSessionAndRole();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]); // Removed dependency array items to prevent re-renders, supabase client is stable

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // Clear state and redirect
      setUser(null);
      setUserRole(null);
      setError(null);
      router.push('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, router]); // FIX: Memoize signOut function

  const value = useMemo(() => ({
    supabase,
    user,
    userRole,
    loading,
    error,
    signOut,
  }), [supabase, user, userRole, loading, error, signOut]); // FIX: Memoize context value

  // CRITICAL CHANGE #2: We remove the !loading check from the return.
  // This allows the children (the page) to render even while the role is being
  // re-fetched. Our layouts already have their own loading guards, so this is safe
  // and prevents the entire app from going blank during auth state changes.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}