'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import dynamic from 'next/dynamic';

// three.js is heavy — load the particle field client-side only, after hydration.
const ThreeParticles = dynamic(() => import('@/components/ui/three-particles'), { ssr: false });
// The 3D hero tree (three.js) — client-only, loaded after hydration.
const TreeParticles = dynamic(() => import('@/components/ui/tree-particles'), { ssr: false });
import { useRouter } from 'next/navigation';
import AmbientBackground from '@/components/ui/ambient-background';
import './landing.css';
import Image from 'next/image';

const Icons = {
  Sprout: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-3.3 3-6-2.3.5-4.5 2-6.2 3.4z"/></svg>,
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Shield: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
};

const AccordionSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { title: 'Carbon Sink', desc: 'Forests are the most efficient carbon capture technology on Earth.', img: '/images/carbon-sink.jpg' },
    { title: 'Water Security', desc: 'Roots act as filtration systems, providing clean groundwater for millions.', img: '/images/water-security.jpg' },
    { title: 'Biodiversity', desc: 'Protecting habitats for thousands of endangered species.', img: '/images/biodiversity.jpg' }
  ];

  return (
    <div className="w-full h-[600px] flex flex-col md:flex-row gap-4 max-w-7xl mx-auto px-6 mb-24">
      {items.map((item, i) => (
        <div 
          key={i} 
          onMouseEnter={() => setActiveIndex(i)}
          className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeIndex === i ? 'flex-3' : 'flex-1'} group`}
        >
          <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className={`text-5xl font-display font-bold text-white/20 mb-2 transition-all duration-500 ${activeIndex === i ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>0{i+1}</div>
            <h3 className={`text-2xl font-bold uppercase mb-2 ${activeIndex === i ? 'text-white' : 'text-gray-300'}`}>{item.title}</h3>
            <p className={`text-sm text-gray-300 max-w-md transition-all duration-500 ${activeIndex === i ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}>
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const router = useRouter();
  const mouseRef = useRef<Vector3>(new Vector3(9999, 9999, 0));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);

    // Feed pointer position to the particle field for its parallax/repulsion.
    const onPointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = -(e.clientY / window.innerHeight - 0.5) * 40;
      mouseRef.current.set(x, y, 0);
    };
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div className="landing-root min-h-screen relative font-sans text-white bg-transparent overflow-x-hidden">

      <div className="bg-image"></div>

      <AmbientBackground />

      <div className="landing-particles">
        <ThreeParticles mouseRef={mouseRef} />
      </div>

      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'glass shadow-lg py-2' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-green-900/50">
              <span className="text-white"><Icons.Sprout /></span>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Green<span className="text-green-400">Grow</span></span>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 text-green-300 text-xs font-bold tracking-wider uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              #1 Gardening Companion
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-8">
              Plant a Tree. <br/>
              <span className="text-gradient">Shape the Future.</span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Your movements create impact — explore a living digital forest powered by your actions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {
                true
                ?
                <>
                  <button
                    className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                    onClick={() => {router.push('/sign-up');}} 
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => {
                      router.push('/sign-in');
                    }}
                    className="glass px-8 py-4 rounded-full font-bold text-white hover:bg-white/10 transition-all w-full sm:w-auto"
                  >
                    Sign In
                  </button>
                </>
                :
                <button
                  className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  onClick={() => {router.push('/home');}} 
                >
                  Home
                </button>
              }
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-400">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#052e16] bg-gray-600 overflow-hidden">
                    <Image src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" width={0} height={0} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#052e16] bg-green-500 text-white flex items-center justify-center font-bold text-xs">+2M</div>
              </div>
              <p>Happy Gardeners</p>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md lg:max-w-full min-h-[300px] lg:min-h-[560px]">
            {/*
             * The 3D tree. On desktop this wrapper is a normal in-flow box
             * on the right (so it scrolls away with the hero) sitting next to
             * the floating status card. On mobile, CSS promotes it to a
             * fixed, screen-centered backdrop behind the content.
             */}
            <div className="landing-tree-box">
              <TreeParticles />
            </div>

            <div className="absolute top-16 left-0 lg:-left-8 glass-card p-4 rounded-2xl animate-float-delayed hidden sm:block z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="text-green-600"><Icons.Check /></div>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-bold text-white">Thriving!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-32 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Complete Care System</h2>
            <p className="text-gray-400">Everything you need to keep your plants alive and happy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border-t-4 border-green-400 group">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-green-400">
                <Icons.Sprout />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Identify</h2>
              <p className="text-gray-400 leading-relaxed text-sm">Access a database of 10,000+ species. Snap a photo and identify instantly.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border-t-4 border-lime-400 group">
              <div className="w-14 h-14 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-lime-400">
                <Icons.Shield />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Protect</h2>
              <p className="text-gray-400 leading-relaxed text-sm">Smart weather alerts and pest diagnosis to keep your garden safe.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border-t-4 border-emerald-400 group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                <Icons.TrendingUp />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Grow</h2>
              <p className="text-gray-400 leading-relaxed text-sm">Track growth progress with beautiful photo journals and timelines.</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">Our Impact</h2>
        </div>
        
        <AccordionSection />

        <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-24">
          <div className="glass-card rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 relative z-10">Start your garden today</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10 text-lg">
              { "Download Green Grow and turn your thumbs green. It's free to start." }
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="glass w-full sm:w-80 px-6 py-4 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
              <button 
                className="bg-white text-green-900 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-colors duration-300 w-full sm:w-auto shadow-lg shadow-white/10"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-green-500"><Icons.Sprout /></span>
            <span className="font-display font-bold">Green Grow</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 Green Grow App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;