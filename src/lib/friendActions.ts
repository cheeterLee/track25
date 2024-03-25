'use server';

import { db } from '@/db';
import { validateRequest } from './auth';
import { friendship, group, groupMember, invitation, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function createInvitation(
    type: 'friend' | 'group',
    receiverId: string,
    groupId?: string,
) {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'no user' };
    }
    await db.insert(invitation).values({
        senderId: user.id,
        receiverId: receiverId,
        type: type,
        groupId: groupId === undefined ? null : groupId,
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
        userId: user.id,
        friendId: senderId,
    });

    await db.insert(friendship).values({
        friendListId: senderFriendList.id,
        userId: senderId,
        friendId: user.id,
    });

    return { success: true, error: null };
}

export async function deleteFriend(friendId: string) {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'no user' };
    }
    await db
        .delete(friendship)
        .where(
            and(
                eq(friendship.friendId, friendId),
                eq(friendship.userId, user.id),
            ),
        );
    await db
        .delete(friendship)
        .where(
            and(
                eq(friendship.userId, friendId),
                eq(friendship.friendId, user.id),
            ),
        );
    return { success: true, error: null };
}

export async function createGroup(groupName: string, friendIds: string[]) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: 'no user' };
    }

    const { id: groupId } = (
        await db
            .insert(group)
            .values({
                creatorId: user.id,
                groupName: groupName,
            })
            .returning()
    )[0];

    await db.insert(groupMember).values({
        groupId: groupId,
        userId: user.id,
    });

    for (const fid of friendIds) {
        await createInvitation('group', fid, groupId);
    }

    return { success: true, error: null };
}

export async function acceptGroupInvitation(
    invitationId: string,
    groupId: string,
) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: 'no user' };
    }

    await db.insert(groupMember).values({
        groupId: groupId,
        userId: user.id,
    });

    await db
        .update(invitation)
        .set({
            status: 'accepted',
        })
        .where(eq(invitation.id, invitationId));

    return { success: true, error: null };
}

export async function quitGroup(groupId: string) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: 'no user' };
    }

    await db.delete(groupMember).where(eq(groupMember.userId, user.id));

    return { success: true, error: null };
}

export async function searchUser(searchText: string) {
    const { user: authUser } = await validateRequest();

    if (!authUser) {
        return { success: false, error: 'no user' };
    }

    const regex = new RegExp(searchText);
    const allUsers = await db.select().from(user);
    const matchedUsers = allUsers.filter(
        (u) => regex.test(u.username) && u.id != authUser.id,
    );
    return { matchedUsers };
}
