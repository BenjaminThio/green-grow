'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import dynamic from 'next/dynamic';

// three.js is heavy — load the particle field client-side only, after hydration.
const ThreeParticles = dynamic(() => import('@/components/ui/three-particles'), { ssr: false });
import { 
    CalendarDays, 
    Map as MapIcon, 
    Trees, 
    FileWarning, 
    Trophy, 
    ShieldCheck, 
    Lock, 
    ChevronRight,
    Leaf,
    Wifi,
    Battery,
    Gamepad2,
    BotMessageSquare,
    Bot
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUOTES = [
    { id: 1, text: "PLANT TREES NOT EGO", author: "GreenGrow" },
    { id: 2, text: "NATURE DOES NOT HURRY, YET EVERYTHING IS ACCOMPLISHED", author: "Lao Tzu" },
    { id: 3, text: "SOIL IS THE FOUNDATION OF LIFE", author: "EcoWisdom" },
    { id: 4, text: "ZERO WASTE IS A JOURNEY, NOT A DESTINATION", author: "Sustain.OS" },
    { id: 5, text: "WATER IS LIFE. SAVE EVERY DROP.", author: "Alert #404" },
];

const EmbeddedBeeper = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOn, setIsOn] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [bootSequence, setBootSequence] = useState(false);

    useEffect(() => {
        if (!isOn) return;
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [isOn]);

    const handleNext = () => { if (isOn) { setCurrentIndex((prev) => (prev + 1) % QUOTES.length); setIsSaved(false); }};
    const handlePrev = () => { if (isOn) { setCurrentIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length); setIsSaved(false); }};
    const handleSave = () => { if (isOn) { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); }};
    const togglePower = () => {
        if (isOn) setIsOn(false);
        else { setIsOn(true); setBootSequence(true); setTimeout(() => setBootSequence(false), 1500); }
    };

    return (
        <div className="w-full flex items-center justify-center py-4">
            <div className="relative w-full max-w-105 aspect-[1.7/1] rounded-[30px] beeper-case p-4 sm:p-5 flex flex-col items-center justify-between border-b-8 border-[#0f0f0f]">
                <div className="absolute top-2 w-full flex justify-center opacity-30 pointer-events-none">
                    <span className="text-[8px] tracking-[0.2em] font-bold text-white">GREEN GROW PAGER</span>
                </div>
                <div className="w-full h-[60%] bg-[#8c8c8c] rounded-t-xl rounded-b-3xl p-3 relative shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)] flex items-center justify-center mb-1">
                    <div className={`w-full h-full rounded-md border-4 border-[#7a7a7a] relative overflow-hidden transition-all duration-300 ${isOn ? 'bg-[#98c538] shadow-[0_0_15px_rgba(152,197,56,0.3)]' : 'bg-[#4a5733] opacity-60'}`}>
                        <div className="lcd-screen absolute inset-0 pointer-events-none z-10 opacity-30"></div>
                        <div className="relative z-20 h-full p-2 flex flex-col justify-between font-digital text-[#1a2e05]">
                            {isOn ? (
                                bootSequence ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-1">
                                        <Leaf className="w-5 h-5 animate-bounce" />
                                        <span className="text-sm tracking-widest">BOOTING...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center text-[10px] border-b border-[#1a2e05]/20 pb-0.5 mb-0.5 opacity-70">
                                            <div className="flex items-center gap-1"><Wifi size={10} /><span>ZN-A</span></div>
                                            <div className="flex items-center gap-1"><span>{isSaved ? 'SAVED' : 'RDY'}</span><Battery size={10} className="fill-current" /></div>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <p className="text-base sm:text-lg font-bold leading-tight uppercase tracking-tight line-clamp-2">{`"${QUOTES[currentIndex].text}"`}</p>
                                            <div className="mt-1 text-[10px] font-bold border-t border-[#1a2e05] pt-0.5 w-1/2 opacity-80">{QUOTES[currentIndex].author}</div>
                                        </div>
                                    </>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full opacity-20"><span className="text-2xl font-black rotate-[-10deg]">OFF</span></div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full h-[35%] flex items-center justify-between px-1 sm:px-4 gap-2">
                    <div className="flex gap-2">
                        <button onClick={handlePrev} className="w-10 h-8 sm:w-12 sm:h-10 bg-[#2a2a2a] rounded-full btn-inset btn-press flex items-center justify-center group active:bg-[#222]">
                            <div className="w-0 h-0 border-r-[6px] border-r-gray-400 border-y-4 border-y-transparent group-hover:border-r-white"></div>
                        </button>
                        <button onClick={handleNext} className="w-10 h-8 sm:w-12 sm:h-10 bg-[#2a2a2a] rounded-full btn-inset btn-press flex items-center justify-center group active:bg-[#222]">
                            <div className="w-0 h-0 border-l-[6px] border-l-gray-400 border-y-4 border-y-transparent group-hover:border-l-white"></div>
                        </button>
                    </div>
                    <button onClick={handleSave} className="w-10 h-8 sm:w-12 sm:h-10 bg-[#2a2a2a] rounded-full btn-inset btn-press flex items-center justify-center active:bg-[#222]">
                        <div className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-orange-600'} transition-all`}></div>
                    </button>
                    <button onClick={togglePower} className="w-14 h-10 sm:w-16 sm:h-12 bg-[#1a1a1a] rounded-xl btn-inset btn-press border-b-4 border-black active:border-b-0 active:translate-y-1 flex items-center justify-center">
                         <div className={`w-4 h-1 rounded-full ${isOn ? 'bg-emerald-900' : 'bg-[#333]'}`}></div>
                    </button>
                </div>
            </div>
        </div>
    );
};




export interface DashboardStats {
    trees: number;
    events: number;
    reports: number;
}

interface DashboardProps {
    username: string;
    isAdmin: boolean;
    stats: DashboardStats;
}

export default function GreenGrowDashboard({ username, isAdmin, stats }: DashboardProps) {
    const user = { name: username, role: isAdmin ? 'admin' : 'user' } as const;
    const router = useRouter();

    const mouseRef = useRef<Vector3>(new Vector3(9999, 9999, 0));
    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 60; 
        const y = -(e.clientY / window.innerHeight - 0.5) * 40;
        mouseRef.current.set(x, y, 0);
    };

    const navigateTo = (page: string) => {
        // Leading slash is essential: router.push('events') from /home would
        // resolve to /home/events (a 404). Absolute paths route from the root.
        router.push(`/${page}`);
    };

    return (
        <div onMouseMove={handleMouseMove} className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
            <div className="ambient-bg"></div>
            <ThreeParticles mouseRef={mouseRef} />
            <div className="flex flex-col min-h-screen relative z-10 pb-24">
                <main className="flex-1 px-6 pt-0 pb-8 max-w-2xl mx-auto w-full">
                    <div className="mb-6 fade-in-up">
                        <EmbeddedBeeper />
                    </div>
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold mb-2">Welcome back, {username} 🌱</h2>
                        <p className="text-gray-400 text-sm">Manage your garden and community impact.</p>
                        <div className="grid grid-cols-3 gap-3 mt-5">
                            <div className="glass-pill rounded-2xl px-4 py-3 text-center">
                                <p className="text-2xl font-display font-bold text-green-300">{stats.trees}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Trees</p>
                            </div>
                            <div className="glass-pill rounded-2xl px-4 py-3 text-center">
                                <p className="text-2xl font-display font-bold text-blue-300">{stats.events}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Events</p>
                            </div>
                            <div className="glass-pill rounded-2xl px-4 py-3 text-center">
                                <p className="text-2xl font-display font-bold text-orange-300">{stats.reports}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reports</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => navigateTo('gaia')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <BotMessageSquare className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-purple-300 transition-colors">
                                        Gaia AI
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Your eco-companion. Ask about plant health, recycling tips, or how to heal the planet. 🌿
                                    </p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                    <ChevronRight className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                        </button>
                        <button onClick={() => navigateTo('upcycle-smart-ai')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-purple-300 transition-colors">
                                        Upcycle Smart AI
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Analyse any item with a photo and learn what material it is, how to recycle it, and which bin it belongs in.
                                    </p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                    <ChevronRight className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                        </button>
                        <button onClick={() => navigateTo('events')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5 text-green-400" /></div>
                            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"><CalendarDays className="w-6 h-6 text-green-400" /></div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-green-300 transition-colors">Events</h3>
                            <p className="text-sm text-gray-400">Browse upcoming local events</p>
                        </button>
                        <button onClick={() => navigateTo('map')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5 text-emerald-400" /></div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"><MapIcon className="w-6 h-6 text-emerald-400" /></div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-emerald-300 transition-colors">Green Map</h3>
                            <p className="text-sm text-gray-400">View zones & active reports</p>
                        </button>
                        <button onClick={() => navigateTo('my-trees')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5 text-lime-400" /></div>
                            <div className="w-12 h-12 rounded-2xl bg-lime-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"><Trees className="w-6 h-6 text-lime-400" /></div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-lime-300 transition-colors">My Trees</h3>
                            <p className="text-sm text-gray-400">Track your adopted plants</p>
                        </button>
                        <button onClick={() => navigateTo('report')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5 text-orange-400" /></div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"><FileWarning className="w-6 h-6 text-orange-400" /></div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-orange-300 transition-colors">Report Issue</h3>
                            <p className="text-sm text-gray-400">Submit green zone problems</p>
                        </button>
                        <button onClick={() => navigateTo('achievements')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Trophy className="w-6 h-6 text-yellow-400" /></div>
                                <div><h3 className="text-lg font-bold mb-1 text-white group-hover:text-yellow-300 transition-colors">Achievements</h3><p className="text-sm text-gray-400">Track your impact, earn badges for tree planting, reporting, and green care.</p></div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center"><ChevronRight className="w-5 h-5 text-yellow-400" /></div>
                            </div>
                        </button>
                        <button onClick={() => navigateTo('game')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Gamepad2 className="w-6 h-6 text-purple-400" /></div>
                                <div><h3 className="text-lg font-bold mb-1 text-white group-hover:text-purple-300 transition-colors">Game</h3><p className="text-sm text-gray-400">Play mini-games to grow virtual trees, unlock rewards, and learn about green care.</p></div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center"><ChevronRight className="w-5 h-5 text-purple-400" /></div>
                            </div>
                        </button>
                        {user && user.role === 'admin' ? (
                            <button onClick={() => navigateTo('admin')} className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2 border-green-500/30 bg-green-500/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><ShieldCheck className="w-6 h-6 text-blue-400" /></div>
                                    <div><h3 className="text-lg font-bold mb-1 text-white group-hover:text-blue-300 transition-colors">Admin Dashboard</h3><p className="text-sm text-gray-400">Manage reports, create events, and coordinate volunteers.</p></div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center"><ChevronRight className="w-5 h-5 text-blue-400" /></div>
                                </div>
                            </button>
                        ) : (
                            <div aria-disabled="true" className="p-6 rounded-3xl text-left relative overflow-hidden sm:col-span-2 border-2 border-dashed border-white/10 cursor-not-allowed">
                                <div className="flex items-start gap-4 opacity-50">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-500/20 shrink-0 flex items-center justify-center"><Lock className="w-6 h-6 text-gray-400" /></div>
                                    <div><h3 className="text-lg font-bold mb-1 text-gray-300">Admin Dashboard</h3><p className="text-sm text-gray-500">Restricted to organizer accounts.</p></div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}