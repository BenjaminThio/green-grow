'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, AlertTriangle, AlertCircle, Leaf, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { submitReport } from '@/lib/report-actions';
import type { ActionResult } from '@/lib/event-actions';
import { compressImage } from '@/lib/image';
import LocationPicker from '@/components/ui/location-picker';

/*
 * Real submission flow (the old form only faked an upload progress bar):
 * - photos are resized + JPEG-compressed in the browser (Firestore docs
 *   cap at 1 MB), previewed, and sent as hidden inputs;
 * - exact GPS coordinates are captured via LocationPicker so the report
 *   is pinned accurately on the Green Map;
 * - submission is a server action with useActionState for errors/pending.
 */

const initialState: ActionResult = { error: null, success: false };
const MAX_IMAGES = 3;

const CATEGORIES = [
    { value: 'tree-health', label: 'Tree Health' },
    { value: 'littering', label: 'Littering / Waste' },
    { value: 'facility-damage', label: 'Facility Damage' },
    { value: 'pest', label: 'Pest Infestation' }
];

export default function ReportForm() {
    const [state, formAction, pending] = useActionState(submitReport, initialState);
    const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
    const [images, setImages] = useState<string[]>([]);
    const [compressing, setCompressing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            setShowConfirmation(true);
            formRef.current?.reset();
            setImages([]);
            setSeverity('low');
            const t = setTimeout(() => setShowConfirmation(false), 3000);
            return () => clearTimeout(t);
        }
    }, [state]);

    const addPhoto = async (file: File | undefined) => {
        if (!file || images.length >= MAX_IMAGES) return;
        setCompressing(true);
        try {
            const compressed = await compressImage(file, 1024, 0.7);
            setImages(prev => [...prev, compressed]);
        } finally {
            setCompressing(false);
        }
    };

    return (
        <>
            <form ref={formRef} action={formAction} className="glass-card rounded-4xl p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Issue Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="e.g., Fallen tree blocking path"
                        className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="What happened? Any details that help resolve it faster…"
                        className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500 transition-all resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Category</label>
                    <div className="relative">
                        <select
                            name="category"
                            required
                            defaultValue=""
                            className="glass-input w-full px-4 py-3.5 rounded-xl appearance-none cursor-pointer text-white"
                        >
                            <option value="" disabled className="bg-gray-900 text-gray-500">Select category…</option>
                            {CATEGORIES.map(c => (
                                <option key={c.value} value={c.value} className="bg-gray-900">{c.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Leaf size={16} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Severity</label>
                    <input type="hidden" name="severity" value={severity} />
                    <div className="grid grid-cols-3 gap-3">
                        {(['low', 'medium', 'high'] as const).map(level => {
                            const isActive = severity === level;
                            const activeColor =
                                level === 'low' ? 'bg-green-500 border-green-400'
                                : level === 'medium' ? 'bg-yellow-500 border-yellow-400'
                                : 'bg-red-500 border-red-400';
                            const icon = level === 'low' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />;

                            return (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setSeverity(level)}
                                    className={`relative py-3 rounded-xl font-semibold text-sm capitalize transition-all duration-300 border flex flex-col items-center justify-center gap-1 ${
                                        isActive ? `${activeColor} text-white shadow-lg` : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {icon}
                                    {level}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Location</label>
                    <LocationPicker addressPlaceholder="e.g. Taman Seri Park, near the gate" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">
                        Evidence <span className="text-gray-500 normal-case">({images.length}/{MAX_IMAGES} photos)</span>
                    </label>

                    {images.map((img, i) => (
                        <input key={i} type="hidden" name="images" value={img} />
                    ))}

                    <div className="grid grid-cols-3 gap-3">
                        {images.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                                <Image src={img} alt={`Evidence ${i + 1}`} fill unoptimized className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                    aria-label="Remove photo"
                                    className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}

                        {images.length < MAX_IMAGES && (
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-400/50 hover:bg-white/5 transition-all gap-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={e => {
                                        addPhoto(e.target.files?.[0]);
                                        e.target.value = '';
                                    }}
                                />
                                {compressing
                                    ? <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                                    : <Camera className="w-5 h-5 text-gray-400" />}
                                <span className="text-[10px] text-gray-500">{compressing ? 'Compressing…' : 'Add photo'}</span>
                            </label>
                        )}
                    </div>
                </div>

                {state.error && (
                    <div role="alert" className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <AlertCircle size={16} className="shrink-0" /> {state.error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={pending || compressing}
                    className="w-full mt-4 bg-linear-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                    {pending ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Submitting…</span>
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            <span>Submit Report</span>
                        </>
                    )}
                </button>
            </form>

            {showConfirmation && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 glass-card px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up border border-green-500/30">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Report submitted — it&apos;s now pinned on the map!</span>
                </div>
            )}
        </>
    );
}
