import Link from 'next/link';
import { Sprout } from 'lucide-react';
import { getCurrentUserDTO } from '@/lib/users';
import HeaderShell, { HeaderUser, HeaderUserMenu } from './header-shell';

/*
 * Fixes vs. the old header:
 * - It is now a SERVER component. The old one was a client component that
 *   called a server action from useEffect on every navigation — which
 *   returned the FULL user record (password + salt + session id) to the
 *   browser. Now only a minimal, safe subset ever leaves the server.
 * - No more `externalUpdateHeader` global mutable escape hatch; data
 *   freshness comes from normal server re-renders (revalidatePath).
 * - Only the scroll-glass effect lives in a tiny client component.
 */
export default async function Header() {
    const user = await getCurrentUserDTO();

    const headerUser: HeaderUser | null = user
        ? {
              name: user.username,
              imageBase64: user.imageBase64,
              unreadCount: user.notifications.filter(n => !n.read).length
          }
        : null;

    return (
        <HeaderShell>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/home" className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/50 group-hover:rotate-12 transition-transform duration-300">
                        <Sprout className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-display font-bold tracking-tight hidden sm:block text-white">
                        Green<span className="text-green-400">Grow</span>
                    </h1>
                </Link>

                <HeaderUserMenu user={headerUser} />
            </div>
        </HeaderShell>
    );
}
