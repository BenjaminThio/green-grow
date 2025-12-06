import { Eye, EyeOff, Lock } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface PasswordFieldProps {
    value: string;
    callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Password({value, callback}: PasswordFieldProps) {
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