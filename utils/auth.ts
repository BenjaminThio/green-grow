'use server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { UserProps, CreateUser, Email, DoesUserExist, GetUserData } from './database';
import { redirect } from 'next/navigation';
import { collection, getDocs, limit, query, Timestamp, where } from 'firebase/firestore';
import db from './firebase-config';
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH, EMAIL_REGEX, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from "./constants";

export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean,
            httpOnly?: boolean,
            sameSite: 'strict' | 'lax',
            expires?: number
        }) => void,
    get: (key: string) => {name: string, value: string} | undefined,
    delete: (key: string) => void
}

const SESSION_COOKIE_KEY: string = 'session-id';
const SESSION_COOKIE_EXPIRATION_DURATION: number = 7 * 24 * 60 * 60 * 1000;
const COLLECTION_USERS: string = 'users';

export async function HashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error: Error | null, hash: Buffer<ArrayBufferLike>) => {
            if (error) reject(error);

            resolve(hash.toString('hex').normalize());
        });
    });
}

export const GenerateSalt = async (): Promise<string> => crypto.randomBytes(16).toString('hex').normalize();

export const GenerateSessionId = async (): Promise<string> => crypto.randomBytes(512).toString('hex').normalize();

export async function SetCookie(sessionId: string): Promise<void> {
    (await cookies()).set(SESSION_COOKIE_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        expires: Date.now() + SESSION_COOKIE_EXPIRATION_DURATION
    });
}

export const GetSessionId = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE_KEY)?.value;

export async function GetCurrentUserData(): Promise<UserProps | null> {
    const sessionId = await GetSessionId();

    if (!sessionId) return null;

    const snapshot = await getDocs(
        query(
            collection(db, COLLECTION_USERS),
            where('sessionId', '==', sessionId),
            limit(1)
        )
    );

    if (snapshot.empty) return null;

    return snapshot.docs[0].data() as UserProps;
}

export async function GetCurrentUserEmail() {
    const userData = await GetCurrentUserData();

    if (!userData) return;

    return userData.info.email;
}

export async function DeleteSession(): Promise<void> {
    if (GetSessionId() !== undefined) (await cookies()).delete(SESSION_COOKIE_KEY);
    else console.log('There is no cookie to delete.');
}

export async function LogOut(): Promise<void> {
    await DeleteSession();
    redirect('/');
}

export async function SignUp(formData: FormData): Promise<void> {
    function Timestamp2Date(ts: Timestamp): string {
        const date = ts.toDate();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const username: string = formData.get('username') as string;
    const email: string = formData.get('email') as string;
    const password: string = formData.get('password') as string;
    const salt: string = await GenerateSalt();
    const sessionId: string = await GenerateSessionId();

    if (username.length < USERNAME_MIN_LENGTH) throw(`Username must be at least ${USERNAME_MIN_LENGTH} characters.`);
    if (username.length > USERNAME_MAX_LENGTH) throw(`Username must not exceed ${USERNAME_MAX_LENGTH} characters.`);
    if (!USERNAME_REGEX.test(username)) throw('Username can only contain letters, numbers, and underscores.');

    if (email.length < EMAIL_MIN_LENGTH) throw(`Email must be at least ${EMAIL_MIN_LENGTH} characters.`);
    if (email.length > EMAIL_MAX_LENGTH) throw(`Email must not exceed ${EMAIL_MAX_LENGTH} characters.`);
    if (!EMAIL_REGEX.test(email)) throw('Invalid email format.');

    if (password.length < PASSWORD_MIN_LENGTH) throw(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
    if (password.length > PASSWORD_MAX_LENGTH) throw(`Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`);
    if (!PASSWORD_REGEX.test(password)) throw('Password must contain at least one uppercase, lowercase, number, and special character.');

    CreateUser({
        info: {
            username: username,
            email: email as Email,
            password: password,
            imageBase64: null,
            role: 'User',
            joinDate: Timestamp2Date(Timestamp.now()),
            eventsJoined: 0,
            treesAdopted: 0,
            reportsSubmitted: 0,
            salt: salt
        },
        notifications: [
            {
                id: 1,
                title: "Report Status Updated",
                message: "Your report regarding 'Fallen Branch in Zone A' has been marked as Resolved.",
                time: "10 mins ago",
                type: "report",
                read: false
            },
            {
                id: 2,
                title: "Watering Reminder",
                message: "It's time to water your White Oak 'Oakley'. The soil moisture is low.",
                time: "2 hours ago",
                type: "reminder",
                read: false
            },
            {
                id: 3,
                title: "New Badge Earned!",
                message: "Congratulations! You've earned the 'Community Hero' badge.",
                time: "1 day ago",
                type: "general",
                read: false
            },
            {
                id: 4,
                title: "Event Reminder",
                message: "The 'Community Park Cleanup' event starts tomorrow at 9:00 AM.",
                time: "1 day ago",
                type: "reminder",
                read: true
            }
        ],
        sessionId: sessionId
    });
    await SetCookie(sessionId);
}

export async function SignIn(formData: FormData): Promise<void> {
    const email: string = formData.get('email') as string;
    const password: string = formData.get('password') as string;

    if (email.length < EMAIL_MIN_LENGTH) return;
    if (email.length > EMAIL_MAX_LENGTH) return;
    if (!EMAIL_REGEX.test(email)) return;
    if (!DoesUserExist(email as Email)) {
        throw("User doesn't exist.");
    };

    if (password.length < PASSWORD_MIN_LENGTH) return;
    if (password.length > PASSWORD_MAX_LENGTH) return;

    const userData: UserProps | null = await GetUserData(email as Email);

    if (userData === null) return;
    if (password === userData.info.password) {
        await SetCookie(userData.sessionId);
        redirect('/home');
    }
}