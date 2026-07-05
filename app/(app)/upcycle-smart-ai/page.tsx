import type { Metadata } from 'next';
import UpcycleAIPage from './upcycle-client';

export const metadata: Metadata = { title: 'Upcycle Smart AI' };

/*
 * Server component shell — metadata lives here, all interactivity is in
 * the co-located client component ("client island" pattern).
 */
export default function Page() {
    return <UpcycleAIPage />;
}
