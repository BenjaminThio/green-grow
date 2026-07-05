'use client';

import { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/*
 * Single reusable password field with visibility toggle — the old code
 * had three separate copies (sign-in, sign-up, profile).
 */
export default function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
    const [visible, setVisible] = useState(false);
    const { className = '', ...rest } = props;

    return (
        <div className="relative flex items-center">
            <input
                type={visible ? 'text' : 'password'}
                className={`glass-input w-full pl-4 pr-12 py-3.5 rounded-xl text-white transition-all placeholder-gray-500 ${className}`}
                required
                {...rest}
            />
            <button
                type="button"
                aria-label={visible ? 'Hide password' : 'Show password'}
                className="absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                onClick={() => setVisible(v => !v)}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}
