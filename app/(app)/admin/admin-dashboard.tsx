'use client';

import { useActionState, useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import {
    CalendarDays, MapPin, Users, Plus, X, Loader2, AlertCircle, CheckCircle2,
    FileWarning, LocateFixed, Clock, Wrench, Ban, Flag
} from 'lucide-react';
import { createEvent, setEventStatus } from '@/lib/event-actions';
import { updateReportStatus } from '@/lib/report-actions';
import type { ActionResult } from '@/lib/event-actions';
import { distanceKm, formatDistance } from '@/lib/geo';
import LocationPicker from '@/components/ui/location-picker';
import type { EventDoc, ReportDoc, ReportStatus } from '@/lib/types';

const initialState: ActionResult = { error: null, success: false };

interface AdminDashboardProps {
    events: EventDoc[];
    reports: ReportDoc[];
}

export default function AdminDashboard({ events, reports }: AdminDashboardProps) {
    const [tab, setTab] = useState<'activities' | 'reports'>('activities');
    const pendingCount = reports.filter(r => r.status !== 'resolved').length;

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-6">
                    <div className="glass-panel border-x-0 sm:border-x sm:rounded-2xl p-1.5 flex gap-1.5">
                        <TabButton active={tab === 'activities'} onClick={() => setTab('activities')} icon={CalendarDays} label="Activities" />
                        <TabButton active={tab === 'reports'} onClick={() => setTab('reports')} icon={FileWarning} label="Reports" badge={pendingCount} />
                    </div>

                    {tab === 'activities' ? <ActivitiesTab events={events} /> : <ReportsTab reports={reports} />}
                </main>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string; badge?: number }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                active ? 'bg-green-600 text-white shadow-lg shadow-green-900/40' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <Icon size={16} /> {label}
            {badge !== undefined && badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
            )}
        </button>
    );
}

/* ============================================================
   Activities: create events that populate the public Event page
   ============================================================ */

