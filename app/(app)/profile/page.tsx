import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserDTO } from '@/lib/users';
import ProfileView from './profile-view';

export const metadata: Metadata = { title: 'Profile' };

/*
 * Server component: user data (WITHOUT password/salt/session — the old
 * profile page literally loaded the stored password into client state
 * and rendered it into an <input>) is fetched once and passed down.
 */
export default async function ProfilePage() {
    const user = await getCurrentUserDTO();
    if (!user) redirect('/sign-in');

    return (
        <div className="relative z-10 min-h-screen px-4 py-8 flex items-start justify-center">
            <ProfileView user={user} />
        </div>
    );
}
