'use server';

import { redirect } from 'next/navigation';
import {
    EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH, EMAIL_REGEX,
    PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEX,
    USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX
} from './constants';
import {
    deleteSessionCookie, generateSalt, generateSessionId,
    hashPassword, setSessionCookie, verifyPassword, SESSION_DURATION_MS
} from './session';
import { createUser, doesUserExist, getUserByEmail, updateUser } from './users';
import type { Email } from './types';

/*
 * Server actions return an AuthState instead of throwing raw strings.
 * The forms consume this via useActionState, so validation errors render
 * inline instead of crashing the request — the main source of the old
 * "buggy" sign-in/sign-up behavior.
 */
export interface AuthState {
    error: string | null;
}

function formatJoinDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
}

function validateEmail(email: string): string | null {
    if (email.length < EMAIL_MIN_LENGTH || email.length > EMAIL_MAX_LENGTH || !EMAIL_REGEX.test(email))
        return 'Please enter a valid email address.';
    return null;
}

function validatePassword(password: string): string | null {
    if (password.length < PASSWORD_MIN_LENGTH)
        return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    if (password.length > PASSWORD_MAX_LENGTH)
        return `Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`;
    if (!PASSWORD_REGEX.test(password))
        return 'Password must contain an uppercase letter, a lowercase letter, a number, and a special character.';
    return null;
}

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
    const username = String(formData.get('username') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirm-password') ?? '');

    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH)
        return { error: `Username must be ${USERNAME_MIN_LENGTH}–${USERNAME_MAX_LENGTH} characters.` };
    if (!USERNAME_REGEX.test(username))
        return { error: 'Username can only contain letters, numbers, and underscores.' };

    const emailError = validateEmail(email);
    if (emailError) return { error: emailError };

    const passwordError = validatePassword(password);
    if (passwordError) return { error: passwordError };

    if (confirm && confirm !== password)
        return { error: 'Passwords do not match.' };

    if (await doesUserExist(email as Email))
        return { error: 'An account with this email already exists.' };

    const salt = generateSalt();
    const sessionId = generateSessionId();

    // FIX: the old code generated a salt but stored the PLAINTEXT password.
    const passwordHash = await hashPassword(password, salt);

    await createUser({
        info: {
            username,
            email: email as Email,
            passwordHash,
            salt,
            imageBase64: null,
            role: 'User',
            joinDate: formatJoinDate(new Date()),
            eventsJoined: 0,
            treesAdopted: 0,
            reportsSubmitted: 0
        },
        sessionId,
        sessionExpiresAt: Date.now() + SESSION_DURATION_MS,
        achievements: {},
        notifications: [
            {
                id: 1,
                title: 'Welcome to GreenGrow!',
                message: 'Adopt your first tree or join a community event to get started.',
                time: 'Just now',
                type: 'general',
                read: false
            }
        ]
    });

    await setSessionCookie(sessionId);
    redirect('/home');
}

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');

    // Same generic error for every failure path — never reveal whether
    // the email exists (the old code threw "User doesn't exist.").
    const INVALID = { error: 'Invalid email or password.' };

    if (validateEmail(email)) return INVALID;
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) return INVALID;

    // FIX: old code did `if (!DoesUserExist(email))` without await —
    // a Promise is always truthy, so the check never ran.
    const user = await getUserByEmail(email as Email);
    if (!user) return INVALID;

    // FIX: old code compared plaintext `password === userData.info.password`.
    const ok = await verifyPassword(password, user.info.salt, user.info.passwordHash);
    if (!ok) return INVALID;

    // FIX: rotate the session id on every sign-in instead of reusing
    // the one generated at sign-up forever.
    const sessionId = generateSessionId();
    await updateUser(email as Email, {
        sessionId,
        sessionExpiresAt: Date.now() + SESSION_DURATION_MS
    });

    await setSessionCookie(sessionId);
    redirect('/home');
}

export async function logOut(): Promise<void> {
    await deleteSessionCookie();
    redirect('/');
}
