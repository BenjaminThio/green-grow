'use client';
import { type JSX } from 'react';
import { CreateUser, Email } from '@/utils/database';
import { GenerateSalt, GenerateSessionId, SetCookie } from '@/utils/auth';
import { useRef } from 'react';
import { Timestamp } from 'firebase/firestore';

interface UserInfo {
    username: string;
    email: string;
    password: string;
}

function Timestamp2Date(ts: Timestamp): string {
    const date = ts.toDate();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default function CreateUserPage(): JSX.Element {
    const userInfo = useRef<UserInfo>({
        username: '',
        email: '',
        password: ''
    });
    
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <div className='min-h-screen flex flex-col justify-center'>
                <div className='w-sm flex flex-col gap-4 p-6 items-center justify-center bg-purple-50 rounded-xl shadow-lg'>
                    <div className='font-bold text-xl text-purple-800'>
                        Create New User
                    </div>
                    <div>
                        <div className='mb-2 text-sm text-purple-800'>Username</div>
                        <input
                            className='block border border-purple-300 px-4 py-3 rounded-xl outline-none text-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent' placeholder='Enter your full name.'
                            onChange={(event) => {
                                userInfo.current.username = event.target.value;
                                //console.log(event.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <div className='mb-2 text-sm text-purple-800'>Email</div>
                        <input className='block border border-purple-300 px-4 py-3 rounded-xl outline-none text-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent' placeholder='example@domain.com'
                        onChange={(event) => {
                            userInfo.current.email = event.target.value;
                        }}
                        />
                    </div>
                    <div>
                        <div className='mb-2 text-sm text-purple-800'>Password</div>
                        <input className='block border border-purple-300 px-4 py-3 rounded-xl outline-none text-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent' placeholder='Create a password.'
                        onChange={(event) => {
                            userInfo.current.password = event.target.value;
                        }}
                        />
                    </div>
                    <button className='bg-purple-300 text-center px-4 py-3 rounded-xl text-purple-800 mt-4' onClick={async () => {
                        const sessionId: string = await GenerateSessionId();
                        const salt: string = await GenerateSalt();

                        CreateUser({
                            info: {
                                username: userInfo.current.username,
                                email: userInfo.current.email as Email,
                                password: userInfo.current.password,
                                imageBase64: null,
                                role: 'User',
                                joinDate: Timestamp2Date(Timestamp.now()),
                                eventsJoined: 0,
                                treesAdopted: 0,
                                reportsSubmitted: 0,
                                salt: salt
                            },
                            sessionId
                        });
                        SetCookie(sessionId);
                    }}>Generate New User</button>
                </div>
            </div>
        </div>
    );
}