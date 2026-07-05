import AmbientBackground from '@/components/ui/ambient-background';

/*
 * Auth layout: ambient background + centered card, no header/navbar.
 */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4 relative">
            <AmbientBackground />
            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
