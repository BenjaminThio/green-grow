'use client';
import { useState } from 'react';
import { 
    MapPin, 
    Users, 
    Share2, 
    Check, 
    Clock, 
    Leaf
} from 'lucide-react';
import Image from 'next/image';

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    volunteers: number;
    organizer: string;
    image: string;
    tools: string[];
}

const MOCK_EVENTS: Event[] = [
    {
        id: 1,
        title: "Community Park Cleanup",
        date: "Sat, Oct 28",
        time: "09:00 AM",
        location: "Central Park, Zone A",
        volunteers: 24,
        organizer: "Green Earth NGO",
        image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80",
        tools: ["Gloves", "Trash Bags", "Rake"]
    },
    {
        id: 2,
        title: "Urban Tree Planting",
        date: "Sun, Nov 05",
        time: "08:30 AM",
        location: "Riverside Walkway",
        volunteers: 15,
        organizer: "City Council",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&w=800&q=80",
        tools: ["Shovel", "Watering Can", "Gloves"]
    },
    {
        id: 3,
        title: "Composting Workshop",
        date: "Wed, Nov 08",
        time: "05:00 PM",
        location: "Community Center",
        volunteers: 40,
        organizer: "EcoLife Group",
        image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
        tools: ["Notebook", "Container"]
    }
];

export default function EventsPage() {
    const [events] = useState<Event[]>(MOCK_EVENTS);
    const [joinedEvents, setJoinedEvents] = useState<Set<number>>(new Set());
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleJoinEvent = (id: number) => {
        setJoinedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
                setShowConfirmation(true);
                setTimeout(() => setShowConfirmation(false), 3000);
            }
            return newSet;
        });
    };

    const handleShareEvent = (id: number) => {
        console.log(`Sharing event ${id}`);
    };

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
                
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                h1, h2, h3, .font-display { font-family: 'Montserrat', sans-serif; }

                /* Ambient Background */
                .ambient-bg {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
                    background: radial-gradient(circle at 15% 50%, rgba(22, 163, 74, 0.15), transparent 25%),
                                radial-gradient(circle at 85% 30%, rgba(163, 230, 53, 0.1), transparent 25%);
                    background-color: #022c22; pointer-events: none;
                }

                .gradient-blob {
                    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; z-index: -1;
                }
                .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #166534; animation: blob 20s infinite alternate; }
                .blob-2 { bottom: -10%; right: -10%; width: 600px; height: 600px; background: #14532d; animation: blob 25s infinite alternate-reverse; }

                /* Glass Utilities */
                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                
                .glass-pill {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(4px);
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
            `}</style>
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
                    {events.map((event) => (
                        <div key={event.id} className="glass-card rounded-4xl overflow-hidden group hover:bg-white/5 transition-colors duration-300">
                            <div className="relative h-40 w-full overflow-hidden">
                                <Image 
                                    src={event.image} 
                                    alt={event.title}
                                    fill
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#052e16] to-transparent"></div>
                                <div className="absolute bottom-3 left-4">
                                    <h3 className="text-xl font-display font-bold text-white leading-tight">{event.title}</h3>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-300">
                                        <div className="w-8 flex justify-center mr-1">
                                            <Clock className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span>{event.date} • {event.time}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <div className="w-8 flex justify-center mr-1">
                                            <MapPin className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <div className="w-8 flex justify-center mr-1">
                                            <Users className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span>{event.volunteers} volunteers joined</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <div className="w-8 flex justify-center mr-1">
                                            <Leaf className="w-4 h-4 text-lime-400" />
                                        </div>
                                        <span>Organized by {event.organizer}</span>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Recommended Tools</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tools.map((tool, index) => (
                                            <span 
                                                key={index}
                                                className="glass-pill text-xs px-3 py-1.5 rounded-full text-green-100 border-white/5"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleJoinEvent(event.id)}
                                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                                            joinedEvents.has(event.id)
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                                                : 'bg-green-600 text-white hover:bg-green-500 shadow-green-900/20'
                                        }`}
                                    >
                                        {joinedEvents.has(event.id) ? (
                                            <>Cancel</>
                                        ) : (
                                            <>
                                                Join Event
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleShareEvent(event.id)}
                                        className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
            {showConfirmation && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 glass-card px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up border border-green-500/30">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Event added to your calendar!</span>
                </div>
            )}
        </div>
    );
}