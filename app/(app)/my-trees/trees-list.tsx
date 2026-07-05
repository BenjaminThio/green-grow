'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { Plus, Droplets, MapPin, X, Loader2, AlertCircle, Camera } from 'lucide-react';
import Image from 'next/image';
import { adoptTree, waterTree, addTreeUpdate } from '@/lib/tree-actions';
import type { ActionResult } from '@/lib/event-actions';
import { compressImage } from '@/lib/image';
import LocationPicker from '@/components/ui/location-picker';
import type { TreeDoc } from '@/lib/types';

const initialState: ActionResult = { error: null, success: false };

function timeAgo(ms: number): string {
    const diff = Date.now() - ms;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

function formatDate(ms: number): string {
    return new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLES: Record<TreeDoc['status'], string> = {
    Healthy: 'bg-green-500/20 border-green-400 text-green-300',
    'Needs Water': 'bg-yellow-500/20 border-yellow-400 text-yellow-300',
    Attention: 'bg-red-500/20 border-red-400 text-red-300'
};

export default function TreesList({ trees }: { trees: TreeDoc[] }) {
    const [adopting, setAdopting] = useState(false);
    const [noteTreeId, setNoteTreeId] = useState<string | null>(null);
    const [pendingWater, setPendingWater] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const handleWater = (treeId: string) => {
        setPendingWater(treeId);
        startTransition(async () => {
            await waterTree(treeId);
            setPendingWater(null);
        });
    };

    return (
        <>
            {trees.length === 0 && !adopting && (
                <div className="glass-card rounded-4xl p-10 text-center text-gray-400">
                    <p className="text-4xl mb-4">🌳</p>
                    <p className="font-semibold text-white mb-1">No trees yet</p>
                    <p className="text-sm">Adopt your first tree below and start tracking its progress.</p>
                </div>
            )}

            {trees.map(tree => {
                // Latest entries first — newest activity on top of the timeline.
                const updates = [...tree.updates].sort((a, b) => b.at - a.at);
                const lastUpdate = updates[0]?.at ?? tree.adoptedAt;

                return (
                    <div key={tree.id} className="glass-card rounded-4xl overflow-hidden">
                        <div className="relative h-48 w-full">
                            {tree.photoBase64 ? (
                                <Image src={tree.photoBase64} alt={tree.name} fill unoptimized className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-linear-to-br from-green-800 via-emerald-900 to-forest-950 flex items-center justify-center text-6xl">
                                    🌳
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-forest-900 via-transparent to-transparent" />
                            <div className="absolute top-4 right-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${STATUS_STYLES[tree.status]}`}>
                                    {tree.status}
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-2xl font-display font-bold text-white mb-1">{tree.name}</h3>
                                <div className="flex items-center text-xs text-gray-300 gap-3">
                                    <span className="flex items-center gap-1">🌿 {tree.species}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {tree.location.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-semibold text-green-300 text-sm uppercase tracking-wider">Progress</h4>
                                <span className="text-xs text-gray-500">Updated {timeAgo(lastUpdate)}</span>
                            </div>

                            <div className="space-y-6 relative pl-2">
                                <div className="absolute top-2 bottom-2 left-4.75 w-0.5 bg-white/10" />
                                {updates.slice(0, 5).map((update, index) => (
                                    <div key={`${update.at}-${index}`} className="flex gap-4 relative">
                                        <div className="shrink-0 w-3 h-3 mt-1.5 rounded-full bg-green-500 border-2 border-forest-900 z-10 relative left-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm text-gray-200 font-medium">{update.note}</p>
                                                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">{formatDate(update.at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setNoteTreeId(tree.id)}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all shadow-lg shadow-green-900/20"
                                >
                                    <Plus size={16} /> Update
                                </button>
                                <button
                                    onClick={() => handleWater(tree.id)}
                                    disabled={pendingWater === tree.id}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-sm transition-all disabled:opacity-60"
                                >
                                    {pendingWater === tree.id ? <Loader2 size={16} className="animate-spin" /> : <Droplets size={16} />} Water
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {adopting ? (
                <AdoptTreeForm onClose={() => setAdopting(false)} />
            ) : (
                <button
                    onClick={() => setAdopting(true)}
                    className="w-full py-4 rounded-3xl border-2 border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/5 text-gray-400 hover:text-green-400 font-medium transition-all flex items-center justify-center gap-2 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                        <Plus size={18} />
                    </div>
                    Adopt a New Tree
                </button>
            )}

            {noteTreeId && <UpdateNoteDialog treeId={noteTreeId} onClose={() => setNoteTreeId(null)} />}
        </>
    );
}

function AdoptTreeForm({ onClose }: { onClose: () => void }) {
    const [state, formAction, pending] = useActionState(adoptTree, initialState);
    const [photo, setPhoto] = useState<string | null>(null);
    const [compressing, setCompressing] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.success) onClose();
    }, [state, onClose]);

    return (
        <form action={formAction} className="glass-card rounded-4xl p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-display font-bold">Adopt a Tree 🌱</h3>
                <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                    <X size={16} />
                </button>
            </div>

            <input name="name" required placeholder="Nickname, e.g. Oakley" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500" />
            <input name="species" required placeholder="Species, e.g. White Oak" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500" />

            <LocationPicker required={false} addressPlaceholder="Where is it? e.g. Community Garden" />

            {photo && <input type="hidden" name="photo" value={photo} />}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCompressing(true);
                    try {
                        setPhoto(await compressImage(file, 800, 0.7));
                    } finally {
                        setCompressing(false);
                    }
                }}
            />
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-green-400/50 text-gray-300 text-sm transition-all"
            >
                {compressing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                {photo ? 'Photo added ✓ (tap to change)' : 'Add a photo (optional)'}
            </button>

            {state.error && (
                <div role="alert" className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" /> {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={pending || compressing}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/40 transition-all"
            >
                {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {pending ? 'Adopting…' : 'Adopt Tree'}
            </button>
        </form>
    );
}

function UpdateNoteDialog({ treeId, onClose }: { treeId: string; onClose: () => void }) {
    const [note, setNote] = useState('');
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const submit = () => {
        startTransition(async () => {
            const result = await addTreeUpdate(treeId, note);
            if (result.success) onClose();
            else setError(result.error);
        });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-card rounded-3xl p-6 w-full max-w-sm space-y-4 bg-forest-900/90">
                <h3 className="font-display font-bold text-lg">Log an update</h3>
                <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="e.g. Added fresh mulch layer."
                    className="glass-input w-full px-4 py-3 rounded-xl placeholder-gray-500 resize-none"
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={pending || note.trim().length < 2}
                        className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                        {pending && <Loader2 size={14} className="animate-spin" />} Save
                    </button>
                </div>
            </div>
        </div>
    );
}
