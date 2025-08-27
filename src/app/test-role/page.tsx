// src/app/test-role/page.tsx
import { createClient } from "@/lib/supabase/server";

// This is a simple Server Component to debug our role fetching.
export default async function TestRolePage() {
    const supabase = createClient();

    // Get the current user session on the server
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        return <div>Error getting user: {userError.message}</div>;
    }
    if (!user) {
        return <div>No user is currently logged in. Please log in and return to this page.</div>;
    }

    // Now, try to fetch the role for this specific user
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError && roleError.code !== 'PGRST116') {
      // PGRST116 means no rows were found, which is not an error for us.
      // Any other error is a real problem.
      return <div>Error fetching role: {roleError.message}</div>;
    }

    const userRole = roleData?.role || 'member (default)';

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', fontSize: '16px' }}>
            <h1>Role Debug Information</h1>
            <hr style={{ margin: '20px 0' }} />
            <p><strong>Logged-in User Email:</strong> {user.email}</p>
            <p><strong>Logged-in User ID:</strong> {user.id}</p>
            <hr style={{ margin: '20px 0' }} />
            <p style={{ fontSize: '24px' }}>
                <strong>Database Role Fetched:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{userRole}</span>
            </p>
        </div>
    );
}