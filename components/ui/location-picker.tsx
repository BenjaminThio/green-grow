'use client';

import { useState } from 'react';
import { MapPin, LocateFixed, Loader2, AlertCircle } from 'lucide-react';

/*
 * Shared location capture used by the Report form, the Adopt-a-Tree form,
 * and the admin Create-Event form. Writes lat/lng/address into hidden
 * inputs so plain <form action={serverAction}> submission carries the
 * exact coordinates that end up pinned on the Green Map.
 */

interface LocationPickerProps {
    /** Require coordinates (report/event) or make them optional (tree). */
    required?: boolean;
    addressPlaceholder?: string;
}

export default function LocationPicker({ required = true, addressPlaceholder = 'e.g. Central Park, Zone A' }: LocationPickerProps) {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const locate = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }
        setLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            position => {
                setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                setLocating(false);
            },
            () => {
                setError('Could not get your location — please allow location access and try again.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div className="space-y-2">
            <input type="hidden" name="lat" value={coords?.lat ?? ''} />
            <input type="hidden" name="lng" value={coords?.lng ?? ''} />

            <input
                name="address"
                placeholder={addressPlaceholder}
                required
                className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500 transition-all"
            />

            <button
                type="button"
                onClick={locate}
                className={`w-full glass-input rounded-xl p-4 flex items-center gap-4 group transition-colors text-left ${coords ? 'border-green-500/40!' : 'hover:bg-white/10'}`}
            >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform shrink-0">
                    {locating ? <Loader2 size={20} className="animate-spin" /> : coords ? <MapPin size={20} /> : <LocateFixed size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                    {coords ? (
                        <>
                            <p className="text-sm font-semibold text-white">Location pinned ✓</p>
                            <p className="text-xs text-green-400 mt-0.5">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} — tap to refresh</p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-white">{locating ? 'Locating…' : 'Use my location'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {required ? 'Needed to pin this on the Green Map' : 'Optional — pins it on the Green Map'}
                            </p>
                        </>
                    )}
                </div>
            </button>

            {error && (
                <p role="alert" className="flex items-center gap-2 text-red-400 text-xs px-1">
                    <AlertCircle size={12} className="shrink-0" /> {error}
                </p>
            )}
        </div>
    );
}
