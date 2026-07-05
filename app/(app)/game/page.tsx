import type { Metadata } from 'next';
import GamePage from './game-client';

export const metadata: Metadata = { title: 'Game' };

/*
 * Server component shell — metadata lives here, all interactivity is in
 * the co-located client component ("client island" pattern).
 */
export default function Page() {
    return <GamePage />;
}
