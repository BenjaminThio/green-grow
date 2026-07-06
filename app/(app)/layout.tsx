import ConditionalAppBackground from '@/components/ui/conditional-app-background';
import Header from '@/components/layout/header';
import Navbar from '@/components/layout/navbar';

/*
 * Layout for the authenticated app. The shared firefly background (ambient
 * blobs + particle field), the header, and the bottom navbar are rendered
 * ONCE here, so every page inside app/(app)/ shares the exact same living
 * background — only <main> changes on navigation. The background is skipped
 * on /map (see ConditionalAppBackground), where the Leaflet canvas fills
 * the screen.
 */
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen text-white">
            <ConditionalAppBackground />
            <Header />
            {/* pb-28 keeps content clear of the fixed bottom navbar */}
            <main className="relative pb-28">
                {children}
            </main>
            <Navbar />
        </div>
    );
}
