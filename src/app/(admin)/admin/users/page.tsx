// src/app/(admin)/admin/users/page.tsx
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { updateUserRoleAction, deleteUserAction } from "./actions";
import { FaUsers, FaSearch, FaTrash, FaSort } from "react-icons/fa";
import { format } from "date-fns";

function UserRoleForm({ user }: { user: { id: string, email: string | undefined, role: string } }) {
    return (
        <form action={updateUserRoleAction} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <select
                name="role"
                defaultValue={user.role}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
                aria-label={`Update role for ${user.email}`}
            >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
            </select>
            <button type="submit" className="btn-primary py-2 px-4 text-sm whitespace-nowrap">
                Save Role
            </button>
        </form>
    );
}

export default async function UserManagementPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user?.id || '').single();
    if (roleData?.role !== 'super_admin') {
        redirect('/admin');
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return (
            <div className="bg-white rounded-xl card-shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin configuration required</h2>
                <p className="text-gray-700 mb-4">To use the User Management page, set the SUPABASE_SERVICE_ROLE_KEY environment variable in Vercel for this project (Production and Preview). After saving, redeploy.</p>
                <ol className="list-decimal ml-6 text-gray-700 space-y-1">
                    <li>Vercel → Project → Settings → Environment Variables</li>
                    <li>Add SUPABASE_SERVICE_ROLE_KEY with your Supabase Service Role key</li>
                    <li>Click Redeploy</li>
                </ol>
            </div>
        );
    }

    const supabaseAdmin = createSupabaseAdminClient();

    // Fetch users (consider pagination later)
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    const { data: roles, error: rolesError } = await supabase.from('user_roles').select('user_id, role');

    if (usersError || rolesError) {
        console.error("User Management Fetching Errors:", { usersError, rolesError });
        return <p className="text-red-500">Error fetching user data. Please check the server logs.</p>;
    }
    
    const roleMap = new Map(roles?.map(r => [r.user_id, r.role]));
    let usersWithRoles = users.map(u => ({
        ...u,
        role: roleMap.get(u.id) || 'member'
    }));

    // Apply search/filter/sort based on query params (Next.js 15: searchParams is a Promise)
    const sp = await searchParams;
    const q = (sp?.q as string | undefined)?.toLowerCase()?.trim() || '';
    const roleFilter = (sp?.role as string | undefined) || 'all';
    const sortKey = (sp?.sort as string | undefined) || 'created_at';
    const sortOrder = ((sp?.order as string | undefined) || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    if (q) {
        usersWithRoles = usersWithRoles.filter(u =>
            (u.email || '').toLowerCase().includes(q)
        );
    }
    if (roleFilter !== 'all') {
        usersWithRoles = usersWithRoles.filter(u => u.role === roleFilter);
    }
    usersWithRoles.sort((a, b) => {
        let comp = 0;
        if (sortKey === 'email') {
            comp = (a.email || '').localeCompare(b.email || '');
        } else {
            // default created_at
            const at = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
            comp = at - bt;
        }
        return sortOrder === 'asc' ? comp : -comp;
    });

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FaUsers /> User Management
                </h1>
                <p className="text-gray-600 mt-1">Assign roles and manage user access for all members.</p>
            </div>
            {/* Controls */}
            <div className="bg-white rounded-xl card-shadow p-4 mb-4">
                <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Search by email..."
                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select name="role" defaultValue={roleFilter} className="border rounded-lg px-3 py-2">
                        <option value="all">All roles</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                    <div className="flex gap-2">
                        <select name="sort" defaultValue={sortKey} className="border rounded-lg px-3 py-2 flex-1">
                            <option value="created_at">Sort by Joined</option>
                            <option value="email">Sort by Email</option>
                        </select>
                        <select name="order" defaultValue={sortOrder} className="border rounded-lg px-3 py-2">
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary px-4 py-2 flex items-center gap-2"><FaSort /> Apply</button>
                        <a href="/admin/users" className="px-4 py-2 border rounded-lg">Reset</a>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl card-shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">User Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Joined Date</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Manage Role</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {usersWithRoles.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-medium text-gray-900">{u.email}</p>
                                    <p className="text-xs text-gray-500">{u.role}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {u.created_at ? format(new Date(u.created_at), 'PPP') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <UserRoleForm user={{ id: u.id, email: u.email, role: u.role }} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <form action={deleteUserAction}>
                                        <input type="hidden" name="userId" value={u.id} />
                                        <button
                                            type="submit"
                                            className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                                            onClick={(e) => { if (!confirm(`Delete ${u.email}? This cannot be undone.`)) { e.preventDefault(); } }}
                                            title="Delete user"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {usersWithRoles.length === 0 && (
                    <p className="text-center text-gray-500 p-8">No users found.</p>
                )}
            </div>
        </div>
    );
}