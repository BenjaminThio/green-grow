'use client';

import { useActionState, useRef, useState } from 'react';
import Image from 'next/image';
import { Mail, Calendar, Edit2, LogOut as LogOutIcon, Camera, Save, X, User, Lock, AlertCircle, CheckCircle2, Loader2, Trees, CalendarDays, FileWarning } from 'lucide-react';
import { logOut } from '@/lib/auth-actions';
import { updateProfile, changePassword, ProfileActionState } from '@/lib/profile-actions';
import { Image2Base64 } from '@/lib/image';
import PasswordInput from '@/components/ui/password-input';
import type { UserDTO } from '@/lib/types';

const initialState: ProfileActionState = { error: null, success: false };

export default function ProfileView({ user }: { user: UserDTO }) {
    const [editing, setEditing] = useState(false);

    return editing
        ? <EditProfile user={user} onDone={() => setEditing(false)} />
        : <Profile user={user} onEdit={() => setEditing(true)} />;
}

function Avatar({ imageBase64, username, size = 96 }: { imageBase64: string | null; username: string; size?: number }) {
    if (imageBase64) {
        return (
            <Image
                src={imageBase64}
                alt="Profile picture"
                width={size}
                height={size}
                unoptimized
                className="rounded-full object-cover border-4 border-white/10 shadow-lg"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl font-bold border-4 border-white/10 shadow-lg"
            style={{ width: size, height: size }}
        >
            {username.charAt(0).toUpperCase()}
        </div>
    );
}

function Profile({ user, onEdit }: { user: UserDTO; onEdit: () => void }) {
    const stats = [
        { icon: CalendarDays, label: 'Events Joined', value: user.eventsJoined },
        { icon: Trees, label: 'Trees Adopted', value: user.treesAdopted },
        { icon: FileWarning, label: 'Reports Submitted', value: user.reportsSubmitted }
    ];

    return (
        <div className="w-full max-w-md glass-card rounded-3xl p-8 animate-fade-in-up">
            <div className="flex justify-center mb-6">
                <Avatar imageBase64={user.imageBase64} username={user.username} />
            </div>

            <h1 className="text-2xl font-display font-bold text-center mb-1">{user.username}</h1>
            <p className="text-center text-green-400 text-xs font-bold uppercase tracking-widest mb-8">{user.role}</p>

            <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-2 text-gray-400"><Mail size={14} /> Email</span>
                    <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-2 text-gray-400"><Calendar size={14} /> Joined</span>
                    <span>{user.joinDate}</span>
                </div>
                {stats.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center gap-2 text-gray-400"><Icon size={14} /> {label}</span>
                        <span className="font-bold text-green-300">{value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 space-y-3">
                <button
                    onClick={onEdit}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/40 transition-all"
                >
                    <Edit2 size={16} /> Edit Profile
                </button>
                <form action={logOut}>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-300 font-bold py-3 rounded-xl transition-all"
                    >
                        <LogOutIcon size={16} /> Log Out
                    </button>
                </form>
            </div>
        </div>
    );
}

function EditProfile({ user, onDone }: { user: UserDTO; onDone: () => void }) {
    const [profileState, profileAction, profilePending] = useActionState(updateProfile, initialState);
    const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, initialState);
    const [imageBase64, setImageBase64] = useState<string | null>(user.imageBase64);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageBase64(await Image2Base64(file));
    };

    return (
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">
            <form action={profileAction} className="glass-card rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-display font-bold">Edit Profile</h2>
                    <button type="button" onClick={onDone} aria-label="Close" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex justify-center mb-6">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="relative group">
                        <Avatar imageBase64={imageBase64} username={user.username} />
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={22} />
                        </div>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    {imageBase64 && <input type="hidden" name="imageBase64" value={imageBase64} />}
                </div>

                <label className="flex items-center gap-2 text-green-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <User size={14} /> Username
                </label>
                <input
                    name="username"
                    defaultValue={user.username}
                    className="glass-input w-full px-4 py-3.5 rounded-xl text-white transition-all mb-4"
                    required
                />

                <ActionFeedback state={profileState} successMessage="Profile updated!" />

                <button
                    type="submit"
                    disabled={profilePending}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/40 transition-all"
                >
                    {profilePending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                </button>
            </form>

            <form action={passwordAction} className="glass-card rounded-3xl p-8">
                <h2 className="flex items-center gap-2 text-xl font-display font-bold mb-6">
                    <Lock size={18} className="text-green-400" /> Change Password
                </h2>

                <label className="block text-green-300 text-xs font-bold uppercase tracking-wider mb-2">Current Password</label>
                <div className="mb-4">
                    <PasswordInput name="current-password" placeholder="Enter current password" autoComplete="current-password" />
                </div>

                <label className="block text-green-300 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
                <div className="mb-4">
                    <PasswordInput name="new-password" placeholder="Enter new password" autoComplete="new-password" />
                </div>

                <ActionFeedback state={passwordState} successMessage="Password changed!" />

                <button
                    type="submit"
                    disabled={passwordPending}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all"
                >
                    {passwordPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    Update Password
                </button>
            </form>
        </div>
    );
}

function ActionFeedback({ state, successMessage }: { state: ProfileActionState; successMessage: string }) {
    if (state.error) {
        return (
            <div role="alert" className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                <AlertCircle size={16} className="shrink-0" /> {state.error}
            </div>
        );
    }
    if (state.success) {
        return (
            <div role="status" className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4">
                <CheckCircle2 size={16} className="shrink-0" /> {successMessage}
            </div>
        );
    }
    return null;
}
