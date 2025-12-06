'use client';
import { type JSX, useEffect, useState } from 'react';
import { Mail, Calendar, Settings, LogOut, Edit2 } from 'lucide-react';
import Image from 'next/image';
import { Email, Role, UserProps } from '@/utils/database';
import { GetCurrentUserData } from '@/utils/auth';

interface ProfileProps {
    editProfileCallback: () => void;
    privacySettingsCallback: () => void;
    logoutCallback: () => void;
}

interface ProfileFields {
    username: string;
    role: Role;
    email: Email;
    imageBase64: string | null;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
}

export default function Profile(profileProps: ProfileProps): JSX.Element {
    const [user, setUser] = useState<ProfileFields | null>(null);

    useEffect(() => {
        GetCurrentUserData().then((data) => {
            const userData: UserProps = data as UserProps;
            
            setUser({
                username: userData.info.username,
                role: userData.info.role,
                email: userData.info.email,
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
            <div className='space-y-3 mt-8'>
                <div className='h-12 bg-white/10 rounded-xl w-full'></div>
                <div className='h-12 bg-white/10 rounded-xl w-full'></div>
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
                        <div className="relative">
                            {
                                !user.imageBase64
                                ? <div className='w-24 h-24 bg-linear-to-br from-green-800 to-green-950 rounded-full flex items-center justify-center text-4xl border-4 border-[#052e16] shadow-xl'>
                                    🌿
                                </div>
                                : <Image 
                                    alt='pfp' 
                                    src={user.imageBase64} 
                                    width={96} 
                                    height={96} 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-[#052e16] shadow-xl"
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
                        onClick={profileProps.editProfileCallback}
                    >
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                    <button
                        className='w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 flex items-center justify-center gap-2'
                        onClick={profileProps.privacySettingsCallback}
                    >
                        <Settings size={18} />
                        Privacy Settings
                    </button>
                    <button
                        className='w-full group mt-2 py-3.5 rounded-xl font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 flex items-center justify-center gap-2'
                        onClick={profileProps.logoutCallback}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

/*
'use client';
import { type JSX, useEffect, useState } from 'react';
import { GetCurrentUserData } from '@/utils/auth';
import { Email, Role, UserProps } from '@/utils/database';
import Image from 'next/image';

interface ProfileProps {
    editProfileCallback: () => void;
    privacySettingsCallback: () => void;
    logoutCallback: () => void;
}

interface ProfileFields {
    username: string;
    role: Role;
    email: Email;
    imageBase64: string | null;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
}

export default function Profile(profileProps: ProfileProps): JSX.Element {
    const [user, setUser] = useState<ProfileFields | null>(null);

    useEffect(() => {
        GetCurrentUserData().then((data) => {
            const userData: UserProps = data as UserProps;
            
            setUser({
                username: userData.info.username,
                role: userData.info.role,
                email: userData.info.email,
                imageBase64: userData.info.imageBase64,
                joinDate: userData.info.joinDate,
                eventsJoined: userData.info.eventsJoined,
                treesAdopted: userData.info.treesAdopted,
                reportsSubmitted: userData.info.reportsSubmitted
            });
        });
    }, []);

    if (!user) return (
        <div className='max-w-md mx-auto animate-pulse'>
            <div className='bg-white rounded-2xl shadow-md overflow-hidden mb-6'>
                <div className='bg-gray-200 h-24'/>
                <div className='p-6 pt-0 -mt-8'>
                    <div className='flex justify-center mb-4'>
                        <div className='w-20 h-20 bg-gray-300 rounded-full border-4 border-white'></div>
                    </div>
                    <div className='h-7 bg-gray-200 rounded w-1/2 mx-auto mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6'></div>
                    <div className='space-y-4 pt-4 border-t border-gray-100'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='flex justify-between items-center'>
                                <div className='h-4 bg-gray-200 rounded w-24'></div>
                                <div className='h-4 bg-gray-300 rounded w-32'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='space-y-3'>
                <div className='h-12 bg-gray-200 rounded-xl w-full'></div>
                <div className='h-12 bg-gray-200 rounded-xl w-full'></div>
                <div className='h-12 bg-gray-200 rounded-xl w-full'></div>
            </div>
        </div>
    );

    return(
        <div className='max-w-md mx-auto'>
            <div className='bg-white rounded-2xl shadow-md overflow-hidden mb-6'>
                <div className='bg-green-600 h-24'/>
                <div className='p-6 pt-0 -mt-8'>
                    <div className='flex justify-center mb-4'>
                        {
                            !user.imageBase64
                            ?
                            <div className='w-20 h-20 bg-green-200 rounded-full flex items-center justify-center text-3xl border-4 border-white'>
                                🌿
                            </div>
                            :
                            <Image alt='pfp' src={user.imageBase64} width={0} height={0} className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center text-3xl border-4 border-white relative object-cover"/>
                        }
                    </div>
                    <h2 className='text-xl font-bold text-green-800 text-center mb-1'>{user.username}</h2>
                    <p className='text-green-600 text-center mb-4'>Role: {user.role}</p>
                    
                    <div className='space-y-3 pt-4 border-t border-green-100'>
                        <div className='flex justify-between'>
                            <span className='text-green-600'>Email</span>
                            <span className='text-green-800 font-medium'>{user.email}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-green-600'>Member Since</span>
                            <span className='text-green-800 font-medium'>{user.joinDate}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-green-600'>Events Joined</span>
                            <span className='text-green-800 font-medium'>{user.eventsJoined}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-green-600'>Trees Adopted</span>
                            <span className='text-green-800 font-medium'>{user.treesAdopted}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-green-600'>Reports Submitted</span>
                            <span className='text-green-800 font-medium'>{user.reportsSubmitted}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='space-y-3'>
                <button 
                className='w-full bg-white border-2 border-green-300 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-200'
                onClick={profileProps.editProfileCallback}
                >
                    Edit Profile
                </button>
                <button
                className='w-full bg-white border-2 border-green-300 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-200'
                onClick={profileProps.privacySettingsCallback}
                >
                    Privacy Settings
                </button>
                <button
                className='w-full bg-red-50 text-red-700 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-200'
                onClick={profileProps.logoutCallback}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
*/