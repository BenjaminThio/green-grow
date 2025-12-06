'use client';
import { useState, useRef } from 'react';
import { 
    Gamepad2, 
    Maximize, 
    RotateCcw, 
    Share2, 
    Trophy, 
    Sprout,
    Info,
    MousePointer2
} from 'lucide-react';

export default function GamePage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [, setIsFullscreen] = useState(false);
    const [gameKey, setGameKey] = useState(0);

    const handleFullscreen = () => {
        if (!iframeRef.current) return;

        if (!document.fullscreenElement) {
            iframeRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleReload = () => {
        setGameKey(prev => prev + 1);
    };

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

                <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full flex flex-col justify-center">
                    
                    <div className="glass-card rounded-4xl p-1 border-t border-white/10 overflow-hidden shadow-2xl relative">
                        <div className="px-6 py-4 flex justify-between items-center bg-black/20 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/30">
                                    <Gamepad2 className="text-green-400 w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white tracking-wide">Plantz</h2>
                                    <div className="flex items-center gap-1 text-[10px] text-green-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        Online
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 mr-2">
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span className="text-xs font-bold text-gray-300">High Score: 2,450</span>
                                </div>
                                <button 
                                    onClick={handleReload}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    title="Restart Game"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleFullscreen}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    title="Fullscreen"
                                >
                                    <Maximize className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="relative w-full aspect-video bg-black/80 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                <div className="flex flex-col items-center gap-2 opacity-50">
                                    <Sprout className="w-12 h-12 text-green-800 animate-pulse" />
                                    <span className="text-xs font-mono text-green-900">INITIALIZING ENGINE...</span>
                                </div>
                            </div>
                            <iframe
                                ref={iframeRef}
                                key={gameKey}
                                src='/plantz/index.html'
                                className="w-full h-full border-none z-10"
                                allowFullScreen
                                title="Plantz Game"
                            />
                        </div>
                        <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-2 text-white">
                                    <span className="w-6 h-6 border border-white/20 rounded flex items-center justify-center bg-white/5 text-gray-300">
                                        <MousePointer2 className="w-3 h-3" />
                                    </span>
                                    <span className="font-medium text-gray-300">Right Click</span> to Interact
                                </span>
                            </div>
                            <button className="flex items-center gap-1 hover:text-white transition-colors">
                                <Share2 className="w-3 h-3" /> Share
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 md:hidden">
                        <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-100/80">
                            For the best experience, we recommend playing on a larger screen or rotating your device to landscape mode.
                        </p>
                    </div>
                </main>
            </div> 
        </div>
    );
}