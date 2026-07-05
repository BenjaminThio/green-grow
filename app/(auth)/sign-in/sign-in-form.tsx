'use client';

import { useActionState } from 'react';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { signIn, AuthState } from '@/lib/auth-actions';
import PasswordInput from '@/components/ui/password-input';

/*
 * Fixes vs. the old form:
 * - Old form set BOTH action={SignIn} and onSubmit={handleSubmit}, causing
 *   a double submission; handleSubmit then router.push('/home') whether or
 *   not the sign-in succeeded. Now there is a single server action.
 * - Errors thrown by the server crashed the page; now they render inline
 *   via useActionState.
 * - Pending state comes from the action itself, so the button can't be
 *   double-clicked mid-flight.
 */

const initialState: AuthState = { error: null };

export default function SignInForm() {
    const [state, formAction, pending] = useActionState(signIn, initialState);

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <FormLabel label="Email Address" icon={Mail} />
                <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="glass-input w-full px-4 py-3.5 rounded-xl text-white transition-all placeholder-gray-500"
                    placeholder="example@domain.com"
                    required
                />
            </div>

            <div>
                <FormLabel label="Password" icon={Lock} />
                <PasswordInput name="password" placeholder="Enter your password" autoComplete="current-password" />
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
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/40 transition-all"
            >
                {pending ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {pending ? 'Signing in…' : 'Sign In'}
            </button>
        </form>
    );
}

function FormLabel({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
    return (
        <div className="flex items-center gap-2 text-green-300 mb-2">
            <Icon size={14} />
            <label className="text-xs font-bold uppercase tracking-wider">{label}</label>
        </div>
    );
}