function ActivitiesTab({ events }: { events: EventDoc[] }) {
    const [creating, setCreating] = useState(false);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const changeStatus = (id: string, status: EventDoc['status']) => {
        setPendingId(id);
        startTransition(async () => {
            await setEventStatus(id, status);
            setPendingId(null);
        });
    };

    return (
        <div className="space-y-4">
            {creating ? (
                <CreateEventForm onClose={() => setCreating(false)} />
            ) : (
                <button
                    onClick={() => setCreating(true)}
                    className="w-full py-4 rounded-3xl border-2 border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/5 text-gray-400 hover:text-green-400 font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Create New Activity
                </button>
            )}

            {events.length === 0 && !creating && (
                <div className="glass-card rounded-3xl p-8 text-center text-gray-400 text-sm">
                    No activities yet — create the first one above and it will appear on the public Events page and the Green Map.
                </div>
            )}

            {events.map(event => (
                <div key={event.id} className="glass-card rounded-3xl p-5">
                    <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="min-w-0">
                            <h3 className="font-display font-bold text-white truncate">{event.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{event.category} • by {event.organizer}</p>
                        </div>
                        <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            event.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : event.status === 'completed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                            : 'bg-red-500/20 text-red-400 border-red-500/50'
                        }`}>
                            {event.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-300 mb-4">
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-green-400" /> {event.date} {event.time}</span>
                        <span className="flex items-center gap-1.5 truncate"><MapPin size={12} className="text-emerald-400" /> {event.location.address}</span>
                        <span className="flex items-center gap-1.5"><Users size={12} className="text-blue-400" /> {event.participants.length} joined</span>
                    </div>

                    {event.status === 'active' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => changeStatus(event.id, 'completed')}
                                disabled={pendingId === event.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold hover:bg-blue-500/25 transition-colors disabled:opacity-50"
                            >
                                <CheckCircle2 size={14} /> Mark Completed
                            </button>
                            <button
                                onClick={() => changeStatus(event.id, 'cancelled')}
                                disabled={pendingId === event.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold hover:bg-red-500/25 transition-colors disabled:opacity-50"
                            >
                                <Ban size={14} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function CreateEventForm({ onClose }: { onClose: () => void }) {
    const [state, formAction, pending] = useActionState(createEvent, initialState);

    useEffect(() => {
        if (state.success) onClose();
    }, [state, onClose]);

    return (
        <form action={formAction} className="glass-card rounded-3xl p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-lg">New Activity</h3>
                <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                    <X size={16} />
                </button>
            </div>

            <input name="title" required placeholder="Title, e.g. Community Park Cleanup" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500" />
            <textarea name="description" rows={2} placeholder="Short description volunteers will see" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500 resize-none" />

            <div className="grid grid-cols-2 gap-3">
                <input name="category" placeholder="Category, e.g. Cleanup" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500" />
                <input name="organizer" placeholder="Organizer name" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <label className="block">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider ml-1">Date</span>
                    <input name="date" type="date" required className="glass-input w-full px-4 py-3 rounded-xl mt-1 scheme-dark" />
                </label>
                <label className="block">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider ml-1">Time</span>
                    <input name="time" type="time" required className="glass-input w-full px-4 py-3 rounded-xl mt-1 scheme-dark" />
                </label>
            </div>

            <LocationPicker addressPlaceholder="Venue, e.g. Central Park, Zone A" />

            <div className="relative">
                <Wrench size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input name="tools" placeholder="Recommended tools, comma-separated" className="glass-input w-full pl-10 pr-4 py-3.5 rounded-xl placeholder-gray-500" />
            </div>
            <input name="imageUrl" type="url" placeholder="Cover image URL (optional)" className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500" />

            {state.error && (
                <div role="alert" className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" /> {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/40 transition-all"
            >
                {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {pending ? 'Publishing…' : 'Publish Activity'}
            </button>
        </form>
    );
}

/* ============================================================
   Reports: triage user submissions, sorted by proximity
   ============================================================ */

const SEVERITY_BADGES = {
    high: 'bg-red-500/20 text-red-400 border-red-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    low: 'bg-green-500/20 text-green-400 border-green-500/50'
} as const;

const STATUS_BADGES: Record<ReportStatus, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/50'
};

function ReportsTab({ reports }: { reports: ReportDoc[] }) {
    const [statusFilter, setStatusFilter] = useState<'open' | 'all'>('open');
    const [adminPos, setAdminPos] = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);
    const [resolving, setResolving] = useState<ReportDoc | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const locate = () => {
        setLocating(true);
        navigator.geolocation?.getCurrentPosition(
            position => {
                setAdminPos({ lat: position.coords.latitude, lng: position.coords.longitude });
                setLocating(false);
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const visible = useMemo(() => {
        const filtered = statusFilter === 'open' ? reports.filter(r => r.status !== 'resolved') : reports;
        if (!adminPos) return filtered;
        // Nearby-first: lets organizers act on what's around them.
        return [...filtered].sort((a, b) => distanceKm(adminPos, a.location) - distanceKm(adminPos, b.location));
    }, [reports, statusFilter, adminPos]);

    const markInProgress = (report: ReportDoc) => {
        setPendingId(report.id);
        startTransition(async () => {
            await updateReportStatus(report.id, 'in-progress', 'An organizer is looking into this.');
            setPendingId(null);
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button
                    onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
                    className="glass-pill px-4 py-2 rounded-full text-xs font-bold text-green-100 hover:bg-white/15 transition-colors"
                >
                    {statusFilter === 'open' ? 'Showing: Open' : 'Showing: All'}
                </button>
                <button
                    onClick={locate}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                        adminPos ? 'bg-green-600 text-white' : 'glass-pill text-green-100 hover:bg-white/15'
                    }`}
                >
                    {locating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                    {adminPos ? 'Sorted by distance' : 'Sort by nearest'}
                </button>
            </div>

            {visible.length === 0 && (
                <div className="glass-card rounded-3xl p-8 text-center text-gray-400 text-sm">
                    No {statusFilter === 'open' ? 'open ' : ''}reports right now. 🎉
                </div>
            )}

            {visible.map(report => (
                <div key={report.id} className="glass-card rounded-3xl overflow-hidden">
                    {report.imageBase64s.length > 0 && (
                        <div className="relative h-36 w-full">
                            <Image src={report.imageBase64s[0]} alt={report.title} fill unoptimized className="object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-forest-900 to-transparent" />
                        </div>
                    )}

                    <div className="p-5">
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-display font-bold text-white">{report.title}</h3>
                            <div className="flex gap-1.5 shrink-0">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${SEVERITY_BADGES[report.severity]}`}>
                                    {report.severity}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_BADGES[report.status]}`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>

                        {report.description && <p className="text-sm text-gray-400 mb-3">{report.description}</p>}

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-1"><Flag size={12} /> {report.category}</span>
                            <span className="flex items-center gap-1"><Users size={12} /> {report.reporterName}</span>
                            <span className="flex items-center gap-1">
                                <MapPin size={12} /> {report.location.address}
                                {adminPos && <span className="text-green-400 font-bold ml-1">{formatDistance(distanceKm(adminPos, report.location))} away</span>}
                            </span>
                        </div>

                        {report.status !== 'resolved' && (
                            <div className="flex gap-2">
                                {report.status === 'pending' && (
                                    <button
                                        onClick={() => markInProgress(report)}
                                        disabled={pendingId === report.id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold hover:bg-blue-500/25 transition-colors disabled:opacity-50"
                                    >
                                        {pendingId === report.id ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />} Start Working
                                    </button>
                                )}
                                <button
                                    onClick={() => setResolving(report)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-bold hover:bg-green-500/25 transition-colors"
                                >
                                    <CheckCircle2 size={14} /> Resolve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {resolving && <ResolveDialog report={resolving} onClose={() => setResolving(null)} />}
        </div>
    );
}

function ResolveDialog({ report, onClose }: { report: ReportDoc; onClose: () => void }) {
    const [note, setNote] = useState('');
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const resolve = () => {
        startTransition(async () => {
            const result = await updateReportStatus(report.id, 'resolved', note);
            if (result.success) onClose();
            else setError(result.error);
        });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-card rounded-3xl p-6 w-full max-w-sm space-y-4 bg-forest-900/90">
                <h3 className="font-display font-bold text-lg">Resolve &ldquo;{report.title}&rdquo;</h3>
                <p className="text-xs text-gray-400">The reporter will be notified. Resolved reports leave the Green Map.</p>
                <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="Resolution note (optional), e.g. Debris cleared by city crew."
                    className="glass-input w-full px-4 py-3 rounded-xl placeholder-gray-500 resize-none"
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={resolve}
                        disabled={pending}
                        className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                        {pending && <Loader2 size={14} className="animate-spin" />} Resolve
                    </button>
                </div>
            </div>
        </div>
    );
}
