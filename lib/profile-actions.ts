'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser, updateUser } from './users';
import { hashPassword, verifyPassword, generateSalt } from './session';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from './constants';

export interface ProfileActionState {
    error: string | null;
    success: boolean;
}

/** Update username / profile picture. User is derived from the session. */
export async function updateProfile(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not signed in.', success: false };

    const username = String(formData.get('username') ?? '').trim();
    const imageBase64 = formData.get('imageBase64') as string | null;

    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH)
        return { error: `Username must be ${USERNAME_MIN_LENGTH}–${USERNAME_MAX_LENGTH} characters.`, success: false };
    if (!USERNAME_REGEX.test(username))
        return { error: 'Username can only contain letters, numbers, and underscores.', success: false };

    await updateUser(user.info.email, {
        'info.username': username,
        ...(imageBase64 ? { 'info.imageBase64': imageBase64 } : {})
    });

    revalidatePath('/', 'layout');
    return { error: null, success: true };
}

/** Change password: requires the CURRENT password, stores a new hash. */
export async function changePassword(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
    const user = await getCurrentUser();
    if (!user) return { error: 'Not signed in.', success: false };

    const current = String(formData.get('current-password') ?? '');
    const next = String(formData.get('new-password') ?? '');

    const ok = await verifyPassword(current, user.info.salt, user.info.passwordHash);
    if (!ok) return { error: 'Current password is incorrect.', success: false };

    if (next.length < PASSWORD_MIN_LENGTH || next.length > PASSWORD_MAX_LENGTH || !PASSWORD_REGEX.test(next))
        return { error: 'New password must be 8–64 chars with upper, lower, number & symbol.', success: false };

    const salt = generateSalt();
    const passwordHash = await hashPassword(next, salt);
    await updateUser(user.info.email, {
        'info.salt': salt,
        'info.passwordHash': passwordHash
    });

    return { error: null, success: true };
}
