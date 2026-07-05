import { NextRequest, NextResponse } from 'next/server';

/*
 * Optimistic auth check at the edge: only verifies the session cookie
 * EXISTS (no database call — middleware must stay fast). Real session
 * validation happens in the server components via getCurrentUser().
 */

const PUBLIC_PATHS = new Set(['/', '/sign-in', '/sign-up', '/clear-session']);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = request.cookies.has('session-id');

    // /clear-session must always be reachable so a stale cookie can be
    // cleared — never redirect away from it.
    if (pathname === '/clear-session') return NextResponse.next();

    // Signed-in users don't need the auth pages.
    if (hasSession && (pathname === '/sign-in' || pathname === '/sign-up'))
        return NextResponse.redirect(new URL('/home', request.url));

    // Everything outside the public set requires a session cookie.
    if (!hasSession && !PUBLIC_PATHS.has(pathname))
        return NextResponse.redirect(new URL('/sign-in', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)).*)']
};
