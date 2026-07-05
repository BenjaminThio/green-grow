import type { Metadata } from 'next';
import { getEvents } from '@/lib/data';
import { getCurrentUserDTO } from '@/lib/users';
import EventsClient from './events-client';

export const metadata: Metadata = { title: 'Events' };

/*
 * Server component: active events come straight from Firestore. Joining
 * an event revalidates this path, so the volunteer count and joined state
 * stay in sync everywhere (events list, map pins, home stats, admin hub).
 */
export default async function EventsPage() {
    const [events, user] = await Promise.all([getEvents(), getCurrentUserDTO()]);

    return <EventsClient events={events} userEmail={user?.email ?? null} />;
}
