'use client';
import React, { useState, ChangeEvent } from 'react';
import { 
    Info, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    ArrowRight,
    User,
    Mail,
    Lock
} from 'lucide-react';
import { SignUp } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { refreshHeader } from '../components/header/header';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

interface SignUpFormProps {
    username: string;
    email: string;
    password: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
}

function LabelWithTooltip({ label, tooltip, error, icon: Icon }: { label: string, tooltip: string, error?: string, icon?: any }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-green-300">
                {Icon && <Icon size={14} />}
                <label className='text-xs font-bold uppercase tracking-wider'>
                    {label}
                </label>
            </div>
            <div className="flex items-center gap-2">
                {error && (
                    <span className="text-red-400 text-xs font-semibold flex items-center gap-1 animate-pulse">
                        {error}
                    </span>
                )}
                <div className="group relative flex items-center justify-center cursor-help">
                    <Info size={14} className={`transition-colors ${error ? 'text-red-400' : 'text-green-500/70 hover:text-green-400'}`} />
                    <div className="absolute right-0 bottom-6 w-48 hidden group-hover:block glass-card p-3 rounded-xl z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 bg-black/80 backdrop-blur-xl">
                        <p className="text-[10px] text-gray-300 leading-relaxed text-center">{tooltip}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PasswordField({ hasError, onBlur, callback }: { hasError: boolean, onBlur: () => void, callback: (e: ChangeEvent<HTMLInputElement>) => void }) {
    const [invisible, setInvisible] = useState<boolean>(true);
    
    return (
        <div className='relative flex items-center'>
            <input
                type={invisible ? 'password' : 'text'}
                name="password"
                onBlur={onBlur}
                onChange={callback}
                className={`glass-input w-full pl-4 pr-12 py-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500
                    ${hasError 
                        ? 'border-red-500/50 focus:border-red-400 bg-red-500/5' 
                        : 'border-white/10 focus:border-green-400 focus:bg-white/10'
                    }`}
                placeholder='Create a strong password'
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

export default function SignUpForm() {
    const [form, setForm] = useState<SignUpFormProps>({
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validate = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'username':
                if (value.length < USERNAME_MIN_LENGTH) return `Min ${USERNAME_MIN_LENGTH} chars.`;
                if (value.length > USERNAME_MAX_LENGTH) return `Max ${USERNAME_MAX_LENGTH} chars.`;
                if (!USERNAME_REGEX.test(value)) return 'Letters, numbers, and underscores only.';
                return undefined;
            case 'email':
                if (value.length < EMAIL_MIN_LENGTH) return `Min ${EMAIL_MIN_LENGTH} chars.`;
                if (value.length > EMAIL_MAX_LENGTH) return `Max ${EMAIL_MAX_LENGTH} chars.`;
                if (!EMAIL_REGEX.test(value)) return 'Invalid email format.';
                return undefined;
            case 'password':
                if (value.length < PASSWORD_MIN_LENGTH) return `Min ${PASSWORD_MIN_LENGTH} chars.`;
                if (value.length > PASSWORD_MAX_LENGTH) return `Max ${PASSWORD_MAX_LENGTH} characters.`;
                if (!PASSWORD_REGEX.test(value)) return 'Needs Upper, Lower, Number & Special.';
                return undefined;
            default:
                return undefined;
        }
    };

    const handleBlur = (field: keyof SignUpFormProps) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: validate(field, form[field]) }));
    };

    const handleChange = (field: keyof SignUpFormProps, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (touched[field]) {
            setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setLoading(true);
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        
        await SignUp(formData);
        refreshHeader();
        setLoading(false);
        router.push('/home');
    };

    const isFormValid = 
        !errors.username && !errors.email && !errors.password &&
        form.username && form.email && form.password;

    return (
        <form className='space-y-5' onSubmit={handleSubmit}>
            <div>
                <LabelWithTooltip 
                    label="Username" 
                    icon={User}
                    tooltip={`Letters, numbers, _ only. Length ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH}.`}
                    error={errors.username} 
                />
                <div className="relative">
                    <input
                        name='username'
                        className={`glass-input w-full px-4 py-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500
                            ${errors.username 
                                ? 'border-red-500/50 focus:border-red-400 bg-red-500/5' 
                                : 'border-white/10 focus:border-green-400 focus:bg-white/10'
                            }`}
                        placeholder='Enter your full name'
                        required
                        value={form.username}
                        onBlur={() => handleBlur('username')}
                        onChange={(e) => handleChange('username', e.target.value)}
                    />
                    {!errors.username && form.username && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-200">
                            <CheckCircle2 size={18} />
                        </div>
                    )}
                </div>
            </div>
            <div>
                <LabelWithTooltip 
                    label="Email" 
                    icon={Mail}
                    tooltip="Must be a valid email format." 
                    error={errors.email} 
                />
                <div className="relative">
                    <input
                        name='email'
                        type='email'
                        className={`glass-input w-full px-4 py-3.5 rounded-xl text-white focus:outline-none transition-all placeholder-gray-500
                            ${errors.email 
                                ? 'border-red-500/50 focus:border-red-400 bg-red-500/5' 
                                : 'border-white/10 focus:border-green-400 focus:bg-white/10'
                            }`}
                        placeholder='example@domain.com'
                        required
                        value={form.email}
                        onBlur={() => handleBlur('email')}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    {!errors.email && form.email && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-200">
                            <CheckCircle2 size={18} />
                        </div>
                    )}
                </div>
            </div>
            <div>
                <LabelWithTooltip 
                    label="Password" 
                    icon={Lock}
                    tooltip={`Min ${PASSWORD_MIN_LENGTH} chars. Requires Upper, Lower, Number, Special.`} 
                    error={errors.password} 
                />
                <PasswordField 
                    hasError={!!errors.password}
                    onBlur={() => handleBlur('password')}
                    callback={(e) => handleChange('password', e.target.value)}
                />
                {form.password && (
                    <div className="flex gap-1 mt-2 h-1">
                        <div className={`flex-1 rounded-full ${form.password.length > 0 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                        <div className={`flex-1 rounded-full ${form.password.length >= 8 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                        <div className={`flex-1 rounded-full ${!errors.password && form.password ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    </div>
                )}
            </div>
            <button
                type='submit'
                className='w-full mt-6 bg-linear-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
                disabled={!isFormValid || loading}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                ) : (
                    <>
                        Create Account
                        <ArrowRight size={20} />
                    </>
                )}
            </button>
            <div className='text-gray-400 text-sm text-center pt-2'>
                Already have an account? <a href='/sign-in' className='text-green-400 font-bold hover:text-green-300 hover:underline transition-colors'>Sign in</a>
            </div>
        </form>
    );
}
/*
'use client';
import { ChangeEvent, type JSX, useState } from 'react';
import Password from '@/app/components/password/password'; 
import { SignUp } from '@/utils/auth';
import Link from 'next/link';

// --- CONSTANTS ---
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

// --- INTERFACES ---
interface SignUpFormProps {
    username: string;
    email: string;
    password: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
}

export default function SignUpForm(): JSX.Element {
    const [form, setForm] = useState<SignUpFormProps>({
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // --- VALIDATION ---
    const validate = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'username':
                if (value.length < USERNAME_MIN_LENGTH) return `Min ${USERNAME_MIN_LENGTH} chars.`;
                if (value.length > USERNAME_MAX_LENGTH) return `Max ${USERNAME_MAX_LENGTH} chars.`;
                if (!USERNAME_REGEX.test(value)) return 'Letters, numbers, and underscores only.';
                return undefined;
            case 'email':
                if (value.length < EMAIL_MIN_LENGTH) return `Min ${EMAIL_MIN_LENGTH} chars.`;
                if (value.length > EMAIL_MAX_LENGTH) return `Max ${EMAIL_MAX_LENGTH} chars.`;
                if (!EMAIL_REGEX.test(value)) return 'Invalid email format.';
                return undefined;
            case 'password':
                if (value.length < PASSWORD_MIN_LENGTH) return `Min ${PASSWORD_MIN_LENGTH} chars.`;
                if (value.length > PASSWORD_MAX_LENGTH) return `Max ${PASSWORD_MAX_LENGTH} characters.`;
                if (!PASSWORD_REGEX.test(value)) return 'Needs Upper, Lower, Number & Special.';
                return undefined;
            default:
                return undefined;
        }
    };

    // --- HANDLERS ---
    const handleBlur = (field: keyof SignUpFormProps) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: validate(field, form[field]) }));
    };

    const handleChange = (field: keyof SignUpFormProps, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (touched[field]) {
            setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
        }
    };

    const isFormValid = 
        !errors.username && !errors.email && !errors.password &&
        form.username && form.email && form.password;

    return (
        <form className='space-y-6' action={SignUp}>
            <div>
                <LabelWithTooltip 
                    label="Username" 
                    tooltip={`Letters, numbers, _ only. Length ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH}.`}
                    error={errors.username} 
                />
                <input
                    name='username'
                    className={`text-sm px-4 py-3 outline-none border w-full rounded-xl focus:ring-2 transition-colors duration-200
                        ${errors.username 
                            ? 'border-red-500 focus:ring-red-200 text-red-900 bg-red-50' 
                            : 'border-green-300 focus:ring-green-500 text-green-700'
                        }`}
                    placeholder='Enter your full name.'
                    required
                    value={form.username}
                    onBlur={() => handleBlur('username')}
                    onChange={(e) => handleChange('username', e.target.value)}
                />
            </div>

            <div>
                <LabelWithTooltip 
                    label="Email" 
                    tooltip="Must be a valid email format." 
                    error={errors.email} 
                />
                <input
                    name='email'
                    type='email'
                    className={`text-sm px-4 py-3 outline-none border w-full rounded-xl focus:ring-2 transition-colors duration-200
                        ${errors.email 
                            ? 'border-red-500 focus:ring-red-200 text-red-900 bg-red-50' 
                            : 'border-green-300 focus:ring-green-500 text-green-700'
                        }`}
                    placeholder='example@domain.com'
                    required
                    value={form.email}
                    onBlur={() => handleBlur('email')}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
            </div>

            <div>
                <div className='mb-2'>
                    <LabelWithTooltip 
                        label="Password" 
                        tooltip={`Min ${PASSWORD_MIN_LENGTH} chars. Requires Upper, Lower, Number, Special.`} 
                        error={errors.password} 
                    />
                </div>
                <Password 
                    hasError={!!errors.password}
                    onBlur={() => handleBlur('password')}
                    callback={(event: ChangeEvent<HTMLInputElement>) => {
                        handleChange('password', event.target.value);
                    }}
                />
            </div>

            <button
                type='submit'
                className='hover:bg-green-700 w-full text-center py-3 bg-green-600 disabled:bg-green-300 rounded-xl disabled:cursor-not-allowed cursor-pointer text-white mt-4 transition-colors duration-200 font-bold'
                disabled={!isFormValid}
            >
                Create Account
            </button>
            
            <div className='text-green-600 text-sm text-center'>
                Already have an account? <Link href='/benjamin/sign-in' className='text-green-700 font-bold hover:underline'>Sign in</Link>
            </div>
        </form>
    );
}

// --- HELPER COMPONENT ---
function LabelWithTooltip({ label, tooltip, error }: { label: string, tooltip: string, error?: string }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <label className='text-green-800 text-sm font-semibold'>
                    {label}
                </label>
                <div className="group relative flex items-center justify-center cursor-help">
                    <div className="w-4 h-4 rounded-full bg-green-100 text-green-700 border border-green-300 text-[10px] font-bold flex items-center justify-center">
                        ?
                    </div>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {tooltip}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -mt-1 border-4 border-transparent border-r-gray-800"></div>
                    </div>
                </div>
            </div>
            {error && (
                <span className="text-red-500 text-xs font-bold animate-pulse text-right">
                    {error}
                </span>
            )}
        </div>
    );
}
*/