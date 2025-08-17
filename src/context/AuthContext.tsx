'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, SupabaseClient } from '@supabase/supabase-js'

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
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndRole = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // FIX: We don't need the arguments here, so we remove them
      // to clear the "unused-vars" error. Our function handles everything.
      () => {
        getSessionAndRole();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  const value = {
    supabase,
    user,
    userRole,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}