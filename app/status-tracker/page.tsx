'use client';
import { useEffect, useState } from 'react';
import { 
    Check, 
    Clock, 
    FileText, 
    Bell, 
    CheckCircle2
} from 'lucide-react';
import { GetNotifications, UpdateUser } from '@/utils/database';
import { Notification } from '@/utils/database';
import { refreshHeader } from '../components/header/header';
import { GetCurrentUserEmail } from '@/utils/auth';

export default function StatusTrackerPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const markAllRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);

        refreshHeader(updated.filter(n => !n.read).length);

        (async () => {
            const email = await GetCurrentUserEmail();
            if (!email) return;
            await UpdateUser(email, 'notifications', updated);
        })();
    };

    const markNotificationRead = (id: number) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);

        refreshHeader(updated.filter(n => !n.read).length);

        (async () => {
            const email = await GetCurrentUserEmail();
            if (!email) return;
            await UpdateUser(email, 'notifications', updated);
        })();
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'report':
                return {
                    border: 'border-l-blue-400',
                    bg: 'bg-blue-500/10',
                    iconBg: 'bg-blue-500/20',
                    iconColor: 'text-blue-300',
                    icon: FileText
                };
            case 'reminder':
                return {
                    border: 'border-l-yellow-400',
                    bg: 'bg-yellow-500/10',
                    iconBg: 'bg-yellow-500/20',
                    iconColor: 'text-yellow-300',
                    icon: Clock
                };
            default:
                return {
                    border: 'border-l-green-400',
                    bg: 'bg-green-500/10',
                    iconBg: 'bg-green-500/20',
                    iconColor: 'text-green-300',
                    icon: Check
                };
        }
    };

    useEffect(() => {
        GetNotifications().then(data => {
            if (!data) return;

            setNotifications(data);
        });
    }, []);

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
                
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                h1, h2, h3, .font-display { font-family: 'Montserrat', sans-serif; }

                /* Ambient Background */
                .ambient-bg {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
                    background: radial-gradient(circle at 15% 50%, rgba(22, 163, 74, 0.15), transparent 25%),
                                radial-gradient(circle at 85% 30%, rgba(163, 230, 53, 0.1), transparent 25%);
                    background-color: #022c22; pointer-events: none;
                }

                .gradient-blob {
                    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; z-index: -1;
                }
                .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #166534; animation: blob 20s infinite alternate; }
                .blob-2 { bottom: -10%; right: -10%; width: 600px; height: 600px; background: #14532d; animation: blob 25s infinite alternate-reverse; }

                /* Glass Utilities */
                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Notifications</h2>
                        <button 
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20"
                        >
                            <CheckCircle2 size={12} />
                            Mark all read
                        </button>
                    </div>
                    <div className="space-y-4">
                        {notifications.map((notification) => {
                            const style = getTypeStyles(notification.type);
                            const Icon = style.icon;

                            return (
                                <div
                                    key={notification.id}
                                    onClick={() => markNotificationRead(notification.id)}
                                    className={`
                                        glass-card rounded-2xl p-5 border-l-4 transition-all duration-300 cursor-pointer hover:translate-x-1
                                        ${style.border}
                                        ${!notification.read ? style.bg : 'hover:bg-white/5'}
                                    `}
                                >
                                    <div className="flex justify-between items-start gap-4">
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
                                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed mb-2">
                                                    {notification.message}
                                                </p>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {notification.time}
                                                </span>
                                            </div>
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
                </main>
            </div> 
        </div>
    );
}