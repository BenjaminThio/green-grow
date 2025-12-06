'use client';
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Email, Role } from "@/utils/database";
import { LogOut } from "@/utils/auth";
import { EditProfile } from "./edit-profile";
import { Profile } from "./profile";

export interface UserInfo {
    username: string;
    role: Role;
    email: Email;
    password: string;
    imageBase64: string | null;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
}

export default function ProfilePage() {
    const [edit, setEdit] = useState<boolean>(false);
    const router = useRouter();

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative bg-[#052e16]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
                
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                h1, h2, h3, .font-display { font-family: 'Montserrat', sans-serif; }

                .ambient-bg {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
                    background: radial-gradient(circle at 15% 50%, rgba(22, 163, 74, 0.15), transparent 25%),
                                radial-gradient(circle at 85% 30%, rgba(163, 230, 53, 0.1), transparent 25%);
                    background-color: #022c22; pointer-events: none;
                }

                .gradient-blob {
                    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; z-index: -1;
                }
                .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #166534; animation: blob 20s infinite alternate; }
                .blob-2 { bottom: -10%; right: -10%; width: 600px; height: 600px; background: #14532d; animation: blob 25s infinite alternate-reverse; }

                /* Glass Utilities */
                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
            <div className="ambient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
            </div>
            <div className='flex-1 p-4 relative z-10 flex flex-col items-center justify-center min-h-screen py-12'>
                <button 
                    onClick={() => {router.back();}} 
                    className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/80 hover:text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {
                    edit
                    ? <EditProfile
                        saveChangesCallback={() => {setEdit(false);}}
                        cancelCallback={() => {setEdit(false);}}
                    />
                    : <Profile
                        editProfileCallback={() => {setEdit(true);}}
                        privacySettingsCallback={() => {}}
                        logoutCallback={LogOut}
                    />
                }
            </div>
        </div>
    );
}

/*
'use client';
import { useState } from "react";
import Profile from "./profile";
import EditProfile from "./edit-profile";
import { LogOut } from "@/utils/auth";

export default function ProfilePage() {
    const [edit, setEdit] = useState<boolean>(false);

    return (
    <div className='min-h-screen bg-green-50 flex flex-col'>
        <div className='flex-1 p-4 overflow-y-auto'>
            {
            edit
            ?
            <EditProfile
                saveChangesCallback={() => {setEdit(false);}}
                cancelCallback={() => {setEdit(false);}}
            />
            :
            <Profile
                editProfileCallback={() => {setEdit(true);}}
                privacySettingsCallback={() => {}}
                logoutCallback={LogOut}
            />
            }
        </div>
      </div>
    );
}
*/