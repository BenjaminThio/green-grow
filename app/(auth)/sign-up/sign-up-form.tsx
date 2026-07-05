'use client';

import { useActionState, useState } from 'react';
import { User, Mail, Lock, Info, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { signUp, AuthState } from '@/lib/auth-actions';
import PasswordInput from '@/components/ui/password-input';
import {
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_REGEX,
    EMAIL_REGEX,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_REGEX
} from '@/lib/constants';

/*
 * Validation rules are imported from lib/constants — the old form
 * copy-pasted every constant and regex locally, so client and server
 * rules could silently drift apart.
 */

const initialState: AuthState = { error: null };

type FieldErrors = Partial<Record<'username' | 'email' | 'password' | 'confirm', string>>;

function validateField(name: string, value: string, password?: string): string | undefined {
    switch (name) {
        case 'username':
            if (value.length < USERNAME_MIN_LENGTH) return `Min ${USERNAME_MIN_LENGTH} chars.`;
            if (value.length > USERNAME_MAX_LENGTH) return `Max ${USERNAME_MAX_LENGTH} chars.`;
            if (!USERNAME_REGEX.test(value)) return 'Letters, numbers, and underscores only.';
            return undefined;
        case 'email':
            if (!EMAIL_REGEX.test(value)) return 'Invalid email format.';
            return undefined;
        case 'password':
            if (value.length < PASSWORD_MIN_LENGTH) return `Min ${PASSWORD_MIN_LENGTH} chars.`;
            if (value.length > PASSWORD_MAX_LENGTH) return `Max ${PASSWORD_MAX_LENGTH} chars.`;
            if (!PASSWORD_REGEX.test(value)) return 'Needs upper, lower, number & symbol.';
            return undefined;
        case 'confirm':
            if (value !== password) return 'Passwords do not match.';
            return undefined;
    }
    return undefined;
}

function passwordStrength(password: string): number {
    let score = 0;
    if (password.length >= PASSWORD_MIN_LENGTH) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;
    return score;
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

export default function SignUpForm() {
    const [state, formAction, pending] = useActionState(signUp, initialState);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [password, setPassword] = useState('');

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name === 'confirm-password' ? 'confirm' : name]: validateField(name === 'confirm-password' ? 'confirm' : name, value, password) }));
    };

    const strength = passwordStrength(password);

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <FieldLabel label="Username" icon={User} error={errors.username} tooltip={`${USERNAME_MIN_LENGTH}–${USERNAME_MAX_LENGTH} characters. Letters, numbers, and underscores.`} />
                <input
                    name="username"
                    autoComplete="username"
                    onBlur={handleBlur}
                    className={`glass-input w-full px-4 py-3.5 rounded-xl text-white transition-all placeholder-gray-500 ${errors.username ? 'border-red-500/50! bg-red-500/5!' : ''}`}
                    placeholder="Choose a username"
                    required
                />
            </div>

            <div>
                <FieldLabel label="Email Address" icon={Mail} error={errors.email} tooltip="We'll never share your email with anyone." />
                <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    onBlur={handleBlur}
                    className={`glass-input w-full px-4 py-3.5 rounded-xl text-white transition-all placeholder-gray-500 ${errors.email ? 'border-red-500/50! bg-red-500/5!' : ''}`}
                    placeholder="example@domain.com"
                    required
                />
            </div>

            <div>
                <FieldLabel label="Password" icon={Lock} error={errors.password} tooltip="Must include an uppercase letter, lowercase letter, number, and special character." />
                <PasswordInput
                    name="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    onBlur={handleBlur}
                    onChange={e => setPassword(e.target.value)}
                    className={errors.password ? 'border-red-500/50! bg-red-500/5!' : ''}
                />
                {password.length > 0 && (
                    <div className="mt-2">
                        <div className="flex gap-1 h-1">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`flex-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLORS[strength] : 'bg-white/10'}`} />
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{STRENGTH_LABELS[strength]}</p>
                    </div>
                )}
            </div>

            <div>
                <FieldLabel label="Confirm Password" icon={Lock} error={errors.confirm} tooltip="Re-enter your password to make sure it matches." />
                <PasswordInput
                    name="confirm-password"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    onBlur={handleBlur}
                    className={errors.confirm ? 'border-red-500/50! bg-red-500/5!' : ''}
                />
            </div>

            {state.error && (
                <div role="alert" className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" />
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/40 transition-all group"
            >
                {pending ? <Loader2 size={18} className="animate-spin" /> : null}
                {pending ? 'Creating account…' : 'Create Account'}
                {!pending && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </form>
    );
}

function FieldLabel({ label, icon: Icon, error, tooltip }: { label: string; icon: React.ElementType; error?: string; tooltip: string }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-green-300">
                <Icon size={14} />
                <label className="text-xs font-bold uppercase tracking-wider">{label}</label>
            </div>
            <div className="flex items-center gap-2">
                {error && <span className="text-red-400 text-xs font-semibold">{error}</span>}
                <div className="group relative flex items-center justify-center cursor-help">
                    <Info size={14} className={error ? 'text-red-400' : 'text-green-500/70 hover:text-green-400 transition-colors'} />
                    <div className="absolute right-0 bottom-6 w-48 hidden group-hover:block p-3 rounded-xl z-20 shadow-xl border border-white/10 bg-black/80 backdrop-blur-xl pointer-events-none">
                        <p className="text-[10px] text-gray-300 leading-relaxed text-center">{tooltip}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
