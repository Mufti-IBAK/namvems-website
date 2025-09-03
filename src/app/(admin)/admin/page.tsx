// src/app/(admin)/admin/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext';
import { FaCalendarAlt, FaBook, FaPlus, FaUserEdit, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState, ReactNode, ElementType } from 'react';
import { createClient } from '@/lib/supabase/client';
import ActivityItem, { type Activity } from './ActivityItem';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

function StatCard({ title, value, icon: Icon }: { title: string, value: number, icon: ElementType }) {
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

export default function AdminDashboardPage() {
    const { user, userRole } = useAuth();
    const [stats, setStats] = useState({ eventCount: 0, resourceCount: 0, userCount: 0 });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useGSAP(() => {
        if (!loading) {
            gsap.from('.stat-card', {
                duration: 0.5,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: 'power3.out'
            });
            gsap.from('.content-panel', {
                duration: 0.7,
                y: 60,
                opacity: 0,
                stagger: 0.2,
                delay: 0.2,
                ease: 'power3.out'
            });
        }
    }, { dependencies: [loading] });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const supabase = createClient();
            
            const [
                { count: eventCount },
                { count: resourceCount },
                { data: recentEvents },
                { data: recentResources }
            ] = await Promise.all([
                supabase.from('events').select('*', { count: 'exact', head: true }),
                supabase.from('resources').select('*', { count: 'exact', head: true }),
                supabase.from('events').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('resources').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
            ]);

            setStats({
                eventCount: eventCount ?? 0,
                resourceCount: resourceCount ?? 0,
                userCount: 0,
            });

            const combinedActivities: Activity[] = [
                ...(recentEvents || []).map(e => ({ id: e.id, type: 'event' as const, title: e.title, timestamp: e.created_at })),
                ...(recentResources || []).map(r => ({ id: r.id, type: 'resource' as const, title: r.title, timestamp: r.created_at })),
            ];

            combinedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            setActivities(combinedActivities.slice(0, 7));
            setLoading(false);
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center p-8"><FaSpinner className="animate-spin text-primary text-3xl" /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome back, {user?.user_metadata?.full_name || user?.email}.
                </p>
            </div>
            
            {/* --- FIX: The main content is now wrapped in a responsive grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* --- Column 1: Stats and Quick Actions --- */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        <div className="stat-card"><StatCard title="Total Events" value={stats.eventCount} icon={FaCalendarAlt} /></div>
                        <div className="stat-card"><StatCard title="Total Resources" value={stats.resourceCount} icon={FaBook} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl card-shadow content-panel">
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

                {/* --- Column 2: Recent Activity --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl card-shadow content-panel">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-2">
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <ActivityItem key={`${activity.type}-${activity.id}`} activity={activity} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No recent activity to display.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}