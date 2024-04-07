'use server';

import { db } from '@/db';
import { validateRequest } from '../lib/auth';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function changeUsername(changedUsername: string) {
    const { user: authUser } = await validateRequest();
    if (!authUser) {
        return { success: false, error: 'no user' };
    }

    if (changedUsername === authUser.username) {
        return { success: false, error: 'username cannot be the same' };
    }

    await db
        .update(user)
        .set({
            username: changedUsername,
        })
        .where(eq(user.id, authUser.id));

    return { success: true, error: null };
}
