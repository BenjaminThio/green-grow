import 'server-only';
import { cache } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { getSessionId } from './session';
import type { Email, UserDTO, UserRecord } from './types';

const COLLECTION_USERS = 'users';

export async function doesUserExist(email: Email): Promise<boolean> {
    return (await getDoc(doc(db, COLLECTION_USERS, email))).exists();
}

export async function getUserByEmail(email: Email): Promise<UserRecord | null> {
    const snapshot = await getDoc(doc(db, COLLECTION_USERS, email));
    return snapshot.exists() ? (snapshot.data() as UserRecord) : null;
}

export async function createUser(record: UserRecord): Promise<void> {
    await setDoc(doc(db, COLLECTION_USERS, record.info.email), record, { merge: false });
}

export async function updateUser(email: Email, fields: Record<string, unknown>): Promise<void> {
    await updateDoc(doc(db, COLLECTION_USERS, email), fields);
}

/**
 * Resolve the current user from the session cookie.
 *
 * Wrapped in React cache() so that a header, page, and layout can all call
 * this in the same request and only ONE Firestore query is made — the old
 * code re-queried Firestore from a client component on every header render.
 */
export const getCurrentUser = cache(async (): Promise<UserRecord | null> => {
    const sessionId = await getSessionId();
    if (!sessionId) return null;

    const snapshot = await getDocs(
        query(
            collection(db, COLLECTION_USERS),
            where('sessionId', '==', sessionId),
            limit(1)
        )
    );

    if (snapshot.empty) return null;

    const record = snapshot.docs[0].data() as UserRecord;

    // Expired sessions are treated as logged out.
    if (record.sessionExpiresAt && record.sessionExpiresAt < Date.now()) return null;

    return record;
});

/** Strip secrets before anything crosses the server/client boundary. */
export function toUserDTO(record: UserRecord): UserDTO {
    const { username, email, imageBase64, role, joinDate, eventsJoined, treesAdopted, reportsSubmitted } = record.info;
    return {
        username,
        email,
        imageBase64,
        role,
        joinDate,
        eventsJoined,
        treesAdopted,
        reportsSubmitted,
        notifications: record.notifications
    };
}

export const getCurrentUserDTO = cache(async (): Promise<UserDTO | null> => {
    const record = await getCurrentUser();
    return record ? toUserDTO(record) : null;
});

/* ============================================================
   Shared mutation helpers used by the domain server actions
   ============================================================ */

import { arrayUnion, increment } from 'firebase/firestore';
import type { Notification } from './types';

/** Push a notification onto a user's doc (used for achievement unlocks, report updates, …). */
export async function addNotification(email: Email, notification: Omit<Notification, 'id' | 'read' | 'time'>): Promise<void> {
    const entry: Notification = {
        id: Date.now(),
        read: false,
        time: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        ...notification
    };
    await updateDoc(doc(db, COLLECTION_USERS, email), { notifications: arrayUnion(entry) });
}

/** Atomically bump one of the user's activity counters. */
export async function incrementUserStat(
    email: Email,
    stat: 'eventsJoined' | 'treesAdopted' | 'reportsSubmitted',
    by = 1
): Promise<void> {
    await updateDoc(doc(db, COLLECTION_USERS, email), { [`info.${stat}`]: increment(by) });
}

/** Throws unless the current session belongs to an Admin. Call at the top of every admin action/page. */
export async function requireAdmin(): Promise<UserRecord> {
    const user = await getCurrentUser();
    if (!user || user.info.role !== 'Admin') throw new Error('Admin access required.');
    return user;
}
