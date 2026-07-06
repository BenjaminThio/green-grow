'use client';

import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import dynamic from 'next/dynamic';
import AmbientBackground from './ambient-background';

/*
 * The shared app background: ambient gradient blobs + the interactive
 * firefly particle field. Rendered ONCE by the (app) and (auth) layouts
 * so every page shares the exact same living background — only the page
 * content changes when navigating.
 *
 * It's fully self-contained (owns its own mouse tracking), so pages don't
 * need to render or wire up anything. three.js is loaded client-side only
 * (ssr:false) and stays out of the initial bundle.
 */
const ThreeParticles = dynamic(() => import('./three-particles'), { ssr: false });

export default function AppBackground() {
    const mouseRef = useRef<Vector3>(new Vector3(9999, 9999, 0));

    useEffect(() => {
        const onPointerMove = (e: PointerEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 60;
            const y = -(e.clientY / window.innerHeight - 0.5) * 40;
            mouseRef.current.set(x, y, 0);
        };
        window.addEventListener('pointermove', onPointerMove);
        return () => window.removeEventListener('pointermove', onPointerMove);
    }, []);

    return (
        <>
            {/* AmbientBackground is fixed at z-index:-10 (opaque forest base +
                blob gradients). ThreeParticles renders its own fixed canvas.
                Both sit behind page content, which uses z-10. */}
            <AmbientBackground />
            <ThreeParticles mouseRef={mouseRef} />
        </>
    );
}
