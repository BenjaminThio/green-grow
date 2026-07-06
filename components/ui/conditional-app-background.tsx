'use client';

import { usePathname } from 'next/navigation';
import AppBackground from './app-background';

/*
 * Renders the shared firefly background on every app page EXCEPT the map,
 * which fills the whole screen with an interactive Leaflet canvas, so the
 * particles would be pointless (and sit under an opaque map anyway).
 */
export default function ConditionalAppBackground() {
    const pathname = usePathname();
    if (pathname?.startsWith('/map')) return null;
    return <AppBackground />;
}
