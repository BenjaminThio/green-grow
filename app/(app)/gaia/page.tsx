import type { Metadata } from 'next';
import GaiaInterface from './gaia-client';

export const metadata: Metadata = { title: 'Gaia' };

/*
 * Server component shell — metadata lives here, all interactivity is in
 * the co-located client component ("client island" pattern).
 */
export default function Page() {
    return <GaiaInterface />;
}
