import 'server-only';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Email, EventDoc, ReportDoc, TreeDoc } from './types';

/*
 * All Firestore READS for the domain collections. Server components import
 * from here; mutations live in *-actions.ts files. Keeping reads out of
 * 'use server' files means they can never be invoked as endpoints from
 * the client.
 *
 * NOTE ON SORTING: we deliberately do NOT use Firestore's orderBy() and
 * instead sort in memory. A query that combines where(...) with an
 * orderBy() on a DIFFERENT field requires a hand-created composite index
 * (Firestore throws "The query requires an index" otherwise). For this
 * app's data volume the whole matching set is loaded anyway, so an
 * in-memory sort is equivalent, needs zero Firebase-console setup, and
 * works the moment someone clones the repo. If these collections ever
 * grow large enough to need server-side pagination, switch to indexed
 * queries + the console indexes then.
 */

export const COLLECTION_EVENTS = 'events';
export const COLLECTION_REPORTS = 'reports';
export const COLLECTION_TREES = 'trees';

/** Active events, soonest date first. */
export async function getEvents(): Promise<EventDoc[]> {
    const snapshot = await getDocs(
        query(collection(db, COLLECTION_EVENTS), where('status', '==', 'active'))
    );
    return snapshot.docs
        .map(d => d.data() as EventDoc)
        .sort((a, b) => a.date.localeCompare(b.date));
}

/** Every event (any status), newest-created first — for the admin hub. */
export async function getAllEvents(): Promise<EventDoc[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_EVENTS));
    return snapshot.docs
        .map(d => d.data() as EventDoc)
        .sort((a, b) => b.createdAt - a.createdAt);
}

/** Every report, newest first. */
export async function getReports(): Promise<ReportDoc[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_REPORTS));
    return snapshot.docs
        .map(d => d.data() as ReportDoc)
        .sort((a, b) => b.createdAt - a.createdAt);
}

/** A single user's trees, most recently adopted first. */
export async function getTreesByOwner(email: Email): Promise<TreeDoc[]> {
    const snapshot = await getDocs(
        query(collection(db, COLLECTION_TREES), where('ownerEmail', '==', email))
    );
    return snapshot.docs
        .map(d => d.data() as TreeDoc)
        .sort((a, b) => b.adoptedAt - a.adoptedAt);
}
