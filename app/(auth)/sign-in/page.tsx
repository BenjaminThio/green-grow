import type { Metadata } from 'next';
import Link from 'next/link';
import { Sprout } from 'lucide-react';
import SignInForm from './sign-in-form';

export const metadata: Metadata = { title: 'Sign In' };

// Server component: the page shell ships zero JS, only the form is client.
export default function SignInPage() {
    return (
        <div className="glass-card p-8 rounded-[40px] shadow-2xl border-t border-white/10 animate-fade-in-up">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-400 to-green-600 shadow-lg shadow-green-900/50 mb-4 transform -rotate-3">
                    <Sprout className="text-white w-8 h-8" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                    Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                    Sign in to continue your botanical journey.
                </p>
            </div>

            <SignInForm />

            <p className="text-center text-sm text-gray-400 mt-6">
                New to GreenGrow?{' '}
                <Link href="/sign-up" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                    Create an account
                </Link>
            </p>
        </div>
    );
}
