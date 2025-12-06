'use client';
import React, { useState } from 'react';
import { 
    Star, 
    Calendar,
    CheckCircle2,
    Sprout,
    Users,
    ShieldCheck,
    FileText
} from 'lucide-react';

interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    earned: boolean;
    date?: string;
    progress?: number;
    total?: number;
    xp: number;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
    {
        id: 1,
        title: "Green Beginner",
        description: "Adopt your first tree.",
        icon: <Sprout size={32} className="text-green-400" />,
        earned: true,
        date: "Oct 12, 2023",
        xp: 100
    },
    {
        id: 2,
        title: "Community Hero",
        description: "Participate in 5 community events.",
        icon: <Users size={32} className="text-blue-400" />,
        earned: false,
        progress: 3,
        total: 5,
        xp: 500
    },
    {
        id: 3,
        title: "Guardian of the Grove",
        description: "Maintain a 'Healthy' status for all adopted trees for 1 month.",
        icon: <ShieldCheck size={32} className="text-yellow-400" />,
        earned: false,
        progress: 20,
        total: 30,
        xp: 1000
    },
    {
        id: 4,
        title: "Report Master",
        description: "Submit 10 verified issue reports.",
        icon: <FileText size={32} className="text-red-400" />,
        earned: true,
        date: "Sep 05, 2023",
        xp: 300
    }
];

interface AchievementCardProps {
    achievement: Achievement;
}

function AchievementCard({achievement}: AchievementCardProps) {
    return (
    <div className={`glass-card rounded-2xl p-5 border border-white/5 transition-all duration-300 ${achievement.earned ? 'bg-green-500/5' : 'hover:bg-white/5'}`}>
        <div className="flex items-start gap-4">
            <div className={`
                shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10
                ${achievement.earned ? 'bg-linear-to-br from-green-900/50 to-green-800/30' : 'bg-white/5 grayscale opacity-70'}
            `}>
                {achievement.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className={`font-bold truncate ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.title}
                    </h4>
                    {achievement.earned && (
                        <span className="bg-green-500/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Earned
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-400 mt-1 leading-snug">
                    {achievement.description}
                </p>
                <div className="mt-4">
                    {achievement.earned ? (
                        <div className="flex items-center text-xs text-green-400/80">
                            <Calendar size={12} className="mr-1.5" />
                            Unlocked on {achievement.date}
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-gray-400">
                                <span className="uppercase tracking-wider">Progress</span>
                                <span>{achievement.progress} / {achievement.total}</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div 
                                    className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${((achievement.progress || 0) / (achievement.total || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
                        <Star size={10} className="fill-yellow-500" />
                        +{achievement.xp} XP
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default function AchievementCards() {
    const [achievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);

    return achievements.map(achievement => <AchievementCard key={achievement.id} achievement={achievement}/>);
}