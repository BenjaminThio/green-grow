import type { Metadata } from 'next';
import { getCurrentUserDTO } from '@/lib/users';
import NotificationList from './notification-list';

export const metadata: Metadata = { title: 'Notifications' };

/*
 * Server component: notifications are fetched on the server from the
 * session (single cached Firestore read shared with the header) and
 * passed down — no client-side fetch, no loading spinner needed.
 */
export default async function StatusTrackerPage() {
    const user = await getCurrentUserDTO();

    return (
        <div className="relative z-10 flex flex-col min-h-screen pb-24">
            <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
                <NotificationList initialNotifications={user?.notifications ?? []} />
            </main>
        </div>
    );
}
