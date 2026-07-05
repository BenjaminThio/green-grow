'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 * A lush 3D particle tree for the landing hero.
 *
 * Rendered into whatever container the parent provides (landing-client
 * gives it a FIXED, full-viewport-height box on the right side), so it
 * never gets clipped by a small canvas and never vanishes on resize.
 * A ResizeObserver keeps the renderer/camera in sync with the container.
 *
 * Built from several point clouds for depth and richness:
 *   - a dense, layered conical canopy with organic 3D noise,
 *   - twinkling highlight sparkles near the lit tip,
 *   - a tapered trunk,
 *   - glowing spores drifting upward around the crown,
 *   - a soft ground glow.
 */
export default function TreeParticles() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        let width = container.clientWidth || window.innerWidth * 0.5;
        let height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 4, 20);
        camera.lookAt(0, 4, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const makeDot = (inner: string, outer: string) => {
            const s = 64;
            const c = document.createElement('canvas');
            c.width = c.height = s;
            const ctx = c.getContext('2d')!;
            const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
            g.addColorStop(0, inner);
            g.addColorStop(0.35, outer);
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, s, s);
            return new THREE.CanvasTexture(c);
        };
        const dotTex = makeDot('rgba(255,255,255,1)', 'rgba(200,255,170,0.85)');

        const group = new THREE.Group();
        scene.add(group);

        const deepGreen = new THREE.Color('#14532d');
        const midGreen = new THREE.Color('#22c55e');
        const limeGreen = new THREE.Color('#bef264');

        const CANOPY_BASE_Y = 1.0;
        const CANOPY_H = 11;
        const CANOPY_R = 5.0;

        // --- Canopy: dense layered cone with organic noise ---
        const canopyCount = 14000;
        const cPos = new Float32Array(canopyCount * 3);
        const cCol = new Float32Array(canopyCount * 3);

        for (let i = 0; i < canopyCount; i++) {
            const t = Math.pow(Math.random(), 0.7);
            const y = CANOPY_BASE_Y + t * CANOPY_H;
            const taper = 1 - t;
            const bulge = 1 + 0.35 * Math.sin(t * Math.PI);
            const maxR = CANOPY_R * taper * bulge;
            const ring = Math.random();
            const r = maxR * Math.pow(ring, 0.6);
            const theta = Math.random() * Math.PI * 2;
            const jitterR = (Math.random() - 0.5) * 0.9;
            const jitterY = (Math.random() - 0.5) * 0.8;
            const idx = i * 3;
            cPos[idx] = Math.cos(theta) * (r + jitterR);
            cPos[idx + 1] = y + jitterY;
            cPos[idx + 2] = Math.sin(theta) * (r + jitterR);
            const edge = maxR > 0 ? r / maxR : 0;
            const col = deepGreen.clone()
                .lerp(midGreen, t * 0.9 + 0.1)
                .lerp(limeGreen, Math.max(0, t - 0.35) * edge * 0.9);
            cCol[idx] = col.r;
            cCol[idx + 1] = col.g;
            cCol[idx + 2] = col.b;
        }
        const canopyGeo = new THREE.BufferGeometry();
        canopyGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
        canopyGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
        const canopyMat = new THREE.PointsMaterial({
            size: 0.13, map: dotTex, vertexColors: true, transparent: true,
            depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        group.add(new THREE.Points(canopyGeo, canopyMat));

        // --- Highlight sparkles near the tip ---
        const sparkleCount = 1200;
        const sPos = new Float32Array(sparkleCount * 3);
        for (let i = 0; i < sparkleCount; i++) {
            const t = 0.55 + Math.random() * 0.45;
            const y = CANOPY_BASE_Y + t * CANOPY_H;
            const maxR = CANOPY_R * (1 - t) * 1.2;
            const r = maxR * Math.sqrt(Math.random());
            const theta = Math.random() * Math.PI * 2;
            const idx = i * 3;
            sPos[idx] = Math.cos(theta) * r;
            sPos[idx + 1] = y;
            sPos[idx + 2] = Math.sin(theta) * r;
        }
        const sparkleGeo = new THREE.BufferGeometry();
        sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
        const sparkleMat = new THREE.PointsMaterial({
            size: 0.16, map: dotTex, color: new THREE.Color('#ecfccb'),
            transparent: true, opacity: 0.9, depthWrite: false,
            blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        group.add(new THREE.Points(sparkleGeo, sparkleMat));

        // --- Trunk ---
        const trunkCount = 1400;
        const tPos = new Float32Array(trunkCount * 3);
        const tCol = new Float32Array(trunkCount * 3);
        const trunkColor = new THREE.Color('#3f6212');
        for (let i = 0; i < trunkCount; i++) {
            const t = Math.random();
            const y = -5 + t * (CANOPY_BASE_Y + 5.5);
            const radius = 0.6 * (1 - t * 0.5);
            const theta = Math.random() * Math.PI * 2;
            const r = radius * Math.sqrt(Math.random());
            const idx = i * 3;
            tPos[idx] = Math.cos(theta) * r;
            tPos[idx + 1] = y;
            tPos[idx + 2] = Math.sin(theta) * r;
            const shade = 0.65 + Math.random() * 0.35;
            tCol[idx] = trunkColor.r * shade;
            tCol[idx + 1] = trunkColor.g * shade;
            tCol[idx + 2] = trunkColor.b * shade;
        }
        const trunkGeo = new THREE.BufferGeometry();
        trunkGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
        trunkGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3));
        const trunkMat = new THREE.PointsMaterial({
            size: 0.13, map: dotTex, vertexColors: true, transparent: true,
            depthWrite: false, blending: THREE.NormalBlending, sizeAttenuation: true
        });
        group.add(new THREE.Points(trunkGeo, trunkMat));

        // --- Drifting spores ---
        const sporeCount = 500;
        const spPos = new Float32Array(sporeCount * 3);
        const spSpeed = new Float32Array(sporeCount);
        for (let i = 0; i < sporeCount; i++) {
            const idx = i * 3;
            const r = 3 + Math.random() * 6;
            const theta = Math.random() * Math.PI * 2;
            spPos[idx] = Math.cos(theta) * r;
            spPos[idx + 1] = Math.random() * (CANOPY_H + 2);
            spPos[idx + 2] = Math.sin(theta) * r;
            spSpeed[i] = 0.3 + Math.random() * 0.8;
        }
        const sporeGeo = new THREE.BufferGeometry();
        sporeGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
        const sporeMat = new THREE.PointsMaterial({
            size: 0.13, map: dotTex, color: new THREE.Color('#a3e635'),
            transparent: true, opacity: 0.6, depthWrite: false,
            blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        group.add(new THREE.Points(sporeGeo, sporeMat));

        // --- Ground glow ---
        const groundCount = 600;
        const gPos = new Float32Array(groundCount * 3);
        for (let i = 0; i < groundCount; i++) {
            const idx = i * 3;
            const r = Math.sqrt(Math.random()) * 5;
            const theta = Math.random() * Math.PI * 2;
            gPos[idx] = Math.cos(theta) * r;
            gPos[idx + 1] = -5 + (Math.random() - 0.5) * 0.4;
            gPos[idx + 2] = Math.sin(theta) * r * 0.5;
        }
        const groundGeo = new THREE.BufferGeometry();
        groundGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
        const groundMat = new THREE.PointsMaterial({
            size: 0.14, map: dotTex, color: new THREE.Color('#166534'),
            transparent: true, opacity: 0.5, depthWrite: false,
            blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        group.add(new THREE.Points(groundGeo, groundMat));

        // --- pointer parallax ---
        const pointer = { x: 0, y: 0 };
        const onPointerMove = (e: PointerEvent) => {
            pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
            pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('pointermove', onPointerMove);

        const start = performance.now();
        let frameId = 0;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = (performance.now() - start) / 1000;
            const targetRotY = pointer.x * 0.35 + time * 0.06;
            const targetRotX = pointer.y * 0.12;
            group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
            group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
            group.position.x = Math.sin(time * 0.5) * 0.2;
            sparkleMat.opacity = 0.6 + Math.sin(time * 2.5) * 0.3;
            const sp = sporeGeo.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < sporeCount; i++) {
                let y = sp.getY(i) + spSpeed[i] * 0.012;
                if (y > CANOPY_H + 3) y = -1;
                sp.setY(i, y);
            }
            sp.needsUpdate = true;
            renderer.render(scene, camera);
        };
        animate();

        // --- keep in sync with container size (fixes clip / disappear) ---
        const resize = () => {
            width = container.clientWidth || window.innerWidth * 0.5;
            height = container.clientHeight || window.innerHeight;
            if (width === 0 || height === 0) return;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(frameId);
            ro.disconnect();
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
            renderer.domElement.remove();
            [canopyGeo, sparkleGeo, trunkGeo, sporeGeo, groundGeo].forEach(g => g.dispose());
            [canopyMat, sparkleMat, trunkMat, sporeMat, groundMat].forEach(m => m.dispose());
            dotTex.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
}
