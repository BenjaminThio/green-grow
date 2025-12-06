'use client';
import { useState } from 'react';
import { 
    Calendar, 
    MapPin, 
    Users, 
    Search, 
    Filter, 
    Check, 
    X, 
    Clock, 
    AlertCircle, 
    MoreHorizontal,
    Leaf
} from 'lucide-react';

interface UserInfo {
    name: string;
    role: 'admin' | 'user' | 'local_authority';
}

interface Event {
    id: number;
    title: string;
    description: string;
    organizer: string;
    organizerType: 'ngo' | 'school' | 'ra' | 'citizen' | 'local_authority';
    date: string;
    location: string;
    participants: number;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
}

const MOCK_EVENTS: Event[] = [
    {
        id: 1,
        title: "Community Park Cleanup",
        description: "Join us to clean up Central Park and plant new shrubs.",
        organizer: "Green Earth NGO",
        organizerType: "ngo",
        date: "2023-11-15",
        location: "Central Park",
        participants: 45,
        status: "pending"
    },
    {
        id: 2,
        title: "Neighborhood Tree Planting",
        description: "Planting 50 oak trees along Main Street.",
        organizer: "Taman Tun RA",
        organizerType: "ra",
        date: "2023-11-20",
        location: "Main Street",
        participants: 120,
        status: "approved"
    },
    {
        id: 3,
        title: "River Cleaning Drive",
        description: "Removing plastic waste from the river banks.",
        organizer: "Local High School",
        organizerType: "school",
        date: "2023-10-05",
        location: "River Side",
        participants: 30,
        status: "rejected",
        rejectionReason: "Safety concerns during monsoon season."
    },
    {
        id: 4,
        title: "Urban Farming Workshop",
        description: "Learn to grow your own vegetables in small spaces.",
        organizer: "City Council",
        organizerType: "local_authority",
        date: "2023-12-01",
        location: "Community Hall",
        participants: 25,
        status: "pending"
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
        case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
        default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
};

const getOrganizerBadge = (type: string) => {
    const colors: Record<string, string> = {
        ngo: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        school: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        ra: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        citizen: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        local_authority: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[type] || 'bg-white/10 text-gray-300';
};

export default function EventsPage() {
    const [currentUser] = useState<UserInfo>({ name: 'Admin User', role: 'local_authority' });
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [filters, setFilters] = useState({ search: '', status: '', organizerType: '', date: '' });
    
    const handleAction = (id: number, action: 'approve' | 'reject') => {
        setEvents(prev => prev.map(ev => 
            ev.id === id ? { ...ev, status: action === 'approve' ? 'approved' : 'rejected' } : ev
        ));
    };

    const filteredEvents = events.filter(event => {
        return (
            (filters.search === '' || event.title.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.status === '' || event.status === filters.status) &&
            (filters.organizerType === '' || event.organizerType === filters.organizerType) &&
            (filters.date === '' || event.date === filters.date)
        );
    });

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                h1, h2, h3, .font-display { font-family: 'Montserrat', sans-serif; }
                
                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                .glass-input {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .glass-input:focus {
                    background: rgba(0, 0, 0, 0.5);
                    border-color: rgba(74, 222, 128, 0.5);
                    outline: none;
                }
            `}</style>

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(22,163,74,0.15),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(163,230,53,0.1),transparent_25%)]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen pb-24">

                <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total Events", value: events.length, color: "bg-blue-500", icon: Calendar },
                            { label: "Pending", value: events.filter(e => e.status === 'pending').length, color: "bg-yellow-500", icon: Clock },
                            { label: "Approved", value: events.filter(e => e.status === 'approved').length, color: "bg-green-500", icon: Check },
                            { label: "Rejected", value: events.filter(e => e.status === 'rejected').length, color: "bg-red-500", icon: AlertCircle },
                        ].map((stat, idx) => (
                            <div key={idx} className="glass-card rounded-2xl p-5 flex items-center hover:bg-white/5 transition-colors">
                                <div className={`shrink-0 ${stat.color} p-3 rounded-xl shadow-lg shadow-black/20`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <label className="block text-xs font-medium text-green-400 mb-1 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                                        placeholder="Search events..."
                                        className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-green-400 mb-1 uppercase tracking-wider">Status</label>
                                <div className="relative">
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                                        className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-gray-900">All Statuses</option>
                                        <option value="pending" className="bg-gray-900">Pending</option>
                                        <option value="approved" className="bg-gray-900">Approved</option>
                                        <option value="rejected" className="bg-gray-900">Rejected</option>
                                    </select>
                                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-green-400 mb-1 uppercase tracking-wider">Organizer</label>
                                <select
                                    value={filters.organizerType}
                                    onChange={(e) => setFilters({...filters, organizerType: e.target.value})}
                                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-gray-900">All Types</option>
                                    <option value="citizen" className="bg-gray-900">Citizen</option>
                                    <option value="ngo" className="bg-gray-900">NGO</option>
                                    <option value="school" className="bg-gray-900">School</option>
                                    <option value="ra" className="bg-gray-900">Residents Assoc.</option>
                                    <option value="local_authority" className="bg-gray-900">Local Authority</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-green-400 mb-1 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm scheme-dark"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Leaf className="text-green-400 w-5 h-5" />
                                Event List
                            </h2>
                            <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-lg border border-green-500/30">
                                {filteredEvents.length} results
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-black/20">
                                    <tr>
                                        {['Event', 'Organizer', 'Date', 'Location', 'Participants', 'Status', 'Actions'].map((header) => (
                                            <th key={header} className="px-6 py-4 text-left text-xs font-bold text-green-400 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredEvents.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search className="w-12 h-12 text-gray-600 mb-4" />
                                                    <p>No green events found matching your criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-green-300 transition-colors">{event.title}</div>
                                                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">{event.description}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-200">{event.organizer}</div>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border mt-1 ${getOrganizerBadge(event.organizerType)}`}>
                                                        {event.organizerType.toUpperCase().replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {event.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} className="text-gray-500" />
                                                        {event.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <div className="flex items-center gap-1">
                                                        <Users size={14} className="text-gray-500" />
                                                        {event.participants}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                                                        {event.status === 'approved' && <Check size={12} />}
                                                        {event.status === 'rejected' && <X size={12} />}
                                                        {event.status === 'pending' && <Clock size={12} />}
                                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                    </span>
                                                    {event.rejectionReason && event.status === 'rejected' && (
                                                        <div className="mt-1 text-[10px] text-red-400 italic max-w-[120px] truncate">
                                                            {event.rejectionReason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        {currentUser.role === 'local_authority' && event.status === 'pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleAction(event.id, 'approve')}
                                                                    className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/50 transition-all"
                                                                    title="Approve"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(event.id, 'reject')}
                                                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 transition-all"
                                                                    title="Reject"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button className="text-gray-500 hover:text-white p-1">
                                                                <MoreHorizontal size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}