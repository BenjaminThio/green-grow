import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAllEvents, getReports } from '@/lib/data';
import { getCurrentUser } from '@/lib/users';
import AdminDashboard from './admin-dashboard';

export const metadata: Metadata = { title: 'Admin Hub' };

/*
 * Central control hub, server-gated: non-admins are redirected before any
 * data is fetched (and every admin server action re-checks the role, so
 * the redirect is UX — the actions are the real security boundary).
 */
export default async function AdminPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/clear-session');
    if (user.info.role !== 'Admin') redirect('/home');

    const [events, reports] = await Promise.all([getAllEvents(), getReports()]);

    return <AdminDashboard events={events} reports={reports} />;
}
