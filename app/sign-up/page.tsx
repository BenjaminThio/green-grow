'use client';
import { 
    Sprout
} from 'lucide-react';
import SignUpForm from './sign-up-form';

export default function SignUpPage() {
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
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>
            <div className='relative z-10 w-full max-w-md'>
                <div className='glass-card p-8 rounded-[40px] shadow-2xl border-t border-white/10 animate-fade-in-up'>
                    <div className='mb-8 text-center'>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-400 to-green-600 shadow-lg shadow-green-900/50 mb-4 transform rotate-3">
                            <Sprout className="text-white w-8 h-8" />
                        </div>
                        <h2 className='text-3xl font-display font-bold text-white mb-2'>
                            Join Green<span className="text-green-400">Grow</span>
                        </h2>
                        <p className='text-gray-400 text-sm'>
                            Start your botanical journey today.
                        </p>
                    </div>
                    <SignUpForm/>
                </div>
            </div>
        </div>
    );
}

/*
export default function SignUpPage(): JSX.Element {
    const [color, setColor] = useState('green');

    return (
        <div className='bg-green-50 min-h-screen flex flex-col items-center justify-center relative'>
            <div className='flex flex-col gap-4 absolute left-4'>
                <div onClick={() => {setColor('green');}} className='bg-green-500 h-10 aspect-square rounded-md'/>
                <div onClick={() => {setColor('blue');}} className='bg-blue-500 h-10 aspect-square rounded-md'/>
                <div onClick={() => {setColor('yellow');}} className='bg-yellow-500 h-10 aspect-square rounded-md'/>
                <div onClick={() => {setColor('purple');}} className='bg-purple-500 h-10 aspect-square rounded-md'/>
                <div onClick={() => {setColor('red');}} className='bg-red-500 h-10 aspect-square rounded-md'/>
            </div>
            <div className='w-md bg-white p-6 rounded-xl shadow-lg'>
                <div className='mb-6'>
                    <div className='text-green-800 text-2xl font-bold text-center'>
                        Title
                    </div>
                    <div className='text-green-700 text-center'>
                        Description
                    </div>
                </div>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-green-800 text-sm mb-2'>
                            Username
                        </label>
                        <input className='text-green-700 text-sm px-4 py-3 outline-none border w-full border-green-300 rounded-xl focus:ring-2 focus:ring-green-500' placeholder='Enter your full name.'/>
                    </div>
                    <div>
                        <label className='block text-green-800 text-sm mb-2'>
                            Email
                        </label>
                        <input className='text-green-700 px-4 py-3 outline-none border w-full border-green-300 rounded-xl focus:ring-2 focus:ring-green-500' placeholder='example@domain.com'/>
                    </div>
                    <div>
                        <label className='block text-green-800 text-sm mb-2'>
                            Password
                        </label>
                        <div className='flex items-center'>    
                            <input className='flex-1 text-green-700 px-4 py-3 outline-none border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500' placeholder='Create a password.'/>
                            <FontAwesomeIcon icon={faEye} className='text-green-700 p-2'/>
                        </div>
                    </div>
                    <button className='w-full text-center py-3 bg-green-300 rounded-xl text-white mt-4'>Create Account</button>
                    <div className='text-green-600 text-sm text-center'>
                        Already have an account? <span className='text-green-700'>Sign in</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
*/