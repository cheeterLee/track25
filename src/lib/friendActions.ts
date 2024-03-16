'use server';

import { db } from '@/db';
import { validateRequest } from './auth';
import { invitation } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

export async function rejectRequest(invitationId: string) {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'no user' };
    }
    await db
        .update(invitation)
        .set({
            status: 'rejected',
        })
        .where(eq(invitation.id, invitationId));
    return { success: true, error: null };
}

export async function acceptFriendRequest() {}
