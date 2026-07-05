'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTION_REPORTS } from './data';
import { addNotification, getCurrentUser, incrementUserStat, requireAdmin } from './users';
import { checkAndAwardAchievements } from './progress';
import type { ActionResult } from './event-actions';
import type { ReportDoc, ReportSeverity, ReportStatus } from './types';

const ok: ActionResult = { error: null, success: true };
const fail = (error: string): ActionResult => ({ error, success: false });

const SEVERITIES: ReportSeverity[] = ['low', 'medium', 'high'];
const MAX_IMAGES = 3;
// Firestore documents cap at ~1 MB; images are compressed client-side,
// but the server still enforces a hard budget.
const MAX_IMAGE_CHARS = 250_000;

function revalidateReportSurfaces() {
    revalidatePath('/report');
    revalidatePath('/map');
    revalidatePath('/admin');
    revalidatePath('/home');
    revalidatePath('/achievements');
}

export async function submitReport(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
    const user = await getCurrentUser();
    if (!user) return fail('Please sign in first.');

    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const severity = String(formData.get('severity') ?? 'low') as ReportSeverity;
    const address = String(formData.get('address') ?? '').trim();
    const lat = Number(formData.get('lat'));
    const lng = Number(formData.get('lng'));
    const imageBase64s = formData.getAll('images').map(String).filter(Boolean);

    if (title.length < 3) return fail('Please give the issue a title (3+ characters).');
    if (!category) return fail('Please choose a category.');
    if (!SEVERITIES.includes(severity)) return fail('Invalid severity.');
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0))
        return fail('Location missing — tap "Use my location" so the report can be pinned on the map.');
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return fail('Coordinates are out of range.');
    if (imageBase64s.length > MAX_IMAGES) return fail(`Please attach at most ${MAX_IMAGES} photos.`);
    if (imageBase64s.some(img => img.length > MAX_IMAGE_CHARS))
        return fail('One of the photos is too large — please retake or pick a smaller one.');

    const report: ReportDoc = {
        id: randomUUID(),
        title,
        description,
        category,
        severity,
        imageBase64s,
        location: { lat, lng, address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}` },
        status: 'pending',
        timeline: [
            { status: 'pending', note: 'Report submitted.', at: Date.now(), by: user.info.username }
        ],
        reporterEmail: user.info.email,
        reporterName: user.info.username,
        createdAt: Date.now()
    };

    await setDoc(doc(db, COLLECTION_REPORTS, report.id), report);
    await incrementUserStat(user.info.email, 'reportsSubmitted');
    await checkAndAwardAchievements(user.info.email);

    revalidateReportSurfaces();
    return ok;
}

/** Admin: move a report through pending → in-progress → resolved, notifying the reporter. */
export async function updateReportStatus(reportId: string, status: ReportStatus, note: string): Promise<ActionResult> {
    let admin;
    try {
        admin = await requireAdmin();
    } catch {
        return fail('Admin access required.');
    }

    const snapshot = await getDoc(doc(db, COLLECTION_REPORTS, reportId));
    if (!snapshot.exists()) return fail('Report not found.');
    const report = snapshot.data() as ReportDoc;

    await updateDoc(doc(db, COLLECTION_REPORTS, reportId), {
        status,
        timeline: arrayUnion({
            status,
            note: note.trim() || (status === 'resolved' ? 'Marked as resolved.' : 'Status updated.'),
            at: Date.now(),
            by: admin.info.username
        })
    });

    await addNotification(report.reporterEmail, {
        title: 'Report Status Updated',
        message: `Your report '${report.title}' is now ${status === 'in-progress' ? 'in progress' : status}.${note.trim() ? ` Note: ${note.trim()}` : ''}`,
        type: 'report'
    });

    revalidateReportSurfaces();
    revalidatePath('/status-tracker');
    return ok;
}
