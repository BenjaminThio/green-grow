'use client';
import { ChangeEvent, type JSX, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps {
    value: string;
    callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Password({value, callback}: PasswordFieldProps): JSX.Element {
    const [invisible, setInvisible] = useState<boolean>(true);
    
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 ml-1 flex items-center gap-1">
                <Lock size={12} /> Password
            </label>
            <div className='relative flex items-center'>
                <input
                    type={invisible ? 'password' : 'text'}
                    name="password"
                    id="password"
                    value={value}
                    onChange={callback}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-green-400 transition-all placeholder-gray-500"
                    placeholder='Enter your new password'
                />
                <button 
                    type="button"
                    className='absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10'
                    onClick={() => {setInvisible(!invisible);}}
                >
                    {invisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>
        </div>
    );
}

/*
'use client';
import { ChangeEvent, type JSX, useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PasswordFieldProps {
    value: string;
    callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Password({value, callback}: PasswordFieldProps): JSX.Element {
    const [invisible, setInvisible] = useState<boolean>(true);
    return (
        <div className='flex items-center'>
            <input
                type={invisible ? 'password' : 'text'}
                name="password"
                id="password"
                value={value}
                onChange={callback}
                className="flex-1 bg-green-50 text-green-900 px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder='Enter your new password.'
            />
            <FontAwesomeIcon icon={invisible ? faEyeSlash : faEye}
            className='text-green-700 p-2'
            onClick={() => {setInvisible(!invisible);}}/>
        </div>
    );
}
*/