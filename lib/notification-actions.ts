'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser, updateUser } from './users';
import type { Notification } from './types';

/*
 * The old flow: the client fetched the user's email via a server action,
 * then wrote the WHOLE notifications array back through a generic
 * UpdateUser(email, field, value) — meaning any client could overwrite any
 * user's data by passing a different email. These actions derive the user
 * from the session cookie instead and never trust client-supplied emails.
 */

export async function markNotificationRead(id: number): Promise<Notification[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const updated = user.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    await updateUser(user.info.email, { notifications: updated });
    revalidatePath('/', 'layout'); // refresh the header badge
    return updated;
}

export async function markAllNotificationsRead(): Promise<Notification[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const updated = user.notifications.map(n => ({ ...n, read: true }));
    await updateUser(user.info.email, { notifications: updated });
    revalidatePath('/', 'layout');
    return updated;
}
