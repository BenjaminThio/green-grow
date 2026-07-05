'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import dynamic from 'next/dynamic';

// three.js is heavy — load the particle field client-side only, after hydration.
const ThreeParticles = dynamic(() => import('@/components/ui/three-particles'), { ssr: false });
import { 
    Send, 
    Camera, 
    Sparkles, 
    Leaf, 
    Loader2, 
    X, 
    Scan
} from 'lucide-react';
import Image from 'next/image';
import { askGaia } from '@/lib/ai';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    image?: string;
    timestamp: Date;
}




export default function GaiaInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'model',
            text: 'Greetings, Guardian. I am Gaia. Show me a plant to check its health, or ask me how to heal our planet today. 🌿',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<Vector3>(new Vector3(9999, 9999, 0));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 60; 
        const y = -(e.clientY / window.innerHeight - 0.5) * 40;
        mouseRef.current.set(x, y, 0);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            image: selectedImage || undefined,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        const imageToSend = selectedImage;
        setSelectedImage(null);
        setIsLoading(true);

        const responseText = await askGaia(userMsg.text || 'What is this?', imageToSend);

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className='min-h-screen text-white antialiased font-sans relative overflow-hidden bg-forest-950'
        >
            <div className='fixed top-0 left-0 w-full h-full pointer-events-none'>
                <div className='absolute top-[-10%] left-[-10%] w-125 h-125 bg-green-800/30 rounded-full blur-[100px] animate-pulse' />
                <div className='absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-emerald-900/40 rounded-full blur-[100px] animate-pulse delay-1000' />
            </div>
            <ThreeParticles mouseRef={mouseRef} />
            <div className='relative z-10 flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6'>
                <header className='flex items-center justify-between mb-4 px-2'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-linear-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20'>
                            <Sparkles className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='font-display font-bold text-xl tracking-tight'>Gaia</h1>
                            <p className='text-xs text-green-300 font-medium tracking-wide uppercase'>Eco-Vision Assistant</p>
                        </div>
                    </div>
                </header>
                <div className='flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative mb-17.5'>
                    <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide'>
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1
                                        ${msg.role === 'user' ? 'bg-white/10' : 'bg-green-500/20'}`}
                                    >
                                        {msg.role === 'user' ? (
                                            <div className='w-2 h-2 rounded-full bg-white' />
                                        ) : (
                                            <Leaf className='w-4 h-4 text-green-400' />
                                        )}
                                    </div>
                                    <div className={`flex flex-col gap-2`}>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-sm
                                            ${msg.role === 'user' 
                                                ? 'bg-linear-to-br from-green-600 to-emerald-700 text-white rounded-tr-sm' 
                                                : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-sm'
                                            }`}
                                        >
                                            {msg.image && (
                                                <div className='mb-3 rounded-lg overflow-hidden border border-white/10'>
                                                    <Image src={msg.image} alt='User upload' fill className='w-full h-auto max-h-64 object-cover' />
                                                </div>
                                            )}
                                            {msg.text}
                                        </div>
                                        <span className={`text-[10px] text-gray-500 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className='flex justify-start'>
                                <div className='flex gap-3 max-w-[70%]'>
                                    <div className='w-8 h-8 rounded-full bg-green-500/20 shrink-0 flex items-center justify-center mt-1'>
                                        <Loader2 className='w-4 h-4 text-green-400 animate-spin' />
                                    </div>
                                    <div className='bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center h-12'>
                                        <div className='w-2 h-2 bg-green-400/50 rounded-full typing-dot'></div>
                                        <div className='w-2 h-2 bg-green-400/50 rounded-full typing-dot'></div>
                                        <div className='w-2 h-2 bg-green-400/50 rounded-full typing-dot'></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='p-4 bg-black/20 backdrop-blur-md border-t border-white/5'>
                        {selectedImage && (
                            <div className='mb-3 relative inline-block'>
                                <Image src={selectedImage} alt='Preview' fill className='h-20 rounded-lg border border-green-500/30 shadow-lg' />
                                <button 
                                    onClick={() => setSelectedImage(null)}
                                    className='absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors'
                                >
                                    <X className='w-3 h-3' />
                                </button>
                            </div>
                        )}
                        <div className='flex items-end gap-2'>
                            <input 
                                type='file' 
                                accept='image/*' 
                                className='hidden' 
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className='p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-gray-400 hover:text-green-400 shrink-0'
                                title='Upload Image'
                            >
                                <Camera className='w-5 h-5' />
                            </button>

                            <div className='flex-1 relative'>
                                <input 
                                    type='text' 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={selectedImage ? 'Ask about this image...' : 'Ask Gaia about plants or recycling...'}
                                    className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all'
                                />
                                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                                    <Scan className='w-4 h-4 text-gray-600' />
                                </div>
                            </div>

                            <button 
                                onClick={handleSend}
                                disabled={(!input.trim() && !selectedImage) || isLoading}
                                className={`p-3 rounded-xl shrink-0 transition-all duration-300
                                    ${(!input.trim() && !selectedImage) || isLoading 
                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/20 hover:scale-105'
                                    }`}
                            >
                                <Send className='w-5 h-5' />
                            </button>
                        </div>
                        <div className='mt-2 text-center'>
                            <p className='text-[10px] text-gray-500 uppercase tracking-widest'>Powered by GreenGrow</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}