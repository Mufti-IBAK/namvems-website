// src/app/(admin)/admin/users/page.tsx
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin"; // Privileged client
import { redirect } from "next/navigation";
import { updateUserRole } from "./actions";
import { FaUsers } from "react-icons/fa";
import { format } from "date-fns";

// --- Reusable Form Component ---
// This component handles the form for updating a single user's role.
function UserRoleForm({ user }: { user: { id: string, email: string | undefined, role: string } }) {
    return (
        <form action={updateUserRole} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <select
                name="role"
                defaultValue={user.role}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
            >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
            </select>
            <button type="submit" className="btn-primary py-2 px-4 text-sm">
                Save
            </button>
        </form>
    );
}


// --- Main Page Component ---
export default async function UserManagementPage() {
    const supabase = createClient();
    const supabaseAdmin = createSupabaseAdminClient(); // Initialize privileged client

    // --- Security Check: Protect the entire page ---
    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user?.id || '').single();
    if (roleData?.role !== 'super_admin') {
        // If the user is not a super_admin, redirect them away immediately.
        redirect('/admin');
    }

    // --- Data Fetching ---
    // Use the privileged client to get the list of all users.
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    // Use the standard client to get the list of roles.
    const { data: roles, error: rolesError } = await supabase.from('user_roles').select('user_id, role');

    if (usersError || rolesError) {
        console.error("User Management Fetching Errors:", { usersError, rolesError });
        return <p className="text-red-500">Error fetching user data. Please check the server logs.</p>;
    }
    
    // --- Data Processing: Combine users and roles ---
    const roleMap = new Map(roles?.map(r => [r.user_id, r.role]));
    const usersWithRoles = users.map(u => ({
        ...u,
        role: roleMap.get(u.id) || 'member' // Default to 'member' if no role is found
    }));

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaUsers /> User Management
                </h1>
                <p className="text-gray-600 mt-1">Assign roles and manage user access.</p>
            </div>

            <div className="bg-white rounded-xl card-shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">User Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Joined Date</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Manage Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {usersWithRoles.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-medium text-gray-900">{u.email}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {u.created_at ? format(new Date(u.created_at), 'PPP') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <UserRoleForm user={{
                                        id: u.id,
                                        email: u.email,
                                        role: u.role
                                    }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}