'use server';

import { db } from '@/db';
import { validateRequest } from './auth';
import { invitation } from '@/db/schema';

export async function createInvitation(
    type: 'friend' | 'group',
    receiverId: string,
) {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'no user' };
    }
    await db.insert(invitation).values({
        senderId: user.id,
        receiverId: receiverId,
        type: type,
    });
    return { success: true, error: null };
}
