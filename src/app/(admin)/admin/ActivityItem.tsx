'use client'

import { FaCalendarPlus, FaFileUpload, FaUserPlus } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export type Activity = {
    id: string | number;
    type: 'event' | 'resource' | 'user';
    title: string;
    timestamp: string;
    authorEmail?: string;
};

const activityConfig = {
    event: {
        icon: FaCalendarPlus,
        color: 'text-blue-500',
        actionText: 'New event created:',
        getLink: (id: string | number) => `/admin/events/edit/${id}`
    },
    resource: {
        icon: FaFileUpload,
        color: 'text-green-500',
        actionText: 'New resource uploaded:',
        getLink: (id: string | number) => `/admin/resources/edit/${id}`
    },
    user: {
        icon: FaUserPlus,
        color: 'text-purple-500',
        actionText: 'New user joined:',
        getLink: () => `/admin/users`
    },
};

export default function ActivityItem({ activity }: { activity: Activity }) {
    const config = activityConfig[activity.type];
    const Icon = config.icon;

    return (
        <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
            <div className={`mt-1 ${config.color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500">{config.actionText}</p>
                <Link href={config.getLink(activity.id)} className="font-semibold text-gray-800 hover:underline">
                    {activity.title}
                </Link>
                <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
            </div>
        </div>
    );
}