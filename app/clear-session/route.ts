import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_KEY } from '@/lib/session';

/*
 * Breaks the stale-cookie redirect loop.
 *
 * The middleware can only check that a session cookie EXISTS (it can't hit
 * Firestore cheaply), so a cookie that no longer maps to a valid session
 * would bounce forever: middleware -> /home -> page finds no user ->
 * /sign-in -> middleware sees the cookie -> /home -> ...
 *
 * When a server component discovers the session is invalid it redirects
 * HERE instead of straight to /sign-in. This route handler deletes the
 * cookie (route handlers are allowed to write cookies) and then sends the
 * user to /sign-in with no cookie, so the middleware lets them through.
 */
export function GET(request: NextRequest) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete(SESSION_COOKIE_KEY);
    return response;
}
