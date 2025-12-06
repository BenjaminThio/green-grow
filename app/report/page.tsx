'use client';
import React, { useState } from 'react';
import { 
    MapPin, 
    Camera, 
    Upload, 
    CheckCircle2, 
    AlertTriangle, 
    Leaf,
    Trash2
} from 'lucide-react';
import Image from 'next/image';

const useRouter = () => {
    return {
        push: (path: string) => console.log(`Navigating to ${path}`),
        back: () => console.log("Navigating back")
    };
};

interface ReportForm {
    title: string;
    category: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
    image: File | null;
}

export default function ReportPage() {
    const router = useRouter();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [reportForm, setReportForm] = useState<ReportForm>({
        title: '',
        category: '',
        severity: 'low',
        location: 'Taman Seri Park (GPS)',
        image: null
    });

    const handlePhotoUpload = (file: File | undefined) => {
        if (!file) return;
        setReportForm({ ...reportForm, image: file });

        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleRemovePhoto = () => {
        setReportForm({ ...reportForm, image: null });
        setUploadProgress(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            router.push('home');
        }, 2000);
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
                
                .glass-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    color: white;
                }
                .glass-input:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(74, 222, 128, 0.5);
                    outline: none;
                }
                
                .glass-nav {
                    background: rgba(20, 83, 45, 0.4);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
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
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
                    <form onSubmit={handleSubmit} className="glass-card rounded-4xl p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Issue Title</label>
                            <input
                                type="text"
                                value={reportForm.title}
                                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                                placeholder="e.g., Fallen tree blocking path"
                                className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Category</label>
                            <div className="relative">
                                <select
                                    value={reportForm.category}
                                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                                    className="glass-input w-full px-4 py-3.5 rounded-xl appearance-none cursor-pointer text-white"
                                >
                                    <option value="" className="bg-gray-900 text-gray-500">Select category...</option>
                                    <option value="tree-health" className="bg-gray-900">Tree Health</option>
                                    <option value="littering" className="bg-gray-900">Littering / Waste</option>
                                    <option value="facility-damage" className="bg-gray-900">Facility Damage</option>
                                    <option value="pest" className="bg-gray-900">Pest Infestation</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Leaf size={16} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Severity</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['low', 'medium', 'high'] as const).map((level) => {
                                    const isActive = reportForm.severity === level;
                                    let activeColor = "";
                                    let icon = null;

                                    if (level === 'low') {
                                        activeColor = "bg-green-500 border-green-400";
                                        icon = <CheckCircle2 size={16} />;
                                    } else if (level === 'medium') {
                                        activeColor = "bg-yellow-500 border-yellow-400";
                                        icon = <AlertTriangle size={16} />;
                                    } else {
                                        activeColor = "bg-red-500 border-red-400";
                                        icon = <AlertTriangle size={16} />;
                                    }

                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setReportForm({ ...reportForm, severity: level })}
                                            className={`
                                                relative py-3 rounded-xl font-semibold text-sm capitalize transition-all duration-300 border
                                                flex flex-col items-center justify-center gap-1
                                                ${isActive 
                                                    ? `${activeColor} text-white shadow-lg` 
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                                            `}
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
                            <div className="glass-input rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">{reportForm.location}</p>
                                    <p className="text-xs text-green-400 mt-0.5">Tap to adjust on map</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-green-300 ml-1 uppercase tracking-wider">Evidence</label>
                            
                            {!reportForm.image ? (
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label
                                        htmlFor="photo-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-400/50 hover:bg-white/5 transition-all gap-2"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                            <Camera className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-300">Tap to upload</p>
                                            <p className="text-xs text-gray-500">Photo or Video</p>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden glass border border-white/10">
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                        <Image 
                                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&w=500&q=60" 
                                            alt="Preview" 
                                            fill 
                                            className="w-full h-full object-cover opacity-80" 
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleRemovePhoto}
                                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {uploadProgress < 100 && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                            <div 
                                                className="h-full bg-green-500 transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!reportForm.title || !reportForm.category || (uploadProgress > 0 && uploadProgress < 100)}
                            className="w-full mt-4 bg-linear-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {uploadProgress > 0 && uploadProgress < 100 ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    <span>Submit Report</span>
                                </>
                            )}
                        </button>

                    </form>
                </main>
            </div>
            {showConfirmation && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 glass-card px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up border border-green-500/30">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Report submitted successfully!</span>
                </div>
            )}
        </div>
    );
}