'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Camera,
    Loader2,
    Activity,
    CheckCircle2,
    AlertTriangle,
    ScanLine,
    Stethoscope
} from 'lucide-react';
import Image from 'next/image';
import { analyzePlantImage } from '@/lib/ai';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    type: 'text' | 'analysis';
    content: any;
    image?: string;
}

export default function PlantDoctorBot() {
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
    // Portals need document.body, which only exists after mount (not during SSR).
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);

    // Lock background scroll while the modal is open.
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <Stethoscope className='w-7 h-7' />
                    <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-forest-900 flex items-center justify-center text-[10px] font-bold'>1</span>
                </button>
            )}

            {isOpen && mounted && createPortal(
                /*
                 * Rendered into <body> via a portal so it escapes <main>'s
                 * `position: relative` stacking context (otherwise the fixed
                 * header + bottom navbar, both z-50, would sit on top of it).
                 * Backdrop and panel use inline background styles so they are
                 * always solid, independent of Tailwind arbitrary-value scanning.
                 */
                <div
                    className='fixed inset-0 flex items-center justify-center p-4'
                    style={{ zIndex: 2000 }}
                >
                    <div
                        className='absolute inset-0 backdrop-blur-sm'
                        style={{ background: 'rgba(0,0,0,0.7)' }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className='relative w-full max-w-md h-[75vh] sm:h-170 rounded-[40px] flex flex-col shadow-2xl overflow-hidden border border-white/10 animate-slide-up'
                        style={{ backgroundColor: '#0f3923' }}
                    >
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
                        {/*
                         * Dr. Green is driven entirely by the two action cards
                         * (Capture & Diagnose / Identify Plant), so there's no
                         * free-text chat box — just the hidden file input those
                         * cards trigger. The old fake, disabled "Select an option
                         * above…" bar has been removed.
                         */}
                        <input
                            type='file'
                            ref={fileInputRef}
                            accept='image/*'
                            capture='environment'
                            className='hidden'
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
