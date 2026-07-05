'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Map as MapIcon, Trees, FileWarning, Home, LucideIcon } from 'lucide-react';

/*
 * Fixes vs. the old navbar:
 * - Active state is DERIVED from usePathname() instead of duplicated in
 *   useState — it was wrong after refresh, back button, or deep links.
 * - Uses <Link> instead of router.push so routes are prefetched on
 *   viewport entry (much faster perceived navigation).
 * - No pathname checks to hide itself: it's simply only rendered by
 *   the (app) route-group layout.
 */

const NAV_ITEMS: { href: string; icon: LucideIcon; label: string }[] = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/events', icon: CalendarDays, label: 'Events' }
];

const NAV_ITEMS_RIGHT: { href: string; icon: LucideIcon; label: string }[] = [
    { href: '/my-trees', icon: Trees, label: 'Trees' },
    { href: '/report', icon: FileWarning, label: 'Report' }
];

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <nav className="fixed bottom-0 w-full z-50 glass-nav pb-safe">
            <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-2">
                {NAV_ITEMS.map(item => (
                    <NavButton key={item.href} {...item} active={isActive(item.href)} />
                ))}

                <Link
                    href="/map"
                    aria-label="Map"
                    className={`
                        relative -top-6 w-14 h-14 rounded-full flex items-center justify-center
                        shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform duration-300 hover:scale-110
                        ${isActive('/map')
                            ? 'bg-linear-to-br from-white to-gray-200 text-green-700'
                            : 'bg-linear-to-br from-green-400 to-green-600 text-white'}
                    `}
                >
                    <MapIcon className="w-7 h-7" />
                </Link>

                {NAV_ITEMS_RIGHT.map(item => (
                    <NavButton key={item.href} {...item} active={isActive(item.href)} />
                ))}
            </div>
        </nav>
    );
}

interface NavButtonProps {
    href: string;
    active: boolean;
    icon: LucideIcon;
    label: string;
}

function NavButton({ href, active, icon: Icon, label }: NavButtonProps) {
    return (
        <Link
            href={href}
            className={`
                flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-xl
                transition-colors duration-200
                ${active ? 'text-green-300' : 'text-white/60 hover:text-white'}
            `}
        >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-wide">{label}</span>
        </Link>
    );
}
