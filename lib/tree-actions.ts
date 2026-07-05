'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTION_TREES } from './data';
import { getCurrentUser, incrementUserStat } from './users';
import { checkAndAwardAchievements } from './progress';
import type { ActionResult } from './event-actions';
import type { TreeDoc, TreeStatus } from './types';

const ok: ActionResult = { error: null, success: true };
const fail = (error: string): ActionResult => ({ error, success: false });

const MAX_PHOTO_CHARS = 250_000;

function revalidateTreeSurfaces() {
    revalidatePath('/my-trees');
    revalidatePath('/home');
    revalidatePath('/achievements');
}

export async function adoptTree(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
    const user = await getCurrentUser();
    if (!user) return fail('Please sign in first.');

    const name = String(formData.get('name') ?? '').trim();
    const species = String(formData.get('species') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    const lat = Number(formData.get('lat') || 0);
    const lng = Number(formData.get('lng') || 0);
    const photoBase64 = String(formData.get('photo') ?? '') || null;

    if (name.length < 2) return fail('Give your tree a name (2+ characters).');
    if (species.length < 2) return fail('Please enter the species.');
    if (!address) return fail('Where is your tree? Please enter a location.');
    if (photoBase64 && photoBase64.length > MAX_PHOTO_CHARS)
        return fail('Photo is too large — please pick a smaller one.');

    const now = Date.now();
    const tree: TreeDoc = {
        id: randomUUID(),
        ownerEmail: user.info.email,
        name,
        species,
        status: 'Healthy',
        location: { lat, lng, address },
        photoBase64,
        updates: [{ note: `${name} the ${species} was adopted! 🌱`, at: now, type: 'adopted' }],
        adoptedAt: now,
        lastWateredAt: now
    };

    await setDoc(doc(db, COLLECTION_TREES, tree.id), tree);
    await incrementUserStat(user.info.email, 'treesAdopted');
    await checkAndAwardAchievements(user.info.email);

    revalidateTreeSurfaces();
    return ok;
}

/** Ownership guard shared by the mutation actions below. */
async function getOwnedTree(treeId: string): Promise<{ tree: TreeDoc } | { error: string }> {
    const user = await getCurrentUser();
    if (!user) return { error: 'Please sign in first.' };

    const snapshot = await getDoc(doc(db, COLLECTION_TREES, treeId));
    if (!snapshot.exists()) return { error: 'Tree not found.' };

    const tree = snapshot.data() as TreeDoc;
    if (tree.ownerEmail !== user.info.email) return { error: 'This tree belongs to someone else.' };
    return { tree };
}

export async function waterTree(treeId: string): Promise<ActionResult> {
    const result = await getOwnedTree(treeId);
    if ('error' in result) return fail(result.error);

    await updateDoc(doc(db, COLLECTION_TREES, treeId), {
        status: 'Healthy' satisfies TreeStatus,
        lastWateredAt: Date.now(),
        updates: arrayUnion({ note: 'Watered the tree. 💧', at: Date.now(), type: 'watered' })
    });

    revalidateTreeSurfaces();
    return ok;
}

export async function addTreeUpdate(treeId: string, note: string, status?: TreeStatus): Promise<ActionResult> {
    const result = await getOwnedTree(treeId);
    if ('error' in result) return fail(result.error);

    const trimmed = note.trim();
    if (trimmed.length < 2) return fail('Please write a short note.');

    await updateDoc(doc(db, COLLECTION_TREES, treeId), {
        ...(status ? { status } : {}),
        updates: arrayUnion({ note: trimmed, at: Date.now(), type: status ? 'status' : 'note' })
    });

    revalidateTreeSurfaces();
    return ok;
}
