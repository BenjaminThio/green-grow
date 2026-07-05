import 'server-only';
import { getNewlyUnlocked } from './achievements';
import { addNotification, getUserByEmail, updateUser } from './users';
import type { Email } from './types';

/*
 * Called by event/report/tree actions AFTER a counter changes.
 * Re-reads the user (so increments are reflected), persists any newly
 * unlocked achievements, and notifies the user. Idempotent: an already
 * stored achievement is never awarded twice.
 */
export async function checkAndAwardAchievements(email: Email): Promise<void> {
    const user = await getUserByEmail(email);
    if (!user) return;

    const newlyUnlocked = getNewlyUnlocked(user);
    if (newlyUnlocked.length === 0) return;

    const updates: Record<string, unknown> = {};
    for (const achievement of newlyUnlocked) {
        updates[`achievements.${achievement.id}`] = Date.now();
    }
    await updateUser(email, updates);

    for (const achievement of newlyUnlocked) {
        await addNotification(email, {
            title: 'New Badge Earned! 🏆',
            message: `Congratulations! You've earned the '${achievement.title}' badge (+${achievement.xp} XP).`,
            type: 'general'
        });
    }
}
