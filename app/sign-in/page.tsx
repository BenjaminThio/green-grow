'use client';
import { 
    Sprout 
} from 'lucide-react';
import SignInForm from './sign-in-form';

export default function SignInPage() {
    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16] flex items-center justify-center p-4">
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
                
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>

            {/* Ambient Background Elements */}
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>

            {/* Main Content Card */}
            <div className='relative z-10 w-full max-w-md'>
                <div className='glass-card p-8 rounded-[40px] shadow-2xl border-t border-white/10 animate-fade-in-up'>
                    
                    {/* Header Section */}
                    <div className='mb-8 text-center'>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-400 to-green-600 shadow-lg shadow-green-900/50 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Sprout className="text-white w-8 h-8" />
                        </div>
                        <h2 className='text-3xl font-display font-bold text-white mb-2'>
                            Welcome <span className="text-green-400">Back</span>
                        </h2>
                        <p className='text-gray-400 text-sm'>
                            Sign in to continue your growth.
                        </p>
                    </div>

                    <SignInForm/>
                </div>
            </div>
        </div>
    );
}

/*
import { type JSX } from 'react';
import SignInForm from './sign-in-form';

export default function SignUpPage(): JSX.Element {
    return (
        <div className='bg-green-50 min-h-screen flex flex-col items-center justify-center relative'>
            <div className='w-md bg-white p-6 rounded-xl shadow-lg'>
                <div className='mb-6'>
                    <div className='text-green-800 text-2xl font-bold text-center'>
                        Title
                    </div>
                    <div className='text-green-700 text-center'>
                        Description
                    </div>
                </div>
                <SignInForm/>
            </div>
        </div>
    );
}
*/