'use client';
import Link from 'next/link';
import { type JSX } from 'react';
import Tilt from 'react-parallax-tilt';

export default function HomePage(): JSX.Element {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} tiltReverse={true}  style={{transformStyle: 'preserve-3d'}} className='bg-purple-50 p-6 rounded-xl w-sm space-y-4 shadow-xl'>
                <div style={{transformStyle: 'preserve-3d', transform: 'translateZ(20px)'}} className='text-purple-800 font-bold mb-2 text-2xl text-center'>
                    Menu
                </div>
                <div style={{transformStyle: 'preserve-3d'}}>
                    <div style={{transform: 'translateZ(20px)'}} className='text-purple-600 font-bold mb-2'>Designs</div>
                    <div style={{transformStyle: 'preserve-3d'}} className='flex border-2 border-purple-300 px-3 py-2 rounded-xl text-sm text-purple-500'>
                        <Link style={{transform: 'translateZ(10px)'}} href='/benjamin/sign-up'>Sign Up</Link>
                    </div>
                </div>
                <div style={{transformStyle: 'preserve-3d'}}>
                    <div style={{transform: 'translateZ(20px)'}} className='text-purple-600 font-bold mb-2'>Playground</div>
                    <div style={{transformStyle: 'preserve-3d'}} className='flex flex-col border-2 border-purple-300 px-3 py-2 rounded-xl text-sm text-purple-500'>
                        <Link style={{transform: 'translateZ(15px)'}} href='/playground/create-user'>Create User</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/playground/update-user'>Update User</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/playground/tilt-effect'>Tilt Effect</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/playground/fontawesome'>Fontawesome</Link>
                    </div>
                </div>
                <div style={{transformStyle: 'preserve-3d'}}>
                    <div style={{transform: 'translateZ(20px)'}} className='text-purple-600 font-bold mb-2'>Components</div>
                    <div style={{transformStyle: 'preserve-3d'}} className='flex flex-col border-2 border-purple-300 px-3 py-2 rounded-xl text-sm text-purple-500'>
                        <Link style={{transform: 'translateZ(15px)'}} href='/components/apps'>Light Bulb</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/components/dropdown'>Dropdown</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/components/image'>Image to Base64</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/components/switch'>Switch</Link>
                        <Link style={{transform: 'translateZ(15px)'}} href='/components/shapes'>Shapes</Link>
                    </div>
                </div>
                <div style={{transformStyle: 'preserve-3d'}}>
                    <div style={{transform: 'translateZ(20px)'}} className='text-purple-600 font-bold mb-2'>Test</div>
                    <div style={{transformStyle: 'preserve-3d'}} className='flex border-2 border-purple-300 px-3 py-2 rounded-xl text-sm text-purple-500'>
                        <Link style={{transform: 'translateZ(10px)'}} href='/benjamin/game'>Game</Link>
                    </div>
                </div>
            </Tilt>
        </div>
    );
}