'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
    CalendarDays, 
    Map as MapIcon, 
    Trees, 
    FileWarning, 
    Trophy, 
    ShieldCheck, 
    Lock, 
    ChevronRight
} from 'lucide-react';

// Import Navbar and the Page type from your component file
import Navbar, { Page } from '@/app/components/navbar/navbar';
import Header from '@/app/components/header/header';
import { useRouter } from 'next/navigation';

// --- SHADERS (From App.tsx) ---
const vertexShader = `
    uniform float uTime;
    uniform vec3 uMouse;
    attribute float aSize;
    attribute vec3 aRandomness;
    varying float vAlpha;
    void main() {
        vec3 pos = position;
        float time = uTime * 0.2;
        pos.x += sin(time + aRandomness.y * 5.0) * 1.5;
        pos.y += cos(time * 0.8 + aRandomness.x * 5.0) * 1.5;
        pos.z += sin(time * 0.5 + aRandomness.z * 5.0) * 0.5;

        float dist = distance(pos.xy, uMouse.xy);
        float radius = 25.0;
        if(dist < radius) {
            vec3 dir = normalize(pos - uMouse);
            float force = (1.0 - dist / radius) * 10.0;
            pos += dir * force;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = aSize * (150.0 / -mvPosition.z);
        vAlpha = 0.4 + 0.3 * sin(uTime * 1.5 + aRandomness.z * 20.0);
    }
`;

const fragmentShader = `
    varying float vAlpha;
    void main() {
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        if (length(xy) > 0.5) discard;
        float glow = 1.0 - (length(xy) * 2.0);
        glow = pow(glow, 2.0);
        vec3 color = vec3(0.8, 1.0, 0.6); 
        gl_FragColor = vec4(color, vAlpha * glow);
    }
`;

// --- THREE.JS BACKGROUND COMPONENT ---
interface ThreeBackgroundProps {
    mouseRef: React.MutableRefObject<THREE.Vector3>;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ mouseRef }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !mountRef.current) return;
        
        const container = mountRef.current;
        container.innerHTML = ''; 

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 30;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); 
        
        container.appendChild(renderer.domElement);

        const count = 400;
        const range = 60;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const randomness = new Float32Array(count * 3);

        for(let i=0; i<count; i++) {
            positions[i*3] = (Math.random()-0.5)*range;
            positions[i*3+1] = (Math.random()-0.5)*range;
            positions[i*3+2] = (Math.random()-0.5)*range * 0.5;
            sizes[i] = Math.random() * 2 + 0.5;
            randomness[i*3] = Math.random();
            randomness[i*3+1] = Math.random();
            randomness[i*3+2] = Math.random();
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: { 
                uTime: { value: 0 }, 
                uMouse: { value: new THREE.Vector3(9999, 9999, 0) } 
            },
            transparent: true, 
            depthWrite: false, 
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const clock = new THREE.Clock();
        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            material.uniforms.uTime.value = time;
            material.uniforms.uMouse.value.lerp(mouseRef.current, 0.1);
            
            const scrollY = window.scrollY;
            points.rotation.y = scrollY * 0.0005;
            points.position.y = scrollY * 0.01;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            if (container) container.innerHTML = '';
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []); 

    // CHANGE: Changed z-[-1] to z-[1] so it sits ON TOP of the ambient-bg but BELOW the content (which is z-10)
    return <div ref={mountRef} className="fixed inset-0 z-[1] pointer-events-none" />;
};

interface User {
    name: string;
    role: 'admin' | 'user';
}

export default function GreenGrowDashboard() {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [user, setUser] = useState<User | null>({ name: 'Gardener', role: 'admin' });
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const router = useRouter();

    // --- MOUSE TRACKING FOR PARTICLES ---
    const mouseRef = useRef<THREE.Vector3>(new THREE.Vector3(9999, 9999, 0));

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 60; 
        const y = -(e.clientY / window.innerHeight - 0.5) * 40;
        mouseRef.current.set(x, y, 0);
    };

    const navigateTo = (page: Page) => {
        router.push(`/${page}`);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            onMouseMove={handleMouseMove}
            // CHANGE: Removed bg-[#052e16] because it was opaque and hiding the background layers
            className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative"
        >
            {/* --- STYLES --- */}
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
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                }
                
                .glass-card:hover {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
                    border-color: rgba(74, 222, 128, 0.3);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
                }

                /* This class is used inside Navbar, so we keep it global here or move it to a global css file */
                .glass-nav {
                    background: rgba(20, 83, 45, 0.4);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>

            {/* Ambient Background */}
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>

            {/* Three.js Particles */}
            <ThreeBackground mouseRef={mouseRef} />

            <div className="flex flex-col min-h-screen relative z-10 pb-24">
                
                {/* --- HEADER --- */}
                
                <Header />
                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 px-6 pt-6 pb-8 max-w-2xl mx-auto w-full">
                    
                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold mb-2">Dashboard</h2>
                        <p className="text-gray-400 text-sm">Manage your garden and community impact.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Events Button */}
                        <button 
                            onClick={() => navigateTo('events')}
                            className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <CalendarDays className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-green-300 transition-colors">Events</h3>
                            <p className="text-sm text-gray-400">Browse upcoming local events</p>
                        </button>

                        {/* Map Button */}
                        <button 
                            onClick={() => navigateTo('map')}
                            className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <MapIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-emerald-300 transition-colors">Green Map</h3>
                            <p className="text-sm text-gray-400">View zones & active reports</p>
                        </button>

                        {/* My Trees Button */}
                        <button 
                            onClick={() => navigateTo('my-trees')}
                            className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-lime-400" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-lime-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Trees className="w-6 h-6 text-lime-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-lime-300 transition-colors">My Trees</h3>
                            <p className="text-sm text-gray-400">Track your adopted plants</p>
                        </button>

                        {/* Report Issue Button */}
                        <button 
                            onClick={() => navigateTo('report')}
                            className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FileWarning className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-orange-300 transition-colors">Report Issue</h3>
                            <p className="text-sm text-gray-400">Submit green zone problems</p>
                        </button>

                        {/* Achievements Button */}
                        <button 
                            onClick={() => navigateTo('achievements')}
                            className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-yellow-300 transition-colors">Achievements</h3>
                                    <p className="text-sm text-gray-400">Track your impact, earn badges for tree planting, reporting, and green care.</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                                </div>
                            </div>
                        </button>

                        {/* Admin Dashboard (Conditional) */}
                        {user && user.role === 'admin' ? (
                            <button 
                                onClick={() => navigateTo('admin')}
                                className="glass-card p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2 border-green-500/30 bg-green-500/5"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-white group-hover:text-blue-300 transition-colors">Admin Dashboard</h3>
                                        <p className="text-sm text-gray-400">Manage reports, create events, and coordinate volunteers.</p>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                        <ChevronRight className="w-5 h-5 text-blue-400" />
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigateTo('login')}
                                className="p-6 rounded-3xl text-left group relative overflow-hidden sm:col-span-2 border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
                            >
                                <div className="flex items-start gap-4 opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-500/20 flex-shrink-0 flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-gray-300">Admin Dashboard</h3>
                                        <p className="text-sm text-gray-500">Login as admin to unlock advanced features.</p>
                                    </div>
                                </div>
                            </button>
                        )}
                        
                    </div>
                </main>
            </div>

            {/* 3. Pass state and handler to Navbar */}
            <Navbar currentPage={currentPage} onNavigate={navigateTo} />
            
        </div>
    );
}