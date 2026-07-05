'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { MapFilter, MapPin } from './types';

/*
 * Client wrapper that owns the filter state and dynamically imports
 * Leaflet with ssr: false (Leaflet touches `window` at import time, so
 * it can never run on the server). In Next 15, `ssr: false` is only
 * allowed inside client components — which is why this wrapper exists
 * and the page itself stays a server component.
 */
const LeafletMap = dynamic(() => import('./leaflet-map'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-full w-full bg-forest-950 text-green-300">
            <div className="text-lg font-semibold animate-pulse">Loading map…</div>
        </div>
    )
});

const FILTERS: { value: MapFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'events', label: 'Events' },
    { value: 'reports', label: 'Reports' }
];

export default function MapView({ pins }: { pins: MapPin[] }) {
    const [filter, setFilter] = useState<MapFilter>('all');

    return (
        /*
         * Flex column layout replaces the old hardcoded
         * height: calc(100vh - (72.79px + 52.8px + 76.79px)) pixel math,
         * which broke the moment the header or navbar changed size.
         * 5rem below matches the h-20 bottom navbar.
         */
        <div className="flex flex-col h-[calc(100dvh-5rem)]">
            <div className="glass-panel border-x-0 px-4 py-3 z-10">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                                filter === value
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
                                    : 'glass-pill text-green-100 hover:bg-white/15'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative z-0">
                <LeafletMap pins={pins} filter={filter} />
            </div>
        </div>
    );
}
