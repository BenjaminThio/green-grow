import { Sprout, Users, ShieldCheck, FileText, Droplets, Star, CheckCircle2 } from 'lucide-react';
import type { AchievementView } from '@/lib/achievements';

/*
 * Server component (no interactivity). Icons are referenced by name in the
 * achievement definitions so the definitions stay serializable.
 */
const ICONS = {
    sprout: Sprout,
    users: Users,
    shield: ShieldCheck,
    file: FileText,
    droplets: Droplets,
    star: Star
} as const;

export default function AchievementCard({ achievement }: { achievement: AchievementView }) {
    const Icon = ICONS[achievement.icon];
    const percent = Math.round((achievement.progress / achievement.goal) * 100);

    return (
        <div className={`glass-card rounded-2xl p-5 border border-white/5 transition-all duration-300 ${achievement.earned ? 'bg-green-500/5' : 'hover:bg-white/5'}`}>
            <div className="flex items-start gap-4">
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 ${
                    achievement.earned ? 'bg-linear-to-br from-green-900/50 to-green-800/30' : 'bg-white/5 grayscale opacity-70'
                }`}>
                    <Icon size={32} className={achievement.color} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-white truncate">{achievement.title}</h4>
                        <span className="text-xs font-bold text-yellow-400 whitespace-nowrap">+{achievement.xp} XP</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>

                    {achievement.earned ? (
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                            <CheckCircle2 size={14} />
                            Earned{achievement.earnedAt ? ` • ${new Date(achievement.earnedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                        </p>
                    ) : (
                        <div>
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress} / {achievement.goal}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
