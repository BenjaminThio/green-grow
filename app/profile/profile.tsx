import { useEffect, useState } from 'react';
import { UserInfo } from './page';
import { GetCurrentUserData } from '@/utils/auth';
import { UserProps } from '@/utils/database';
import Image from 'next/image';
import { 
    Mail, 
    Calendar, 
    Edit2, 
    Settings, 
    LogOut as LogOutIcon
} from "lucide-react";

interface ProfileProps {
    editProfileCallback: () => void;
    privacySettingsCallback: () => void;
    logoutCallback: () => void;
}

export function Profile({ editProfileCallback, privacySettingsCallback, logoutCallback }: ProfileProps) {
    const [user, setUser] = useState<UserInfo | null>(null);
    
    useEffect(() => {
        GetCurrentUserData().then((data) => {
            console.log('in');
            const userData: UserProps = data as UserProps;

            setUser({
                username: userData.info.username,
                role: userData.info.role,
                email: userData.info.email,
                password: userData.info.password,
                imageBase64: userData.info.imageBase64,
                joinDate: userData.info.joinDate,
                eventsJoined: userData.info.eventsJoined,
                treesAdopted: userData.info.treesAdopted,
                reportsSubmitted: userData.info.reportsSubmitted
            });
        });
    }, []);

    if (!user) return (
        <div className='w-full max-w-md mx-auto animate-pulse glass-card rounded-3xl p-8'>
            <div className='flex justify-center mb-6'>
                <div className='w-24 h-24 bg-white/10 rounded-full border-4 border-white/5'></div>
            </div>
            <div className='h-8 bg-white/10 rounded w-1/2 mx-auto mb-3'></div>
            <div className='h-4 bg-white/10 rounded w-1/3 mx-auto mb-8'></div>
            <div className='space-y-4 pt-4 border-t border-white/10'>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className='flex justify-between items-center'>
                        <div className='h-4 bg-white/10 rounded w-24'></div>
                        <div className='h-4 bg-white/10 rounded w-32'></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return(
        <div className='w-full max-w-md mx-auto glass-card rounded-[40px] p-8 shadow-2xl border-t border-white/10 relative overflow-hidden'>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className='relative z-10'>
                <div className='flex flex-col items-center mb-8'>
                    <div className='relative mb-4 group'>
                        <div className="absolute -inset-1 bg-linear-to-br from-green-400 to-emerald-600 rounded-full blur opacity-75 group-hover:opacity-100 transition"></div>
                        <div className="relative w-24 h-24">
                            {
                                !user.imageBase64
                                ? <div className='w-full h-full bg-linear-to-br from-green-800 to-green-950 rounded-full flex items-center justify-center text-4xl border-4 border-[#052e16] shadow-xl'>
                                    🌿
                                </div>
                                : <Image 
                                    alt='pfp' 
                                    src={user.imageBase64} 
                                    fill 
                                    className="w-full h-full rounded-full object-cover border-4 border-[#052e16] shadow-xl"
                                />
                            }
                        </div>
                    </div>
                    <h2 className='text-2xl font-display font-bold text-white mb-1'>{user.username}</h2>
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs font-medium text-green-300">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-2xl font-bold text-white mb-1">{user.eventsJoined}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Events</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-2xl font-bold text-white mb-1">{user.treesAdopted}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Trees</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-2xl font-bold text-white mb-1">{user.reportsSubmitted}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Reports</span>
                    </div>
                </div>
                <div className='space-y-4 mb-8'>
                    <div className='flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors'>
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <Mail size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="text-sm font-medium text-white break-all">{user.email}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors'>
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Calendar size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400">Member Since</p>
                            <p className="text-sm font-medium text-white">{user.joinDate}</p>
                        </div>
                    </div>
                </div>
                <div className='space-y-3'>
                    <button 
                        className='w-full bg-white text-green-900 py-3.5 rounded-xl font-bold hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/10'
                        onClick={editProfileCallback}
                    >
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                    <button
                        className='w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 flex items-center justify-center gap-2'
                        onClick={privacySettingsCallback}
                    >
                        <Settings size={18} />
                        Privacy Settings
                    </button>
                    <button
                        className='w-full group mt-2 py-3.5 rounded-xl font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 flex items-center justify-center gap-2'
                        onClick={logoutCallback}
                    >
                        <LogOutIcon size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}