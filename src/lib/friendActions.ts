'use server';

import { db } from '@/db';
import { validateRequest } from './auth';
import { friendship, invitation } from '@/db/schema';
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

export async function acceptFriendRequest(
    invitationId: string,
    senderId: string,
) {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'no user' };
    }

    await db
        .update(invitation)
        .set({
            status: 'accepted',
        })
        .where(eq(invitation.id, invitationId));

    const receiverFriendList = await db.query.friendList.findFirst({
        where: (friendList, { eq }) => eq(friendList.userId, user.id),
    });
    const senderFriendList = await db.query.friendList.findFirst({
        where: (friendList, { eq }) => eq(friendList.userId, senderId),
    });

    if (senderFriendList === undefined) {
        return { success: false, error: 'no sender friend list' };
    }
    if (receiverFriendList === undefined) {
        return { success: false, error: 'no receiver friend list' };
    }

    await db.insert(friendship).values({
        friendListId: receiverFriendList.id,
        friendId: senderId,
    });

    await db.insert(friendship).values({
        friendListId: senderFriendList.id,
        friendId: user.id,
    });

    return { success: true, error: null };
}
