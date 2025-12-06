'use client';

import { ChangeEvent, useEffect, useState } from "react";
import { UserInfo } from "./page";
import { GetCurrentUserData } from "@/utils/auth";
import { UpdateUserInfo, UserProps } from "@/utils/database";
import Image from "next/image";
import { 
    Mail, 
    Camera, 
    Save, 
    X, 
    User, 
    Info
} from "lucide-react";
import { Image2Base64 } from "@/utils/image";
import { Password } from "./password";
import { refreshHeader } from './../components/header/header';

interface EditProfileProps {
    saveChangesCallback: () => void;
    cancelCallback: () => void;
}

export function EditProfile({ saveChangesCallback, cancelCallback }: EditProfileProps) {
    const [formData, setFormData] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        GetCurrentUserData().then((data) => {
            const userData: UserProps = data as UserProps;

            setFormData({
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
        refreshHeader();
        setLoading(false);
        saveChangesCallback();
    };

    if (!formData) return (
        <div className="w-full max-w-md mx-auto animate-pulse glass-card rounded-[40px] p-8">
            <div className="h-24 bg-white/10 rounded-full w-24 mx-auto mb-8"></div>
            <div className="space-y-6">
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
                        onClick={cancelCallback}
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