// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'; // Import the router

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter(); // Initialize the router
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const signOut = async () => {
    await supabase.auth.signOut();
    // CRITICAL CHANGE #1: We manually clear the state and redirect.
    // This ensures a clean state on the next login.
    setUser(null);
    setUserRole(null);
    router.push('/login'); // Redirect to login page after sign out
  };

  const value = {
    supabase,
    user,
    userRole,
    loading,
    signOut,
  };

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