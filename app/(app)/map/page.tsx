import type { Metadata } from 'next';
import { getEvents, getReports } from '@/lib/data';
import MapView from '@/components/map/map-view';
import type { MapPin, PinStatus } from '@/components/map/types';
import type { ReportSeverity } from '@/lib/types';

export const metadata: Metadata = { title: 'Green Map' };

/*
 * Unlike the other pages, this one reads no cookies, so Next.js would
 * happily prerender it at BUILD time and freeze the pins. Force it
 * dynamic: the map must always reflect the live database.
 */
export const dynamic = 'force-dynamic';

const SEVERITY_TO_STATUS: Record<ReportSeverity, PinStatus> = {
    high: 'urgent',
    medium: 'medium',
    low: 'healthy'
};

/*
 * The Green Map is a live projection of Firestore: every active event and
 * every submitted report appears at the exact coordinates captured when it
 * was created. Both writes revalidate /map, so new pins show up on the
 * next visit without any client polling.
 */
export default async function MapPage() {
    const [events, reports] = await Promise.all([getEvents(), getReports()]);

    const pins: MapPin[] = [
        ...events.map(event => ({
            id: `event-${event.id}`,
            lat: event.location.lat,
            lng: event.location.lng,
            kind: 'event' as const,
            status: 'event' as const,
            title: event.title,
            description: `${event.description || 'Community activity'} — ${event.participants.length} joined`,
            category: event.category,
            date: `${event.date} ${event.time}`.trim()
        })),
        ...reports
            .filter(report => report.status !== 'resolved') // resolved issues leave the map
            .map(report => ({
                id: `report-${report.id}`,
                lat: report.location.lat,
                lng: report.location.lng,
                kind: 'report' as const,
                status: SEVERITY_TO_STATUS[report.severity],
                title: report.title,
                description: report.description || report.location.address,
                category: report.category,
                date: new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            }))
    ];

    return <MapView pins={pins} />;
}
