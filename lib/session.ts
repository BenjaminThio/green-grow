import 'server-only';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_KEY = 'session-id';
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
            if (error) reject(error);
            else resolve(hash.toString('hex'));
        });
    });
}

/** Constant-time comparison — prevents timing attacks on the hash check. */
export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
    const actual = await hashPassword(password, salt);
    const a = Buffer.from(actual, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const generateSalt = (): string => crypto.randomBytes(16).toString('hex');

// 64 bytes is plenty of entropy; the old 512-byte id bloated every request.
export const generateSessionId = (): string => crypto.randomBytes(64).toString('hex');

export async function setSessionCookie(sessionId: string): Promise<void> {
    (await cookies()).set(SESSION_COOKIE_KEY, sessionId, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: Date.now() + SESSION_DURATION_MS
    });
}

export async function getSessionId(): Promise<string | undefined> {
    return (await cookies()).get(SESSION_COOKIE_KEY)?.value;
}

export async function deleteSessionCookie(): Promise<void> {
    (await cookies()).delete(SESSION_COOKIE_KEY);
}
