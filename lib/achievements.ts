import type { UserRecord } from './types';

/*
 * Achievement engine. Definitions live in code; unlock timestamps live on
 * the user document (achievements: { [id]: unlockedAt }).
 *
 * Every definition is a pure function of the user's counters, so awarding
 * is idempotent: after any action that changes a counter, server actions
 * call getNewlyUnlocked() and persist whatever is newly true. No page ever
 * computes achievement state on the client.
 */

export interface AchievementDef {
    id: string;
    title: string;
    description: string;
    /** lucide icon name + tailwind color, rendered by the client card. */
    icon: 'sprout' | 'users' | 'shield' | 'file' | 'droplets' | 'star';
    color: string;
    xp: number;
    /** Total needed to unlock. */
    goal: number;
    /** Current progress derived from the user record. */
    metric: (user: UserRecord) => number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
    {
        id: 'green-beginner',
        title: 'Green Beginner',
        description: 'Adopt your first tree.',
        icon: 'sprout', color: 'text-green-400', xp: 100, goal: 1,
        metric: u => u.info.treesAdopted
    },
    {
        id: 'grove-guardian',
        title: 'Guardian of the Grove',
        description: 'Adopt 3 trees.',
        icon: 'shield', color: 'text-yellow-400', xp: 500, goal: 3,
        metric: u => u.info.treesAdopted
    },
    {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Join your first community event.',
        icon: 'star', color: 'text-emerald-400', xp: 100, goal: 1,
        metric: u => u.info.eventsJoined
    },
    {
        id: 'community-hero',
        title: 'Community Hero',
        description: 'Participate in 5 community events.',
        icon: 'users', color: 'text-blue-400', xp: 500, goal: 5,
        metric: u => u.info.eventsJoined
    },
    {
        id: 'watchful-eye',
        title: 'Watchful Eye',
        description: 'Submit your first issue report.',
        icon: 'file', color: 'text-orange-400', xp: 100, goal: 1,
        metric: u => u.info.reportsSubmitted
    },
    {
        id: 'report-master',
        title: 'Report Master',
        description: 'Submit 10 issue reports.',
        icon: 'file', color: 'text-red-400', xp: 300, goal: 10,
        metric: u => u.info.reportsSubmitted
    }
];

/** Achievements whose condition is now met but aren't stored yet. */
export function getNewlyUnlocked(user: UserRecord): AchievementDef[] {
    const unlocked = user.achievements ?? {};
    return ACHIEVEMENTS.filter(a => !unlocked[a.id] && a.metric(user) >= a.goal);
}

export function totalXp(user: UserRecord): number {
    const unlocked = user.achievements ?? {};
    return ACHIEVEMENTS.filter(a => unlocked[a.id]).reduce((sum, a) => sum + a.xp, 0);
}

export const XP_PER_LEVEL = 1000;

export function levelFromXp(xp: number): { level: number; intoLevel: number } {
    return { level: Math.floor(xp / XP_PER_LEVEL) + 1, intoLevel: xp % XP_PER_LEVEL };
}

/** Safe, client-facing view used by the achievements page. */
export interface AchievementView {
    id: string;
    title: string;
    description: string;
    icon: AchievementDef['icon'];
    color: string;
    xp: number;
    goal: number;
    progress: number;
    earned: boolean;
    earnedAt: number | null;
}

export function toAchievementViews(user: UserRecord): AchievementView[] {
    const unlocked = user.achievements ?? {};
    return ACHIEVEMENTS.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        color: a.color,
        xp: a.xp,
        goal: a.goal,
        progress: Math.min(a.metric(user), a.goal),
        earned: Boolean(unlocked[a.id]),
        earnedAt: unlocked[a.id] ?? null
    }));
}
