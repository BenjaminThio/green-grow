'use client';
import { type JSX } from 'react';
import Tilt from 'react-parallax-tilt';

export default function TiltEffectPage(): JSX.Element {
    return (
        <div className='min-h-screen flex justify-center items-center'>
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='bg-cyan-300 h-60 aspect-square flex justify-center items-center'>
                Hello World
            </Tilt>
        </div>
    );
}