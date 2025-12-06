'use client';
import { type JSX, useState, useEffect, ChangeEvent } from "react";
import { Camera, Save, X, Mail, User, Info, Lock, Eye, EyeOff } from "lucide-react";
import { Email, Role, UpdateUserInfo, UserProps } from "@/utils/database";
import Image from "next/image";
import { GetCurrentUserData } from "@/utils/auth";
import { Image2Base64 } from "@/utils/image";

interface PasswordFieldProps {
    value: string;
    callback: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Password({value, callback}: PasswordFieldProps) {
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

interface EditProfileProps {
    saveChangesCallback: () => void;
    cancelCallback: () => void;
}

interface EditProfileFields {
    username: string;
    role: Role;
    email: Email;
    password: string;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
    imageBase64: string | null;
}

export default function EditProfile(editProfileProps: EditProfileProps): JSX.Element {
    const [formData, setFormData] = useState<EditProfileFields | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        GetCurrentUserData().then((data) => {
            const userData: UserProps = data as UserProps;
            
            setFormData({
                username: userData.info.username,
                role: userData.info.role,
                email: userData.info.email,
                password: userData.info.password,
                joinDate: userData.info.joinDate,
                eventsJoined: userData.info.eventsJoined,
                treesAdopted: userData.info.treesAdopted,
                reportsSubmitted: userData.info.reportsSubmitted,
                imageBase64: userData.info.imageBase64
            });
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev!,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!formData) return;
        setLoading(true);
        await UpdateUserInfo(formData.email, formData.username, formData.password, formData.role, formData.imageBase64);
        setLoading(false);
        editProfileProps.saveChangesCallback();
    };

    if (!formData) return (
        <div className="w-full max-w-md mx-auto animate-pulse glass-card rounded-[40px] p-8">
            <div className="h-24 bg-white/10 rounded-full w-24 mx-auto mb-8"></div>
            <div className="space-y-6">
                <div className="h-12 bg-white/10 rounded-xl"></div>
                <div className="h-12 bg-white/10 rounded-xl"></div>
                <div className="h-12 bg-white/10 rounded-xl"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-md mx-auto glass-card rounded-[40px] p-8 shadow-2xl border-t border-white/10 relative">
            <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">Edit Profile</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="flex justify-center mb-8">
                    <div className="relative group cursor-pointer">
                        <label htmlFor='image' className="cursor-pointer">
                            <div className="relative w-28 h-28">
                                {
                                    !formData.imageBase64
                                    ? <div className="w-full h-full bg-linear-to-br from-green-800 to-green-950 rounded-full flex items-center justify-center text-4xl border-4 border-[#052e16] shadow-xl">
                                        🌿
                                    </div>
                                    : <Image 
                                        alt='pfp' 
                                        src={formData.imageBase64} 
                                        fill 
                                        className="w-full h-full object-cover rounded-full border-4 border-[#052e16] shadow-xl"
                                    />
                                }
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full text-white shadow-lg border-2 border-[#052e16]">
                                    <Camera size={14} />
                                </div>
                            </div>
                            <input 
                                id='image' 
                                type='file' 
                                accept='image/*' 
                                style={{display: 'none'}} 
                                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                                    const files: FileList | null = event.target.files;

                                    if (files !== null && files.length > 0) {
                                        setFormData({...formData, imageBase64: await Image2Base64(files[0])});
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1 flex items-center gap-1">
                        <User size={12} /> Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-green-400 transition-all placeholder-gray-500"
                        placeholder="Enter your new username"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1 flex items-center gap-1">
                        <Mail size={12} /> Email
                    </label>
                    <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-400 flex justify-between items-center cursor-not-allowed">
                        <span>{formData.email}</span>
                        <Info size={14} className="opacity-50" />
                    </div>
                </div>
                <div className="space-y-1">
                    <Password value={formData.password} callback={handleChange}/>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-gray-400 uppercase tracking-wide">Joined</span>
                        <span className="block text-green-300 font-medium text-sm">{formData.joinDate}</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-gray-400 uppercase tracking-wide">Role</span>
                        <span className="block text-green-300 font-medium text-sm capitalize">{formData.role}</span>
                    </div>
                </div>
                <div className="pt-4 space-y-3">
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save size={18} />}
                        <span>Save Changes</span>
                    </button>
                    
                    <button 
                        className="w-full bg-white/5 border border-white/10 text-gray-300 py-3.5 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={editProfileProps.cancelCallback}
                        disabled={loading}
                    >
                        <X size={18} />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

/*
'use client';
import { GetCurrentUserData } from "@/utils/auth";
import { Email, Role, UpdateUserInfo, UserProps } from "@/utils/database";
import { type JSX, useState, useEffect, ChangeEvent } from "react";
import Password from "./password";
import { Image2Base64 } from "@/utils/image";
import Image from "next/image";

interface EditProfileProps {
    saveChangesCallback: () => void;
    cancelCallback: () => void;
}

interface EditProfileFields {
    username: string;
    role: Role;
    email: Email;
    password: string;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
    imageBase64: string | null;
}

export default function EditProfile(editProfileProps: EditProfileProps): JSX.Element {
    const [formData, setFormData] = useState<EditProfileFields | null>(null);
    
    useEffect(() => {
        GetCurrentUserData().then((data) => {
            const userData: UserProps = data as UserProps;
            
            setFormData({
                username: userData.info.username,
                role: userData.info.role,
                email: userData.info.email,
                password: userData.info.password,
                joinDate: userData.info.joinDate,
                eventsJoined: userData.info.eventsJoined,
                treesAdopted: userData.info.treesAdopted,
                reportsSubmitted: userData.info.reportsSubmitted,
                imageBase64: userData.info.imageBase64
            });
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev!,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log("Saving data:", formData);
        if (!formData) return;

        UpdateUserInfo(formData.email, formData.username, formData.password, formData.role, formData.imageBase64);
        editProfileProps.cancelCallback();
    };

    if (!formData) return (
        <div className="min-h-screen bg-green-50 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="max-w-md mx-auto animate-pulse">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                        <div className="bg-gray-200 h-24"/>
                        <div className="p-6 pt-0 -mt-8">
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white"></div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-24 ml-1"></div>
                                    <div className="h-11 bg-gray-200 rounded-lg w-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-12 bg-gray-300 rounded-xl w-full shadow-sm"></div>
                        <div className="h-12 bg-gray-200 rounded-xl w-full border-2 border-gray-200"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
    <div className="min-h-screen bg-green-50 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-md mx-auto">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden mb-6"
                >
                    <div className="bg-green-600 h-24"/>
                    <div className="p-6 pt-0 -mt-8">
                        <div className="flex justify-center mb-4 relative">
                            <label htmlFor='image'>
                                {
                                    !formData.imageBase64
                                    ?
                                    <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center text-3xl border-4 border-white relative">
                                        🌿
                                        <div className="absolute bottom-0 right-0 bg-green-600 p-1.5 rounded-full text-white hover:bg-green-700 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    :
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-4 border-white relative">
                                        <Image alt='pfp' src={formData.imageBase64} width={0} height={0} className="w-full h-full object-cover rounded-full"/>
                                        <div className="absolute bottom-0 right-0 bg-green-600 p-1.5 rounded-full text-white hover:bg-green-700 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                }
                                <input id='image' type='file' accept='image/*' style={{display: 'none'}} onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                                    const files: FileList | null = event.target.files;

                                    if (files !== null && files.length > 0) {
                                        setFormData({...formData, imageBase64: await Image2Base64(files[0])});
                                    }
                                }}/>
                            </label>
                        </div>
                        <div className="mb-2">
                            <label className="sr-only" htmlFor="username">Full Name</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full text-center text-xl font-bold text-green-900 border-b-2 border-green-200 focus:border-green-600 focus:outline-none bg-transparent py-1 placeholder-green-300"
                                placeholder="Enter your new username"
                            />
                        </div>
                        <p className="text-green-600 text-center mb-6 text-sm">Role: {formData.role} (Read Only)</p>
                        <div className="space-y-4 pt-4 border-t border-green-100">
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="password" className="text-sm font-semibold text-green-600 ml-1">Password</label>
                                <Password value={formData.password} callback={handleChange}/>
                            </div>
                            <div className="w-full bg-green-50 p-3 rounded-lg border border-green-100 opacity-75 text-green-800 font-medium">
                                {formData.email}
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 opacity-75">
                                    <span className="block text-xs text-green-600 uppercase tracking-wide">Member Since</span>
                                    <span className="block text-green-800 font-medium">{formData.joinDate}</span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 opacity-75">
                                    <span className="block text-xs text-green-600 uppercase tracking-wide">Events</span>
                                    <span className="block text-green-800 font-medium">{formData.eventsJoined}</span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 opacity-75">
                                    <span className="block text-xs text-green-600 uppercase tracking-wide">Trees</span>
                                    <span className="block text-green-800 font-medium">{formData.treesAdopted}</span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 opacity-75">
                                    <span className="block text-xs text-green-600 uppercase tracking-wide">Reports</span>
                                    <span className="block text-green-800 font-medium">{formData.reportsSubmitted}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="space-y-3">
                    <button 
                        onClick={handleSave}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Save Changes</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </button>
                    <button 
                        className="w-full bg-white border-2 border-gray-200 text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
                        onClick={editProfileProps.cancelCallback}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}
*/