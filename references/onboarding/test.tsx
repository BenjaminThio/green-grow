import Link from 'next/link';
import { type JSX } from 'react';

export default function OnboardingPage(): JSX.Element {
    return (
        <div className='space-y-5 flex flex-col items-center p-6'>
            <div className='mb-8 '>
                <div className='text-green-700 text-4xl font-bold mb-2 sm:text-5xl text-center'>Title</div>
                <div className='text-green-600 text-xl sm:text-2xl text-center'>Description</div>
            </div>
            <div className='w-xs sm:w-md'>
                <div className='bg-green-50 p-6 rounded-2xl mb-8'>
                    <div className='bg-green-700 p-10 text-white text-center rounded-xl mb-6'>
                        Testing123
                    </div>
                    <div className='text-center text-green-800 font-bold text-xl mb-3 sm:text-2xl'>
                        Title
                    </div>
                    <div className='text-center text-green-700 mb-6'>
                        Description
                    </div>
                    <div className='flex justify-center gap-2'>
                        <div className='w-5 h-2 sm:w-7 sm:h-3 bg-green-600 rounded-full transition-all'/>
                        <div className='w-2 sm:w-3 aspect-square bg-green-300 rounded-full transition-all'/>
                        <div className='w-2 sm:w-3 aspect-square bg-green-300 rounded-full transition-all'/>
                    </div>
                    <div className='flex justify-between'>
                        <button className='bg-green-600 px-4 sm:px-6 py-2 rounded-full text-white font-bold'>Previous</button>
                        <button className='bg-green-600 px-4 sm:px-6 py-2 rounded-full text-white font-bold'>Next</button>
                    </div>
                </div>
                <div className='space-y-3'>
                    <Link href='/benjamin/sign-up' className='block bg-green-600 rounded-full text-center w-full py-3 text-white font-bold'>Create Account</Link>
                    <Link href='/benjamin/sign-up' className='block bg-green-600 rounded-full text-center w-full py-3 text-white font-bold'>Sign in</Link>
                </div>
            </div>
        </div>
    );
}