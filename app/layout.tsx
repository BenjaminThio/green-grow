import type { Metadata, Viewport } from 'next';
import { Montserrat, Plus_Jakarta_Sans, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

/*
 * Root layout is a SERVER component and stays minimal on purpose.
 * The navbar + header live in app/(app)/layout.tsx so they only wrap
 * the pages that actually need them — no more pathname checks inside
 * the navbar to hide itself on auth pages.
 */

const jakarta = Plus_Jakarta_Sans({
    variable: '--font-jakarta',
    subsets: ['latin'],
    display: 'swap'
});

const montserrat = Montserrat({
    variable: '--font-montserrat',
    subsets: ['latin'],
    display: 'swap'
});

const techMono = Share_Tech_Mono({
    variable: '--font-tech-mono',
    subsets: ['latin'],
    weight: '400',
    display: 'swap'
});

export const metadata: Metadata = {
    title: {
        default: 'GreenGrow',
        template: '%s | GreenGrow'
    },
    description: 'Grow greener communities — adopt trees, join events, and report issues.'
};

export const viewport: Viewport = {
    themeColor: '#052e16'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${jakarta.variable} ${montserrat.variable} ${techMono.variable} antialiased`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
