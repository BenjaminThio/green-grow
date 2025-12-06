'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { redirect } from 'next/navigation';
import Image from 'next/image';

interface MousePos {
  x: number;
  y: number;
}

const GlobalStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

    body { 
      margin: 0; 
      background-color: #050505; 
      color: white; 
      cursor: none; 
      overflow-x: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    #root, #__next {
      background-color: transparent;
      position: relative;
      z-index: 1;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #022c22; }
    ::-webkit-scrollbar-thumb { background: #166534; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #22c55e; }

    /* Custom Cursor Logic */
    #cursor { 
      pointer-events: none; 
      z-index: 9999; 
      mix-blend-mode: overlay; 
      transition: width 0.3s, height 0.3s, background 0.3s; 
      position: fixed;
      top: 0;
      left: 0;
    }
    .hovered #cursor-dot { 
      width: 80px; 
      height: 80px; 
      background: rgba(255, 255, 255, 0.2); 
      border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(2px); 
    }

    /* Disable custom cursor on touch devices */
    @media (pointer: coarse) {
      body { cursor: auto; }
      #cursor { display: none; }
    }

    .bg-image {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: -3;
      background-color: #050505; 
      background-image: url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
      filter: brightness(0.4) saturate(1.1);
      pointer-events: none;
    }

    .ambient-bg {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
      z-index: -1;
      overflow: hidden; pointer-events: none;
    }
    .gradient-blob {
      position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6;
    }
    .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #166534; animation: blob 20s infinite alternate; }
    .blob-2 { bottom: -10%; right: -10%; width: 600px; height: 600px; background: #14532d; animation: blob 25s infinite alternate-reverse; }

    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    .glass-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.01));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    .text-gradient {
      background: linear-gradient(to right, #4ade80, #bef264);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .font-display { font-family: 'Montserrat', sans-serif; }
    .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
    .animate-blob { animation: blob 20s infinite; }
  `}</style>
);

const Icons = {
  Sprout: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-3.3 3-6-2.3.5-4.5 2-6.2 3.4z"/></svg>,
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Shield: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
};

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

  return <div ref={mountRef} className="fixed inset-0 z-[-2] pointer-events-none" />;
};

const TreeParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const PARTICLE_COUNT = 2000; 
    const MOUSE_RADIUS = 120;
    const FRICTION = 0.85;
    const EASE = 0.08;

    const mouse = { x: -9999, y: -9999 };

    const BASE_COLOR = '#4ade80'; 
    const ACTIVE_COLOR = '#ecfccb';

    class Particle {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      baseSize: number;
      size: number;
      friction: number;
      ease: number;
      isHovered: boolean;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.tx = this.x; 
        this.ty = this.y; 
        this.vx = 0;       
        this.vy = 0;       
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        this.friction = FRICTION - Math.random() * 0.05; 
        this.ease = EASE + Math.random() * 0.02;
        this.isHovered = false;
      }

      update() {
        // 1. Move towards target (Home)
        const dx = this.tx - this.x;
        const dy = this.ty - this.y;
        this.vx += dx * this.ease;
        this.vy += dy * this.ease;

        // 2. Mouse Repulsion
        const dxMouse = mouse.x - this.x;
        const dyMouse = mouse.y - this.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < MOUSE_RADIUS) {
          this.isHovered = true;
          const force = (MOUSE_RADIUS - distMouse) / MOUSE_RADIUS;
          const angle = Math.atan2(dyMouse, dxMouse);
          const push = force * 40; 
          
          this.vx -= Math.cos(angle) * push;
          this.vy -= Math.sin(angle) * push;
          
          if (this.size < this.baseSize * 2) this.size += 0.2;
        } else {
          this.isHovered = false;
          if (this.size > this.baseSize) this.size -= 0.1;
        }

        // 3. Physics Steps
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.isHovered ? ACTIVE_COLOR : BASE_COLOR;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    const updateTargets = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width * 0.5; 
      const cy = height * 0.5;
      const scale = Math.min(width, height) * 0.75; 

      const A = { x: 0, y: -0.85 };      
      const B = { x: -0.45, y: 0.85 };    
      const C = { x: 0.45, y: 0.85 };    

      particles.forEach((p) => {
        const isTrunk = Math.random() > 0.88; 

        if (isTrunk) {
          const trunkW = scale * 0.1;
          const trunkH = scale * 0.2;
          const trunkYBase = cy + scale * 0.85; 
          
          const trunkJitter = 2; 
          p.tx = cx + (Math.random() - 0.5) * trunkW + (Math.random() - 0.5) * trunkJitter;
          p.ty = trunkYBase - Math.random() * trunkH;
        } else {
          const r1 = Math.random();
          const r2 = Math.random();
          const sqrtR1 = Math.sqrt(r1);
          
          const px = (1 - sqrtR1) * A.x + (sqrtR1 * (1 - r2)) * B.x + (sqrtR1 * r2) * C.x;
          const py = (1 - sqrtR1) * A.y + (sqrtR1 * (1 - r2)) * B.y + (sqrtR1 * r2) * C.y;
          
          const jitter = 3; 
          p.tx = cx + px * scale + (Math.random() - 0.5) * jitter;
          p.ty = cy + py * scale + (Math.random() - 0.5) * jitter;
        }
      });
    };

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      updateTargets();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i += 20) { 
         const p = particles[i];
         const dx = mouse.x - p.x;
         const dy = mouse.y - p.y;
         const dist = dx*dx + dy*dy;
         
         if (dist < (MOUSE_RADIUS * MOUSE_RADIUS * 0.8)) {
           ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.stroke();
         }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] flex items-center justify-center animate-float">
        <div className="absolute w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <canvas ref={canvasRef} className="absolute inset-0 z-10" />
    </div>
  );
};


const AccordionSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { title: 'Carbon Sink', desc: 'Forests are the most efficient carbon capture technology on Earth.', img: 'https://cdn.wallpapersafari.com/50/71/DI579Z.jpg' },
    { title: 'Water Security', desc: 'Roots act as filtration systems, providing clean groundwater for millions.', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948' },
    { title: 'Biodiversity', desc: 'Protecting habitats for thousands of endangered species.', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026' }
  ];

  return (
    <div className="w-full h-[600px] flex flex-col md:flex-row gap-4 max-w-7xl mx-auto px-6 mb-24">
      {items.map((item, i) => (
        <div 
          key={i} 
          onMouseEnter={() => setActiveIndex(i)}
          className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeIndex === i ? 'flex-3' : 'flex-1'} group`}
        >
          <Image src={item.img} alt={item.title} fill className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
  const mouseRef = useRef<THREE.Vector3>(new THREE.Vector3(9999, 9999, 0));
  const [cursorPos, setCursorPos] = useState<MousePos>({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    const x = (e.clientX / window.innerWidth - 0.5) * 60; 
    const y = -(e.clientY / window.innerHeight - 0.5) * 40;
    mouseRef.current.set(x, y, 0);
  };

  const onHoverStart = () => setHovered(true);
  const onHoverEnd = () => setHovered(false);

  return (
    <div onMouseMove={handleMouseMove} className="min-h-screen relative font-sans text-white bg-transparent overflow-x-hidden">
      <GlobalStyles />
      
      <div 
        id="cursor" 
        className={`fixed top-0 left-0 w-4 h-4 bg-white rounded-full z-100 ${hovered ? 'hovered' : ''}`}
        style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)` }}
      >
        <div id="cursor-dot" className="w-1 h-1 bg-white rounded-full"></div>
      </div>

      <div className="bg-image"></div>

      <div className="ambient-bg">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
      </div>

      <ThreeBackground mouseRef={mouseRef} />

      {/*
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'glass shadow-lg py-2' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-green-900/50 rounded-tr-3xl rounded-bl-3xl">
              <span className="text-white"><Icons.Sprout /></span>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Green<span className="text-green-400">Grow</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Community', 'Mission'].map(item => (
              <a key={item} href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>{item}</a>
            ))}
            <button className="glass px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-white/10 transition-all border border-white/20" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
              Download App <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </nav>       
      */}

      <main className="relative pt-32 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left">
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
                    onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}
                    className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                    onClick={() => {redirect('/sign-up');}} 
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => {
                      redirect('/sign-in');
                    }}
                    onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}
                    className="glass px-8 py-4 rounded-full font-bold text-white hover:bg-white/10 transition-all w-full sm:w-auto"
                  >
                    Sign In
                  </button>
                </>
                :
                <button 
                  onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}
                  className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  onClick={() => {redirect('/home');}} 
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

          <div className="flex-1 relative w-full max-w-md lg:max-w-full">
            <TreeParticles />
            
            <div className="absolute top-20 -left-12 glass-card p-4 rounded-2xl animate-float-delayed hidden sm:block">
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
            <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border-t-4 border-green-400 group" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-green-400">
                <Icons.Sprout />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Identify</h2>
              <p className="text-gray-400 leading-relaxed text-sm">Access a database of 10,000+ species. Snap a photo and identify instantly.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border-t-4 border-lime-400 group" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
              <div className="w-14 h-14 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-lime-400">
                <Icons.Shield />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Protect</h2>
              <p className="text-gray-400 leading-relaxed text-sm">Smart weather alerts and pest diagnosis to keep your garden safe.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border-t-4 border-emerald-400 group" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
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
                onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}
              />
              <button 
                className="bg-white text-green-900 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-colors duration-300 w-full sm:w-auto shadow-lg shadow-white/10"
                onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}
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