'use client';

import { useState, useTransition } from 'react';
import { MapPin, Users, Share2, Check, Clock, Leaf, CalendarDays, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { joinEvent, leaveEvent } from '@/lib/event-actions';
import type { EventDoc } from '@/lib/types';

interface EventsClientProps {
    events: EventDoc[];
    userEmail: string | null;
}

function formatEventDate(iso: string): string {
    const date = new Date(`${iso}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? iso
        : date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function EventsClient({ events, userEmail }: EventsClientProps) {
    // Optimistic overlay on top of the server-provided participant lists.
    const [optimistic, setOptimistic] = useState<Record<string, boolean>>({});
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const isJoined = (event: EventDoc) =>
        optimistic[event.id] ?? (userEmail !== null && event.participants.includes(userEmail as never));

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleJoin = (event: EventDoc) => {
        const joining = !isJoined(event);
        setOptimistic(prev => ({ ...prev, [event.id]: joining }));
        setPendingId(event.id);

        startTransition(async () => {
            const result = joining ? await joinEvent(event.id) : await leaveEvent(event.id);
            setPendingId(null);
            if (!result.success) {
                setOptimistic(prev => ({ ...prev, [event.id]: !joining })); // roll back
                showToast(result.error ?? 'Something went wrong.');
            } else if (joining) {
                showToast('Event added to your calendar!');
            }
        });
    };

    const shareEvent = async (event: EventDoc) => {
        const text = `${event.title} — ${formatEventDate(event.date)} ${event.time} @ ${event.location.address}`;
        if (navigator.share) {
            await navigator.share({ title: event.title, text }).catch(() => {});
        } else {
            await navigator.clipboard.writeText(text);
            showToast('Event details copied!');
        }
    };

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
                    {events.length === 0 && (
                        <div className="glass-card rounded-4xl p-10 text-center text-gray-400">
                            <CalendarDays className="w-10 h-10 mx-auto mb-4 opacity-50" />
                            <p className="font-semibold text-white mb-1">No upcoming events yet</p>
                            <p className="text-sm">Check back soon — organizers post new activities here.</p>
                        </div>
                    )}

                    {events.map(event => {
                        const joined = isJoined(event);
                        // Adjust the count for optimistic joins/leaves.
                        const baseCount = event.participants.length;
                        const serverJoined = userEmail !== null && event.participants.includes(userEmail as never);
                        const count = baseCount + (joined && !serverJoined ? 1 : 0) - (!joined && serverJoined ? 1 : 0);

                        return (
                            <div key={event.id} className="glass-card rounded-4xl overflow-hidden group hover:bg-white/5 transition-colors duration-300">
                                <div className="relative h-40 w-full overflow-hidden">
                                    {event.imageUrl ? (
                                        <Image
                                            src={event.imageUrl}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 512px"
                                            unoptimized
                                            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-linear-to-br from-green-800 via-emerald-900 to-forest-950 flex items-center justify-center">
                                            <Leaf className="w-14 h-14 text-green-500/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-forest-900 to-transparent" />
                                    <div className="absolute top-3 right-3 glass-pill text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-green-200">
                                        {event.category}
                                    </div>
                                    <div className="absolute bottom-3 left-4">
                                        <h3 className="text-xl font-display font-bold text-white leading-tight">{event.title}</h3>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {event.description && (
                                        <p className="text-sm text-gray-400 mb-4">{event.description}</p>
                                    )}

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-300">
                                            <div className="w-8 flex justify-center mr-1"><Clock className="w-4 h-4 text-green-400" /></div>
                                            <span>{formatEventDate(event.date)} • {event.time}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-300">
                                            <div className="w-8 flex justify-center mr-1"><MapPin className="w-4 h-4 text-emerald-400" /></div>
                                            <span>{event.location.address}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-300">
                                            <div className="w-8 flex justify-center mr-1"><Users className="w-4 h-4 text-blue-400" /></div>
                                            <span>{count} volunteer{count === 1 ? '' : 's'} joined</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-300">
                                            <div className="w-8 flex justify-center mr-1"><Leaf className="w-4 h-4 text-lime-400" /></div>
                                            <span>Organized by {event.organizer}</span>
                                        </div>
                                    </div>

                                    {event.tools.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Recommended Tools</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {event.tools.map(tool => (
                                                    <span key={tool} className="glass-pill text-xs px-3 py-1.5 rounded-full text-green-100 border-white/5">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => toggleJoin(event)}
                                            disabled={pendingId === event.id}
                                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 ${
                                                joined
                                                    ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                                                    : 'bg-green-600 text-white hover:bg-green-500 shadow-green-900/20'
                                            }`}
                                        >
                                            {pendingId === event.id ? <Loader2 size={16} className="animate-spin" /> : joined ? 'Cancel' : 'Join Event'}
                                        </button>
                                        <button
                                            onClick={() => shareEvent(event)}
                                            aria-label="Share event"
                                            className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>

            {toast && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 glass-card px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up border border-green-500/30">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">{toast}</span>
                </div>
            )}
        </div>
    );
}
