'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, User as UserIcon } from 'lucide-react';

/** Minimal, safe shape — this is ALL the user data the browser receives. */
export interface HeaderUser {
    name: string;
    imageBase64: string | null;
    unreadCount: number;
}

/** Client wrapper: only responsibility is the scroll-glass effect. */
export default function HeaderShell({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${isScrolled ? 'glass-panel border-x-0 border-t-0' : ''}`}>
            {children}
        </header>
    );
}

export function HeaderUserMenu({ user }: { user: HeaderUser | null }) {
    return (
        <div className="flex items-center gap-3">
            <Link
                href="/status-tracker"
                aria-label="Notifications"
                className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
            >
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                {user && user.unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                )}
            </Link>

            <Link
                href="/profile"
                className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
            >
                {user?.imageBase64 ? (
                    <Image
                        src={user.imageBase64}
                        alt="Profile picture"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full shadow-inner object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold shadow-inner text-white">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                    </div>
                )}
                <span className="text-sm font-medium text-gray-200 hidden sm:block">
                    Hi, {user?.name ? user.name.split(' ')[0] : 'Guest'}
                </span>
            </Link>
        </div>
    );
}
