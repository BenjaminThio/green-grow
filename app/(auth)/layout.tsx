import AppBackground from '@/components/ui/app-background';

/*
 * Auth layout: same shared firefly background as the rest of the app
 * (ambient blobs + particle field), with a centered card and no
 * header/navbar.
 */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4 relative">
            <AppBackground />
            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
