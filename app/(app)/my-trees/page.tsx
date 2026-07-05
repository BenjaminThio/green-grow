import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTreesByOwner } from '@/lib/data';
import { getCurrentUserDTO } from '@/lib/users';
import TreesList from './trees-list';
import PlantDoctorBot from './plant-doctor-bot';

export const metadata: Metadata = { title: 'My Trees' };

/*
 * Server component: the user's adopted trees come from the `trees`
 * collection. Adopting / watering / logging updates all revalidate this
 * path, so progress timelines are always current.
 */
export default async function MyTreesPage() {
    const user = await getCurrentUserDTO();
    if (!user) redirect('/clear-session');

    const trees = await getTreesByOwner(user.email);

    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-8">
                    <TreesList trees={trees} />
                </main>
                <PlantDoctorBot />
            </div>
        </div>
    );
}
