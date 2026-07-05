import type { Metadata } from 'next';
import Link from 'next/link';
import { Sprout } from 'lucide-react';
import SignUpForm from './sign-up-form';

export const metadata: Metadata = { title: 'Sign Up' };

export default function SignUpPage() {
    return (
        <div className="glass-card p-8 rounded-[40px] shadow-2xl border-t border-white/10 animate-fade-in-up">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-400 to-green-600 shadow-lg shadow-green-900/50 mb-4 transform rotate-3">
                    <Sprout className="text-white w-8 h-8" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                    Join Green<span className="text-green-400">Grow</span>
                </h2>
                <p className="text-gray-400 text-sm">
                    Start your botanical journey today.
                </p>
            </div>

            <SignUpForm />

            <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
