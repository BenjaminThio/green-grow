'use client';
import { useState, useEffect } from 'react';
import { 
    Sprout, 
    Bell, 
    ArrowLeft,
    User as UserIcon
} from 'lucide-react';
import { Role, UserProps } from '@/utils/database';
import { GetCurrentUserData } from '@/utils/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export interface UserInfo {
    name: string;
    role: Role,
    notificationsCount: number;
    imageBase64: string | null;
}

interface HeaderProps {
    variant?: 'home' | 'page';
    title?: string;
}

let externalUpdateHeader: ((newCount?: number) => void) | null = null;
export function refreshHeader(newCount?: number) {
    if (externalUpdateHeader) externalUpdateHeader(newCount);
}

export default function Header({ 
    variant = 'home', 
    title
}: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);
    const pathname = usePathname();

    async function UpdateHeader(newCount?: number) {
        if (newCount !== undefined) {
            setUser(prev => prev ? { ...prev, notificationsCount: newCount } : prev);
            return;
        }

        await GetCurrentUserData().then(data => {
            const userData: UserProps | null = data as UserProps | null;
            if (!userData) return;

            setUser({
                name: userData.info.username,
                role: userData.info.role,
                notificationsCount: userData.notifications.filter(n => !n.read).length,
                imageBase64: userData.info.imageBase64
            });
        });
    }

    useEffect(() => {
        externalUpdateHeader = UpdateHeader;
        return () => {
            externalUpdateHeader = null;
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);

        const fetchData = async () => {
            await UpdateHeader();
        };

        fetchData();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);


    return (
        <header className={`sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${isScrolled ? 'glass' : ''}`}>
            <style jsx>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {variant === 'home' ? (
                    <Link 
                        href='/'
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/50 group-hover:rotate-12 transition-transform duration-300">
                            <Sprout className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-display font-bold tracking-tight hidden sm:block text-white">
                            Green<span className="text-green-400">Grow</span>
                        </h1>
                    </Link>
                ) : (
                    <Link 
                        href='/' 
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/80 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                )}
                {variant === 'page' && title && (
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-display font-bold tracking-wide text-white whitespace-nowrap">
                        {title}
                    </h1>
                )}
                {
                    (pathname === '/' || pathname === '/sign-up' || pathname === '/sign-in') ?
                    null
                    :
                    <div className="flex items-center gap-3">
                        <Link 
                            href='/status-tracker'
                            className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
                        >
                            <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                            {user && user.notificationsCount > 0 && (
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                            )}
                        </Link>
                        <Link 
                            href='/profile'
                            className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                        >
                            {
                                user?.imageBase64
                                ?
                                <Image src={user.imageBase64} alt='pfp' width={0} height={0} className="w-8 h-8 rounded-full shadow-inner object-cover" />
                                :
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold shadow-inner text-white">
                                    {user?.name ? user.name.charAt(0) : <UserIcon size={14}/>}
                                </div>
                            }
                            <span className="text-sm font-medium text-gray-200 hidden sm:block">
                                Hi, {user?.name ? user.name.split(' ')[0] : 'Guest'}
                            </span>
                        </Link>
                    </div>
                }
            </div>
        </header>
    );
}