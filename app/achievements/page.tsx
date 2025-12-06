'use client';
import { Trophy } from 'lucide-react';
import AchievementCards from './achievement-card';

export default function AchievementsPage() {
    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
                
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                h1, h2, h3, .font-display { font-family: 'Montserrat', sans-serif; }

                /* Ambient Background */
                .ambient-bg {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
                    background: radial-gradient(circle at 15% 50%, rgba(22, 163, 74, 0.15), transparent 25%),
                                radial-gradient(circle at 85% 30%, rgba(163, 230, 53, 0.1), transparent 25%);
                    background-color: #022c22; pointer-events: none;
                }

                .gradient-blob {
                    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; z-index: -1;
                }
                .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #166534; animation: blob 20s infinite alternate; }
                .blob-2 { bottom: -10%; right: -10%; width: 600px; height: 600px; background: #14532d; animation: blob 25s infinite alternate-reverse; }

                /* Glass Utilities */
                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                
                /* Animations */
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
                    <div className="glass-card rounded-4xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -mr-8 -mt-8"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Level 5 Gardener</h2>
                                <p className="text-sm text-gray-300">1,900 XP Total</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-gray-300 mb-2">
                                <span>Progress to Level 6</span>
                                <span>400 / 1000 XP</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                                <div className="bg-linear-to-r from-green-400 to-emerald-500 h-3 rounded-full w-[40%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white px-2">Badges & Milestones</h3>
                        <AchievementCards/>
                    </div>
                </main>
            </div>
        </div>
    );
}