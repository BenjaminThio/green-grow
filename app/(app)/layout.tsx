import AmbientBackground from '@/components/ui/ambient-background';
import Header from '@/components/layout/header';
import Navbar from '@/components/layout/navbar';

/*
 * Layout for the authenticated app. The header, bottom navbar, and the
 * ambient blob background are rendered ONCE here — every page inside
 * app/(app)/ gets them automatically, and the auth/landing pages never
 * see them. No more `if (pathname === ...) return` hacks in the navbar.
 */
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen text-white">
            <AmbientBackground />
            <Header />
            {/* pb-28 keeps content clear of the fixed bottom navbar */}
            <main className="relative pb-28">
                {children}
            </main>
            <Navbar />
        </div>
    );
}
