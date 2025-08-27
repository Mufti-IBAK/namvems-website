// src/app/(admin)/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin'; // <-- IMPORT THE NEW ADMIN CLIENT
import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaBook, FaPlus, FaUserEdit } from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';
import { ReactNode } from 'react';

// --- TYPE DEFINITIONS ---
type RecentEvent = {
  id: string;
  title: string;
  created_at: string;
};

type RecentUser = {
  id: string;
  email: string | undefined;
  created_at: string | undefined;
  role: string;
};

// --- DATA FETCHING (Now with the privileged admin client) ---
async function getDashboardData() {
  const supabase = createClient(); // Standard client for user-specific data
  const supabaseAdmin = createSupabaseAdminClient(); // Privileged client for admin actions

  const [
    { count: eventCount, error: eventsError },
    { count: resourceCount, error: resourcesError },
    { data: { users }, error: usersError }, // <-- This now uses the admin client
    { data: recentEvents, error: recentEventsError },
    { data: roles, error: rolesError }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabaseAdmin.auth.admin.listUsers(), // <-- USING THE ADMIN CLIENT
    supabase.from('events').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('user_roles').select('user_id, role')
  ]);

  // Improved error logging for better debugging in the server console
  if (eventsError || resourcesError || usersError || recentEventsError || rolesError) {
    console.error("[ Server ] Dashboard Data Fetching Errors:", { 
        eventsError: eventsError?.message, 
        resourcesError: resourcesError?.message, 
        usersError: usersError?.message, 
        recentEventsError: recentEventsError?.message, 
        rolesError: rolesError?.message 
    });
  }

  const roleMap = new Map(roles?.map(r => [r.user_id, r.role]));

  const recentUsers: RecentUser[] = users
    ? users.slice(0, 5).map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        role: roleMap.get(user.id) || 'member',
      }))
    : [];

  return {
    eventCount: eventCount ?? 0,
    resourceCount: resourceCount ?? 0,
    userCount: users?.length ?? 0,
    recentEvents: (recentEvents as RecentEvent[]) ?? [],
    recentUsers
  };
}

// --- UI COMPONENTS ---
function StatCard({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) {
  return (
    <div className="bg-white p-6 rounded-xl card-shadow flex items-center gap-4">
      <div className="bg-accent/10 p-3 rounded-full">
        <Icon className="text-accent h-6 w-6" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ href, children, variant = 'primary' }: { href: string, children: ReactNode, variant?: 'primary' | 'secondary' }) {
    const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
    return (
        <Link href={href} className={`${className} flex items-center justify-center gap-2 text-center w-full`}>
            {children}
        </Link>
    );
}

function UserManagementCard({ users }: { users: RecentUser[] }) {
    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-xl card-shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUsers /> Recent User Signups
            </h2>
            <div className="space-y-2">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                            <div>
                                <p className="font-semibold text-gray-800">{user.email}</p>

                                <p className="text-sm text-gray-500">
                                    Joined {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'N/A'}
                                </p>
                            </div>
                            <span className="text-xs font-semibold uppercase px-2 py-1 bg-primary/20 text-primary-dark rounded-full">
                                {user.role}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No recent user activity.</p>
                )}
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default async function AdminDashboardPage() {
    const { userCount, eventCount, resourceCount, recentEvents, recentUsers } = await getDashboardData();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id || '')
      .single();
      
    const userRole = roleData?.role || 'member';

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome back, {user?.user_metadata?.full_name || user?.email}.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRole === 'super_admin' && (
                    <StatCard title="Total Users" value={userCount} icon={FaUsers} />
                )}
                <StatCard title="Total Events" value={eventCount} icon={FaCalendarAlt} />
                <StatCard title="Total Resources" value={resourceCount} icon={FaBook} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl card-shadow">
                    <h2 className="text-xl font-bold mb-4">Recent Events</h2>
                    <div className="space-y-4">
                        {recentEvents.length > 0 ? (
                            recentEvents.map((event) => (
                                <div key={event.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold text-gray-800">{event.title}</p>
                                        <p className="text-sm text-gray-500">
                                            Created on {format(new Date(event.created_at), 'PPP')}
                                        </p>
                                    </div>
                                    <Link href={`/admin/events/edit/${event.id}`} className="btn-ghost py-2 px-4 text-sm">
                                        View
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No recent events to display.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl card-shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <QuickActionButton href="/admin/events/create">
                           <FaPlus /> Create Event
                        </QuickActionButton>
                        <QuickActionButton href="/admin/resources/create">
                           <FaPlus /> Upload Resource
                        </QuickActionButton>
                        {userRole === 'super_admin' && (
                            <QuickActionButton href="/admin/users" variant="secondary">
                               <FaUserEdit /> Manage Users
                            </QuickActionButton>
                        )}
                    </div>
                </div>
            </div>
            
            {userRole === 'super_admin' && <UserManagementCard users={recentUsers} />}
        </div>
    );
}