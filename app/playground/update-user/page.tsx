'use client';
import { UpdateUser } from '@/utils/database';
import { useRef } from 'react';

interface UserInfo {
    username: string;
    email: string;
    password: string;
}

export default function UpdateUserPage() {
    const userInfo = useRef<UserInfo>({
        username: '',
        email: '',
        password: ''
    });
    
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <div className='min-h-screen flex flex-col justify-center'>
                <div className='w-md flex flex-col gap-4 p-6 items-center justify-center bg-purple-50 rounded-xl shadow-lg'>
                    <div className='font-bold text-xl text-purple-800'>
                        Update User Data
                    </div>
                    <div className='w-full'>
                        <div className='mb-2 text-sm text-purple-800'>Email</div>
                        <input className='w-full border border-purple-300 px-4 py-3 rounded-xl outline-none text-purple-500' placeholder='example@domain.com'
                        onChange={(event) => {
                            userInfo.current.email = event.target.value;
                        }}
                        />
                    </div>
                    <div className='w-full border border-purple-300 p-4 rounded-xl'>
                        <div className='mb-2 text-sm text-purple-800'>Username</div>
                        <div className='flex mb-4'>
                            <input
                                className='flex-1 border border-purple-300 px-4 py-3 rounded-l-xl outline-none text-purple-500'
                                placeholder='Enter your new full name.'
                                onChange={(event) => {
                                    userInfo.current.username = event.target.value;
                                    //console.log(event.target.value);
                                }}
                            />
                            <button className='border border-purple-300 bg-purple-300 px-4 py-3 text-purple-500 rounded-r-xl'
                            onClick={async () => {
                                UpdateUser(userInfo.current.email, 'info.username', userInfo.current.username);
                            }}>
                                Update
                            </button>
                        </div>
                        <div className='mb-2 text-sm text-purple-800'>Password</div>
                        <div className='flex'>
                            <input className='flex-1 border border-purple-300 px-4 py-3 rounded-l-xl outline-none text-purple-500'
                            placeholder='Create a new password.'
                            onChange={(event) => {
                                userInfo.current.password = event.target.value;
                            }}
                            />
                            <button className='border border-purple-300 bg-purple-300 px-4 py-3 text-purple-500 rounded-r-xl'
                            onClick={async () => {
                                await UpdateUser(userInfo.current.email, 'info.password', userInfo.current.password);
                            }}>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}