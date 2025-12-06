'use client';
import React, { useState, ChangeEvent } from 'react';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn
} from 'lucide-react';
import { SignIn, SignUp } from '@/utils/auth';
import Link from 'next/link';
import { refreshHeader } from '../components/header/header';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
    email: string;
    password: string;
}

// Reusing the visual label style from Sign Up, but simplified for Sign In
function FormLabel({ label, icon: Icon }: { label: string, icon?: any }) {
    return (
        <div className="flex items-center gap-2 text-green-300 mb-2">
            {Icon && <Icon size={14} />}
            <label className='text-xs font-bold uppercase tracking-wider'>
                {label}
            </label>
        </div>
    );
}

// Reusing the glass password field logic
function PasswordField({ onChange, value }: { onChange: (e: ChangeEvent<HTMLInputElement>) => void, value: string }) {
    const [invisible, setInvisible] = useState<boolean>(true);
    
    return (
        <div className='relative flex items-center'>
            <input
                type={invisible ? 'password' : 'text'}
                name="password"
                value={value}
                onChange={onChange}
                className="glass-input w-full pl-4 pr-12 py-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500 border-white/10 focus:border-green-400 focus:bg-white/10"
                placeholder='Enter your password'
                required
            />
            <button 
                type="button"
                className='absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10'
                onClick={() => {setInvisible(!invisible);}}
            >
                {invisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
        </div>
    );
}

export default function SignInForm() {
    const [form, setForm] = useState<SignInFormProps>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        
        await SignIn(formData);
        refreshHeader();
        setLoading(false);
        router.push('/home');
    };

    return (
        <form 
            className='space-y-5' 
            action={SignIn} 
            onSubmit={handleSubmit}
        >
            <div>
                <FormLabel label="Email Address" icon={Mail} />
                <div className="relative">
                    <input
                        name='email'
                        type='email'
                        className="glass-input w-full px-4 py-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500 border-white/10 focus:border-green-400 focus:bg-white/10"
                        placeholder='example@domain.com'
                        required
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <FormLabel label="Password" icon={Lock} />
                <PasswordField 
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <div className='flex justify-end mt-2'>
                    <Link href="#" className='text-xs text-green-400 hover:text-green-300 transition-colors'>
                        Forgot Password?
                    </Link>
                </div>
            </div>

            <button
                type='submit'
                className='w-full mt-6 bg-linear-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                disabled={!form.email || !form.password || loading}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                ) : (
                    <>
                        Sign In
                        <LogIn size={20} />
                    </>
                )}
            </button>

            <div className='text-gray-400 text-sm text-center pt-2'>
                { `Don't have an account?` } 
                <Link href='/sign-up' className='ml-1 text-green-400 font-bold hover:text-green-300 hover:underline transition-colors'>
                    Create one
                </Link>
            </div>
        </form>
    );
}

/*
'use client';
import { ChangeEvent, type JSX, useState } from 'react';
import Password from '@/app/components/password/password';
import { SignIn } from '@/utils/auth';
import Link from 'next/link';

interface SignUpFormProps {
    email: string;
    password: string;
}

export default function SignUpForm(): JSX.Element {
    const [form, setForm] = useState<SignUpFormProps>({
        email: '',
        password: ''
    });

    return (
        <form className='space-y-4' action={SignIn}>
            <div>
                <label className='block text-green-800 text-sm mb-2'>
                    Email
                </label>
                <input
                    name='email'
                    type='email'
                    className='text-green-700 px-4 py-3 outline-none border w-full border-green-300 rounded-xl focus:ring-2 focus:ring-green-500'
                    placeholder='example@domain.com'
                    required
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setForm({...form, email: event.target.value});
                    }}
                />
            </div>
            <div>
                <div className='mb-2'>
                    <label className='text-green-800 text-sm'>
                        Password
                    </label>
                </div>
                <Password callback={(event: ChangeEvent<HTMLInputElement>) => {
                    setForm({...form, password: event.target.value});
                }}/>
            </div>
            <button
                type='submit'
                className='hover:bg-green-700 w-full text-center py-3 bg-green-600 disabled:bg-green-300 rounded-xl disabled:cursor-not-allowed cursor-pointer text-white mt-4 transition-colors duration-200 font-bold'
                disabled={!form.email || !form.password}
            >Sign In</button>
            <div className='text-green-600 text-sm text-center'>
                { `Don't have an account?` } <Link href='/benjamin/sign-up' className='text-green-700'>Sign Up</Link>
            </div>
        </form>
    );
}
*/