import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { getCurrentUser } from '@/lib/users';
import { levelFromXp, toAchievementViews, totalXp, XP_PER_LEVEL } from '@/lib/achievements';
import AchievementCard from './achievement-card';

export const metadata: Metadata = { title: 'Achievements' };

/*
 * Fully server-rendered: progress is computed from the user's live
 * counters (trees adopted, events joined, reports submitted), and unlock
 * timestamps come from the achievements map on the user document.
 * Awarding happens automatically inside the event/report/tree actions,
 * so this page is a pure read.
 */
export default async function AchievementsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/sign-in');

    const views = toAchievementViews(user);
    const xp = totalXp(user);
    const { level, intoLevel } = levelFromXp(xp);
    const earnedCount = views.filter(v => v.earned).length;

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
                    <div className="glass-card rounded-4xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -mr-8 -mt-8" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Level {level} Gardener</h2>
                                <p className="text-sm text-gray-300">{xp.toLocaleString()} XP • {earnedCount}/{views.length} badges</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-gray-300 mb-2">
                                <span>Progress to Level {level + 1}</span>
                                <span>{intoLevel} / {XP_PER_LEVEL} XP</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                                <div
                                    className="bg-linear-to-r from-green-400 to-emerald-500 h-3 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all"
                                    style={{ width: `${(intoLevel / XP_PER_LEVEL) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white px-2">Badges &amp; Milestones</h3>
                        {views.map(achievement => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
