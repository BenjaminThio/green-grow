'use client';
import { useState, useEffect, useRef } from 'react';
import { 
    Plus, 
    Droplets, 
    MapPin, 
    MessageCircle,
    X,
    Camera,
    Loader2,
    Activity,
    CheckCircle2,
    AlertTriangle,
    ScanLine,
} from 'lucide-react';
import Image from 'next/image';
import { analyzePlantImage } from './dr-green';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    type: 'text' | 'analysis';
    content: any;
    image?: string;
}

interface Tree {
    id: number;
    name: string;
    species: string;
    status: 'Healthy' | 'Needs Water' | 'Attention';
    location: string;
    lastUpdate: string;
    photo: string;
    updates: any[];
}

function PlantDoctorBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showOptions, setShowOptions] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            role: 'assistant', 
            type: 'text', 
            content: "Hello! I'm Dr. Green. Please choose an option below to get started."
        }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, showOptions]);

    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (messages.length === 1) setShowOptions(true);
        }
    }, [isOpen]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setShowOptions(false);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const displayImage = reader.result as string;

            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'user', 
                type: 'text',
                content: 'Running diagnostics on this sample...', 
                image: displayImage 
            }]);

            setIsAnalyzing(true);

            const analysisResult = await analyzePlantImage(base64String);

            setIsAnalyzing(false);

            if (analysisResult && analysisResult.is_plant) {
                setMessages(prev => [...prev, { 
                    id: (Date.now() + 1).toString(), 
                    role: 'assistant', 
                    type: 'analysis',
                    content: analysisResult
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    id: (Date.now() + 1).toString(), 
                    role: 'assistant', 
                    type: 'text', 
                    content: "I couldn't identify a plant in that image. Please try uploading a clearer photo of a leaf."
                }]);
                setShowOptions(true);
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <>
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className='fixed bottom-28 right-6 z-50 w-16 h-16 bg-linear-to-br from-emerald-500 to-green-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 group'
                >
                    <MessageCircle className='w-7 h-7 animate-pulse' />
                    <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#052e16] flex items-center justify-center text-[10px] font-bold'>1</span>
                </button>
            )}

            {isOpen && (
                <div className='fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none'>
                    <div className='absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto' onClick={() => setIsOpen(false)}></div>
                    <div className='relative w-full max-w-md h-[75vh] sm:h-[680px] bg-[#0f3923] rounded-[40px] mb-24 sm:mb-0 mx-4 flex flex-col shadow-2xl overflow-hidden border border-white/10 animate-slide-up pointer-events-auto'>
                        <div className='p-6 bg-white/5 border-b border-white/5 flex justify-between items-center backdrop-blur-md'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg transform rotate-3'>
                                    <Activity className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h3 className='font-bold text-white text-lg font-display'>Dr. Green</h3>
                                    <p className='text-sm text-green-300 flex items-center gap-1.5'>
                                        <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></span>
                                        Plant.id API Active
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className='p-3 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white'>
                                <X size={24} />
                            </button>
                        </div>
                        <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] ${msg.type === 'analysis' ? 'w-full' : ''}`}>
                                        {msg.image && (
                                            <div className='mb-3 ml-auto w-40 rounded-2xl overflow-hidden border border-green-500/30 shadow-lg'>
                                                <Image src={msg.image} alt='User upload' width={0} height={0} className='w-full h-auto' />
                                            </div>
                                        )}
                                        {msg.type === 'text' && (
                                            <div className={`rounded-3xl px-6 py-4 shadow-sm ${
                                                msg.role === 'user' 
                                                    ? 'bg-linear-to-br from-green-600 to-green-700 text-white rounded-tr-none' 
                                                    : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                            }`}>
                                                <p className='text-base leading-relaxed'>{msg.content}</p>
                                            </div>
                                        )}
                                        {msg.type === 'analysis' && (
                                            <div className='bg-white/5 border border-white/10 rounded-3xl rounded-tl-none overflow-hidden animate-fade-in shadow-xl'>
                                                <div className='p-5 bg-white/5 border-b border-white/5 flex justify-between items-center'>
                                                    <div>
                                                        <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Identification</p>
                                                        <h4 className='font-bold text-white text-xl'>{msg.content.identification.name}</h4>
                                                        <p className='text-sm text-green-400 italic'>{msg.content.identification.scientific_name}</p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <div className='text-xs font-bold text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full bg-green-500/10'>
                                                            {(msg.content.identification.confidence * 100).toFixed(0)}% Match
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='p-5 space-y-5'>
                                                    <div className='flex items-center gap-3'>
                                                        {msg.content.health_assessment.is_healthy ? (
                                                            <span className='flex items-center gap-2 text-green-400 font-bold text-base bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20 w-full justify-center'>
                                                                <CheckCircle2 size={20} /> Healthy Plant
                                                            </span>
                                                        ) : (
                                                            <span className='flex items-center gap-2 text-yellow-400 font-bold text-base bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20 w-full justify-center'>
                                                                <AlertTriangle size={20} /> Issues Detected
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!msg.content.health_assessment.is_healthy && msg.content.health_assessment.diseases.map((disease: any, idx: number) => (
                                                        <div key={idx} className='bg-black/20 rounded-2xl p-4 border border-white/5'>
                                                            <div className='flex justify-between mb-2'>
                                                                <span className='text-base font-semibold text-white'>{disease.name}</span>
                                                                <span className='text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded-lg'>{(disease.probability * 100).toFixed(0)}% Prob.</span>
                                                            </div>
                                                            <p className='text-sm text-gray-300 mt-2 border-t border-white/10 pt-3 leading-relaxed'>
                                                                <span className='text-green-400 font-bold'>Rx:</span> {disease.treatment}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    {msg.content.health_assessment.is_healthy && (
                                                        <p className='text-base text-gray-300 leading-relaxed'>
                                                            No visible signs of disease or pests. Keep up the good work!
                                                        </p>
                                                    )}
                                                    
                                                    <button onClick={() => setShowOptions(true)} className='w-full mt-2 py-3 text-sm font-medium text-green-400 hover:text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/10 transition-all'>
                                                        Scan Another Plant
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {showOptions && !isAnalyzing && (
                                <div className='mt-4 grid gap-4 animate-slide-up'>
                                    <p className='text-sm text-gray-400 text-center mb-2'>Select an action:</p>
                                    <button 
                                        onClick={triggerFileInput}
                                        className='flex items-center gap-5 p-5 bg-linear-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 rounded-4xl transition-all group shadow-lg'
                                    >
                                        <div className='w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform shadow-inner'>
                                            <Camera size={28} />
                                        </div>
                                        <div className='text-left'>
                                            <h4 className='font-bold text-white text-lg'>Capture & Diagnose</h4>
                                            <p className='text-sm text-gray-400'>Take a photo to check plant health</p>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={triggerFileInput} 
                                        className='flex items-center gap-5 p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-4xl transition-all group'
                                    >
                                        <div className='w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform'>
                                            <ScanLine size={28} />
                                        </div>
                                        <div className='text-left'>
                                            <h4 className='font-bold text-white text-lg'>Identify Plant</h4>
                                            <p className='text-sm text-gray-400'>Find out species name & details</p>
                                        </div>
                                    </button>
                                </div>
                            )}
                            {isAnalyzing && (
                                <div className='flex justify-start'>
                                    <div className='bg-white/10 rounded-3xl rounded-tl-none p-5 flex items-center gap-4 border border-white/5 shadow-md'>
                                        <Loader2 className='w-6 h-6 text-green-400 animate-spin' />
                                        <div className='flex flex-col'>
                                            <span className='text-base text-white font-medium'>Scanning plant tissue...</span>
                                            <span className='text-xs text-gray-400'>Comparing with database</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className='p-6 bg-white/5 border-t border-white/5'>
                            <input 
                                type='file' 
                                ref={fileInputRef}
                                accept='image/*'
                                capture='environment'
                                className='hidden'
                                onChange={handleImageUpload}
                            />
                             <div className='flex gap-3 opacity-50 pointer-events-none'>
                                <button className='p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500'>
                                    <Camera size={24} />
                                </button>
                                <div className='flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center px-6 text-sm text-gray-500 italic'>
                                    Select an option above...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const MOCK_TREES: Tree[] = [
    {
        id: 1,
        name: 'Oakley',
        species: 'White Oak',
        status: 'Healthy',
        location: 'Central Park, Zone A',
        lastUpdate: '2 hours ago',
        photo: 'https://images.unsplash.com/photo-1458966480358-a0ac42de0a7a?auto=format&fit=crop&w=300&q=80',
        updates: [{ date: 'Oct 24, 2023', note: 'Added fresh mulch layer.', photo: 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=300&q=80' }]
    },
    {
        id: 2,
        name: 'Maple Sy',
        species: 'Red Maple',
        status: 'Needs Water',
        location: 'Community Garden',
        lastUpdate: '1 day ago',
        photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=80',
        updates: [{ date: 'Oct 20, 2023', note: 'Checked soil moisture.', photo: '' }]
    }
];

export default function MyTreesPage() {
    const [myTrees] = useState<Tree[]>(MOCK_TREES);

    return (
        <div className='min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16]'>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                h1, h2, h3, .font-display { font-family: 'Montserrat', sans-serif; }
                .ambient-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; background: radial-gradient(circle at 15% 50%, rgba(22, 163, 74, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(163, 230, 53, 0.1), transparent 25%); background-color: #022c22; pointer-events: none; }
                .glass-card { background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); }
                @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>

            <div className='ambient-bg' />

            <div className='relative z-10 flex flex-col min-h-screen pb-24'>
                <main className='flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-8'>
                    {myTrees.map((tree) => (
                        <div key={tree.id} className='glass-card rounded-4xl overflow-hidden'>
                            <div className='relative h-48 w-full'>
                                <Image src={tree.photo} alt={tree.name} fill className='w-full h-full object-cover' />
                                <div className='absolute inset-0 bg-linear-to-t from-[#052e16] via-transparent to-transparent'></div>
                                <div className='absolute top-4 right-4'>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${tree.status === 'Healthy' ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-yellow-500/20 border-yellow-400 text-yellow-300'}`}>
                                        {tree.status}
                                    </div>
                                </div>
                                <div className='absolute bottom-4 left-4 right-4'>
                                    <h3 className='text-2xl font-display font-bold text-white mb-1'>{tree.name}</h3>
                                    <div className='flex items-center text-xs text-gray-300 gap-3'>
                                        <span className='flex items-center gap-1'><LeafIcon size={12} /> {tree.species}</span>
                                        <span className='flex items-center gap-1'><MapPin size={12} /> {tree.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='p-6'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h4 className='font-semibold text-green-300 text-sm uppercase tracking-wider'>Recent Activity</h4>
                                    <span className='text-xs text-gray-500'>Updated {tree.lastUpdate}</span>
                                </div>
                                <div className='space-y-6 relative pl-2'>
                                    <div className='absolute top-2 bottom-2 left-[19px] w-0.5 bg-white/10'></div>
                                    {tree.updates.map((update, index) => (
                                        <div key={index} className='flex gap-4 relative'>
                                            <div className='shrink-0 w-3 h-3 mt-1.5 rounded-full bg-green-500 border-2 border-[#052e16] z-10 relative left-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]'></div>
                                            <div className='flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 hover:bg-white/10 transition-colors'>
                                                <div className='flex justify-between items-start mb-2'>
                                                    <p className='text-sm text-gray-200 font-medium'>{update.note}</p>
                                                    <span className='text-[10px] text-gray-500 whitespace-nowrap ml-2'>{update.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3'>
                                    <button className='flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all shadow-lg shadow-green-900/20'>
                                        <Plus size={16} /> Update
                                    </button>
                                    <button className='flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-sm transition-all'>
                                        <Droplets size={16} /> Water
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className='w-full py-4 rounded-3xl border-2 border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/5 text-gray-400 hover:text-green-400 font-medium transition-all flex items-center justify-center gap-2 group'>
                        <div className='w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-colors'>
                            <Plus size={18} />
                        </div>
                        Adopt a New Tree
                    </button>
                </main>
                <PlantDoctorBot />
            </div>
        </div>
    );
}

function LeafIcon({ size = 24, className = '' }) {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={className}>
            <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 13-1.8 17-4.7 5-9.5-1-8-1Z' />
            <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
        </svg>
    );
}