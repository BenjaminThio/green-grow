'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTION_EVENTS } from './data';
import { getCurrentUser, incrementUserStat, requireAdmin } from './users';
import { checkAndAwardAchievements } from './progress';
import type { EventDoc } from './types';

export interface ActionResult {
    error: string | null;
    success: boolean;
}

const ok: ActionResult = { error: null, success: true };
const fail = (error: string): ActionResult => ({ error, success: false });

/** Revalidate everything an event touches: list, map pins, home stats, header. */
function revalidateEventSurfaces() {
    revalidatePath('/events');
    revalidatePath('/map');
    revalidatePath('/home');
    revalidatePath('/admin');
    revalidatePath('/achievements');
}

/* ------------------------------------------------------------
   Admin: create / manage activities
   ------------------------------------------------------------ */
export async function createEvent(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
    let admin;
    try {
        admin = await requireAdmin();
    } catch {
        return fail('Admin access required.');
    }

    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim() || 'Community';
    const date = String(formData.get('date') ?? '');
    const time = String(formData.get('time') ?? '');
    const address = String(formData.get('address') ?? '').trim();
    const lat = Number(formData.get('lat'));
    const lng = Number(formData.get('lng'));
    const organizer = String(formData.get('organizer') ?? '').trim() || admin.info.username;
    const tools = String(formData.get('tools') ?? '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    const imageUrl = String(formData.get('imageUrl') ?? '').trim() || null;

    if (title.length < 3) return fail('Title must be at least 3 characters.');
    if (!date) return fail('Please pick a date.');
    if (!address) return fail('Please provide a location name.');
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0))
        return fail('Please set the event coordinates (use "Use my location" or enter them manually).');
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return fail('Coordinates are out of range.');

    const event: EventDoc = {
        id: randomUUID(),
        title,
        description,
        category,
        date,
        time,
        location: { lat, lng, address },
        organizer,
        tools,
        imageUrl,
        participants: [],
        status: 'active',
        createdBy: admin.info.email,
        createdAt: Date.now()
    };

    await setDoc(doc(db, COLLECTION_EVENTS, event.id), event);
    revalidateEventSurfaces();
    return ok;
}

export async function setEventStatus(eventId: string, status: EventDoc['status']): Promise<ActionResult> {
    try {
        await requireAdmin();
    } catch {
        return fail('Admin access required.');
    }
    await updateDoc(doc(db, COLLECTION_EVENTS, eventId), { status });
    revalidateEventSurfaces();
    return ok;
}

/* ------------------------------------------------------------
   Users: join / leave
   ------------------------------------------------------------ */
export async function joinEvent(eventId: string): Promise<ActionResult> {
    const user = await getCurrentUser();
    if (!user) return fail('Please sign in first.');

    const snapshot = await getDoc(doc(db, COLLECTION_EVENTS, eventId));
    if (!snapshot.exists()) return fail('Event not found.');
    const event = snapshot.data() as EventDoc;
    if (event.status !== 'active') return fail('This event is no longer active.');
    if (event.participants.includes(user.info.email)) return ok; // already joined — idempotent

    await updateDoc(doc(db, COLLECTION_EVENTS, eventId), {
        participants: arrayUnion(user.info.email)
    });
    await incrementUserStat(user.info.email, 'eventsJoined');
    await checkAndAwardAchievements(user.info.email);

    revalidateEventSurfaces();
    return ok;
}

export async function leaveEvent(eventId: string): Promise<ActionResult> {
    const user = await getCurrentUser();
    if (!user) return fail('Please sign in first.');

    const snapshot = await getDoc(doc(db, COLLECTION_EVENTS, eventId));
    if (!snapshot.exists()) return fail('Event not found.');
    const event = snapshot.data() as EventDoc;
    if (!event.participants.includes(user.info.email)) return ok;

    await updateDoc(doc(db, COLLECTION_EVENTS, eventId), {
        participants: arrayRemove(user.info.email)
    });
    // Counter goes back down, but achievements already earned stay earned.
    await incrementUserStat(user.info.email, 'eventsJoined', -1);

    revalidateEventSurfaces();
    return ok;
}
