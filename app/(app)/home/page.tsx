import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserDTO } from '@/lib/users';
import GreenGrowDashboard from './home-client';

export const metadata: Metadata = { title: 'Home' };

/*
 * Server shell: greets the real signed-in user, shows their live activity
 * counters, and only unlocks the Admin tile for actual admins.
 */
export default async function HomePage() {
    const user = await getCurrentUserDTO();
    if (!user) redirect('/clear-session');

    return (
        <GreenGrowDashboard
            username={user.username}
            isAdmin={user.role === 'Admin'}
            stats={{
                trees: user.treesAdopted,
                events: user.eventsJoined,
                reports: user.reportsSubmitted
            }}
        />
    );
}
