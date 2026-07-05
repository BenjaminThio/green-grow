'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapFilter, MapPin, PinStatus } from './types';

/*
 * Fixes vs. the old map:
 * - Icons are created ONCE at module level (the old code built a new
 *   L.DivIcon for every marker on every render, forcing Leaflet to tear
 *   down and recreate DOM nodes constantly — the main "buggy/janky" cause).
 * - Markers are keyed by pin.id, not array index, so React can reconcile
 *   them correctly when the filter changes.
 * - Filtering happens BEFORE render with useMemo instead of returning
 *   null inside the marker loop.
 * - <InvalidateSizeOnMount/> fixes the classic Leaflet grey-tiles bug when
 *   the map mounts inside a flex/animated container.
 * - Geolocation errors are handled instead of silently hanging.
 */

const STATUS_META: Record<PinStatus, { emoji: string; dot: string }> = {
    urgent: { emoji: '🔴', dot: '#ff0000' },
    medium: { emoji: '🟡', dot: '#ff9600' },
    healthy: { emoji: '🟢', dot: '#009600' },
    event: { emoji: '🔵', dot: '#001eff' }
};

const PIN_ICONS: Record<PinStatus, L.DivIcon> = Object.fromEntries(
    (Object.keys(STATUS_META) as PinStatus[]).map(status => [
        status,
        new L.DivIcon({
            className: 'bg-transparent',
            html: `<div class="hover:scale-125 transition-transform duration-200" style="font-size: 1.5rem; line-height: 1; cursor: pointer;">${STATUS_META[status].emoji}</div>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        })
    ])
) as Record<PinStatus, L.DivIcon>;

const USER_ICON = new L.DivIcon({
    className: 'bg-transparent',
    html: '<div style="font-size: 2rem; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const DEFAULT_CENTER: LatLngExpression = [3.1390, 101.6869]; // Kuala Lumpur

function InvalidateSizeOnMount() {
    const map = useMap();
    useEffect(() => {
        // Run after layout settles; also re-check on window resize.
        const t = setTimeout(() => map.invalidateSize(), 100);
        const onResize = () => map.invalidateSize();
        window.addEventListener('resize', onResize);
        return () => {
            clearTimeout(t);
            window.removeEventListener('resize', onResize);
        };
    }, [map]);
    return null;
}

function LocationMarker() {
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate()
            .on('locationfound', e => {
                setPosition(e.latlng);
                map.flyTo(e.latlng, 15);
            })
            .on('locationerror', () => {
                // Permission denied / unavailable: keep the default view.
            });
        return () => {
            map.stopLocate();
            map.off('locationfound').off('locationerror');
        };
    }, [map]);

    if (!position) return null;

    return (
        <Marker position={position} icon={USER_ICON}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

interface LeafletMapProps {
    pins: MapPin[];
    filter: MapFilter;
}

export default function LeafletMap({ pins, filter }: LeafletMapProps) {
    const visiblePins = useMemo(() => {
        if (filter === 'all') return pins;
        if (filter === 'events') return pins.filter(p => p.kind === 'event');
        return pins.filter(p => p.kind === 'report');
    }, [pins, filter]);

    return (
        <MapContainer
            center={DEFAULT_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%', background: '#e5e7eb' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <InvalidateSizeOnMount />
            <LocationMarker />

            {visiblePins.map(pin => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={PIN_ICONS[pin.status]}>
                    <Popup maxWidth={300} className="custom-popup">
                        <div className="w-full text-left font-sans">
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{
                                        background: STATUS_META[pin.status].dot,
                                        boxShadow: `0 0 5px ${STATUS_META[pin.status].dot}`
                                    }}
                                />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    {pin.kind}
                                </span>
                            </div>
                            <div className="text-green-800 font-bold text-lg mb-1">{pin.title}</div>
                            <div className="text-gray-600 mb-2 text-sm">
                                <span className="font-semibold text-green-700 block text-xs uppercase mb-1">Description</span>
                                {pin.description}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                    {pin.category}
                                </div>
                                <div className="text-gray-400 text-xs">{pin.date}</div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
