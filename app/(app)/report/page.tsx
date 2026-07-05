import type { Metadata } from 'next';
import ReportForm from './report-form';

export const metadata: Metadata = { title: 'Report an Issue' };

export default function ReportPage() {
    return (
        <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden relative">
            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
                    <ReportForm />
                </main>
            </div>
        </div>
    );
}
