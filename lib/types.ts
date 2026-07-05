export type Role = 'User' | 'Admin';
export type Email = `${string}@${string}`;

export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'report' | 'reminder' | 'general';
    read: boolean;
}

/** Full Firestore document — NEVER send this to the client. */
export interface UserRecord {
    info: {
        username: string;
        email: Email;
        /** scrypt hash, hex-encoded. Plaintext is never stored. */
        passwordHash: string;
        salt: string;
        imageBase64: string | null;
        role: Role;
        joinDate: string;
        eventsJoined: number;
        treesAdopted: number;
        reportsSubmitted: number;
    };
    sessionId: string;
    sessionExpiresAt: number;
    notifications: Notification[];
    /** achievementId -> unlockedAt (epoch ms). */
    achievements?: Record<string, number>;
}

/* ============================================================
   Domain documents (collections: events, reports, trees)
   ============================================================ */

export interface GeoPoint {
    lat: number;
    lng: number;
    /** Human-readable label, e.g. "Central Park, Zone A". */
    address: string;
}

export interface EventDoc {
    id: string;
    title: string;
    description: string;
    category: string;
    /** ISO date, e.g. "2026-08-15". */
    date: string;
    /** e.g. "09:00". */
    time: string;
    location: GeoPoint;
    organizer: string;
    tools: string[];
    /** Optional remote image URL for the event card. */
    imageUrl: string | null;
    /** Emails of joined users. */
    participants: Email[];
    status: 'active' | 'cancelled' | 'completed';
    createdBy: Email;
    createdAt: number;
}

export type ReportSeverity = 'low' | 'medium' | 'high';
export type ReportStatus = 'pending' | 'in-progress' | 'resolved';

export interface ReportTimelineEntry {
    status: ReportStatus;
    note: string;
    at: number;
    by: string;
}

export interface ReportDoc {
    id: string;
    title: string;
    description: string;
    category: string;
    severity: ReportSeverity;
    /** Compressed JPEG data-URLs (kept small — Firestore docs max 1 MB). */
    imageBase64s: string[];
    location: GeoPoint;
    status: ReportStatus;
    timeline: ReportTimelineEntry[];
    reporterEmail: Email;
    reporterName: string;
    createdAt: number;
}

export type TreeStatus = 'Healthy' | 'Needs Water' | 'Attention';

export interface TreeUpdate {
    note: string;
    at: number;
    type: 'adopted' | 'watered' | 'note' | 'status';
}

export interface TreeDoc {
    id: string;
    ownerEmail: Email;
    name: string;
    species: string;
    status: TreeStatus;
    location: GeoPoint;
    photoBase64: string | null;
    updates: TreeUpdate[];
    adoptedAt: number;
    lastWateredAt: number;
}

/** Safe, client-facing shape. No hash, no salt, no session id. */
export interface UserDTO {
    username: string;
    email: Email;
    imageBase64: string | null;
    role: Role;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
    notifications: Notification[];
}
