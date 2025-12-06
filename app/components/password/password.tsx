'use client';
import { ChangeEvent, type JSX, useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PasswordFieldProps {
    callback: (event: ChangeEvent<HTMLInputElement>) => void;
    hasError?: boolean;
    onBlur?: () => void;
}

export default function Password({ callback, hasError, onBlur }: PasswordFieldProps): JSX.Element {
    const [invisible, setInvisible] = useState<boolean>(true);
    return (
        <div className='flex items-center'>    
            <input name='password' className={`flex-1 text-green-700 px-4 py-3 outline-none border rounded-xl focus:ring-2
                ${hasError 
                    ? 'border-red-500 focus:ring-red-200 text-red-900 bg-red-50 placeholder-red-300' 
                    : 'border-green-300 focus:ring-green-500 text-green-700'
                }
            `}
            placeholder='Create a password.'
            type={invisible ? 'password' : 'text'}
            required
            onChange={callback}
            onBlur={onBlur}/>
            <FontAwesomeIcon icon={invisible ? faEyeSlash : faEye}
            className={`cursor-pointer ${hasError ? 'text-red-700' : 'text-green-700'} text-green-700 p-2`}
            onClick={() => {setInvisible(!invisible);}}/>
        </div>
    );
}
