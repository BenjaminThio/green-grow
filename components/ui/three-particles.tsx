'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 * Floating firefly particle field. This ~100-line component was
 * copy-pasted into the landing, home, and gaia pages; it now lives
 * in exactly one place. Import it with next/dynamic (ssr: false) so
 * three.js (~600 kB) stays out of the initial bundle:
 *
 *   const ThreeParticles = dynamic(() => import('@/components/ui/three-particles'), { ssr: false });
 */

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

interface ThreeParticlesProps {
    /** Optional shared mouse vector for the repulsion effect. */
    mouseRef?: React.RefObject<THREE.Vector3>;
    /** Particle count — lower it on content-heavy pages. */
    count?: number;
}

export default function ThreeParticles({ mouseRef, count = 400 }: ThreeParticlesProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const internalMouse = useRef(new THREE.Vector3(9999, 9999, 0));
    const mouse = mouseRef ?? internalMouse;

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const range = 60;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const randomness = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * range;
            positions[i * 3 + 1] = (Math.random() - 0.5) * range;
            positions[i * 3 + 2] = (Math.random() - 0.5) * range * 0.5;
            sizes[i] = Math.random() * 2 + 0.5;
            randomness[i * 3] = Math.random();
            randomness[i * 3 + 1] = Math.random();
            randomness[i * 3 + 2] = Math.random();
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
        // THREE.Clock is deprecated in r177+; track elapsed seconds ourselves.
        const startTime = performance.now();
        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            material.uniforms.uTime.value = (performance.now() - startTime) / 1000;
            material.uniforms.uMouse.value.lerp(mouse.current, 0.1);
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
            renderer.domElement.remove();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [count, mouse]);

    return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
