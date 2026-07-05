'use client';

import { useState, useTransition } from 'react';
import { Check, Clock, FileText, Bell, CheckCircle2 } from 'lucide-react';
import { markAllNotificationsRead, markNotificationRead } from '@/lib/notification-actions';
import type { Notification } from '@/lib/types';

/*
 * Fixes vs. the old page:
 * - No useEffect fetch on mount — data arrives as props from the server.
 * - Reads are persisted via session-scoped server actions instead of the
 *   client passing its own email to a generic UpdateUser call.
 * - The header badge refreshes through revalidatePath, replacing the
 *   refreshHeader() global-mutable hack.
 * - UI updates optimistically, so taps feel instant.
 */

const TYPE_STYLES = {
    report: { border: 'border-l-blue-400', bg: 'bg-blue-500/10', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-300', icon: FileText },
    reminder: { border: 'border-l-yellow-400', bg: 'bg-yellow-500/10', iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-300', icon: Clock },
    general: { border: 'border-l-green-400', bg: 'bg-green-500/10', iconBg: 'bg-green-500/20', iconColor: 'text-green-300', icon: Check }
} as const;

export default function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [, startTransition] = useTransition();

    const markAll = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        startTransition(() => { markAllNotificationsRead(); });
    };

    const markOne = (id: number) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
        startTransition(() => { markNotificationRead(id); });
    };

    return (
        <>
            <div className="flex justify-between items-center px-2">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Notifications</h2>
                <button
                    onClick={markAll}
                    className="flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20"
                >
                    <CheckCircle2 size={12} />
                    Mark all read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map(notification => {
                    const style = TYPE_STYLES[notification.type] ?? TYPE_STYLES.general;
                    const Icon = style.icon;

                    return (
                        <div
                            key={notification.id}
                            onClick={() => markOne(notification.id)}
                            className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 border-l-4 ${style.border} ${!notification.read ? style.bg : 'hover:bg-white/5'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2.5 rounded-xl ${style.iconBg} ${style.iconColor} shrink-0`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-bold text-base ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.read && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-2">{notification.message}</p>
                                    <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {notifications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Bell size={24} className="opacity-50" />
                        </div>
                        <p>No notifications yet.</p>
                    </div>
                )}
            </div>
        </>
    );
}
