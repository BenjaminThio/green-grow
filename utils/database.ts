'use server';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import db from "./firebase-config";
import { GetCurrentUserData } from "./auth";

export type Role = 'User' | 'Admin';
export type Email = `${string}@${string}`;
export type UserField = 'info.username' | 'info.password' | 'info.imageBase64' | 'info.salt' | 'sessionId' | 'notifications'

export interface UserInfoProps {
    username: string;
    email: Email;
    password: string;
    imageBase64: string | null;
    salt: string;
    role: Role;
    joinDate: string;
    eventsJoined: number;
    treesAdopted: number;
    reportsSubmitted: number;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'report' | 'reminder' | 'general';
    read: boolean;
}

export interface UserProps {
    info: UserInfoProps;
    sessionId: string;
    notifications: Notification[];
}

export async function DoesUserExist(email: Email): Promise<boolean> {
    try {
        return (await getDoc(doc(db, 'users', email))).exists();
    } catch (err) {
        console.error('DoesUserExist failed: ', err);
        throw(err);
    }
}

export async function CreateUser(userProps: UserProps): Promise<void> {
    if (await DoesUserExist(userProps.info.email)) {
        console.error('User already exists. Request denied.');
        return;
    }

    await setDoc(doc(db, 'users', userProps.info.email), {
        info: {
            username: userProps.info.username,
            email: userProps.info.email,
            password: userProps.info.password,
            imageBase64: userProps.info.imageBase64,
            role: userProps.info.role,
            joinDate: userProps.info.joinDate,
            eventsJoined: userProps.info.eventsJoined,
            treesAdopted: userProps.info.treesAdopted,
            reportsSubmitted: userProps.info.reportsSubmitted,
            salt: userProps.info.salt
        },
        notifications: userProps.notifications,
        sessionId: userProps.sessionId
    } as UserProps, {merge: false});
}

export async function UpdateUser(email: string, field: UserField, value: any): Promise<void> {
    if (await DoesUserExist(email as Email))
        await updateDoc(doc(db, 'users', email), {
            [field]: value
        });
    else
        console.error('User not found.');
}

export async function UpdateUserInfo(email: string, username: string, password: string, role: string, imageBase64: string | null): Promise<void> {
    if (await DoesUserExist(email as Email))
        await setDoc(doc(db, 'users', email), {
            info: {
                username: username,
                password: password,
                role: role,
                imageBase64: imageBase64,
            }
        } as UserProps, {merge: true});
    else
        console.error('User not found.');
}

export async function GetUserData(email: Email): Promise<UserProps | null> {
    try {
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as UserProps;
        } else {
            console.log("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting password:", error);
        return null;
    }
}

export async function GetNotifications(): Promise<Notification[] | null> {
    const userData: UserProps | null = await GetCurrentUserData() as UserProps | null;
    
    if (!userData) return null;

    return userData.notifications;
}