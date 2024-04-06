'use server';

import { db } from '@/db';
import { access, accessList, group } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function shareWithUser(
    trackId: string | undefined,
    userIds: string[] | undefined,
) {
    if (!trackId || !userIds) {
        return { success: false, error: 'no trackId or no userIds' };
    }

    const accessListForTrack = await db.query.accessList.findFirst({
        where: eq(accessList.trackId, trackId),
    });

    if (!accessListForTrack) {
        return {
            success: false,
            error: 'cannot find corresponding access list for track',
        };
    }

    const userWithAccessToTrack = (
        await db.query.access.findMany({
            where: eq(access.accessListId, accessListForTrack.id),
            with: {
                userWithAccess: {
                    columns: {
                        id: true,
                    },
                },
            },
        })
    ).map((el) => el.userWithAccess.id);

    for (const userId of userIds) {
        if (!userWithAccessToTrack.includes(userId)) {
            await db.insert(access).values({
                accessListId: accessListForTrack.id,
                userId: userId,
            });
        }
    }

    return { success: true, error: null };
}

export async function removeUserAccess(
    trackId: string | undefined,
    userId: string,
) {
    if (!trackId) {
        return { success: false, error: 'no trackId' };
    }

    const data = await db.query.accessList.findFirst({
        where: eq(accessList.trackId, trackId),
    });

    if (!data) {
        return {
            success: false,
            error: 'cannot find corresponding access list for track',
        };
    }

    await db
        .delete(access)
        .where(
            and(eq(access.userId, userId), eq(access.accessListId, data.id)),
        );

    return { success: true, error: null };
}

export async function shareWithGroup(
    trackId: string | undefined,
    groupIds: string[],
) {
    if (!trackId) {
        return { success: false, error: 'no trackId' };
    }

    // Get the corresponding access list for given track id
    const accessListForTrack = await db.query.accessList.findFirst({
        where: eq(accessList.trackId, trackId),
    });

    if (!accessListForTrack) {
        return {
            success: false,
            error: 'cannot find corresponding access list for track',
        };
    }

    // Get all the existing user that have access to the track
    const userWithAccessToTrack = (
        await db.query.access.findMany({
            where: eq(access.accessListId, accessListForTrack.id),
            with: {
                userWithAccess: {
                    columns: {
                        id: true,
                    },
                },
            },
        })
    ).map((el) => el.userWithAccess.id);

    groupIds.forEach(async (gId) => {
        const data = await db.query.group.findFirst({
            where: eq(group.id, gId),
            with: {
                groupMembers: {
                    columns: {
                        userId: true,
                    },
                },
            },
        });
        if (!data) {
            return { success: false, error: 'cannot find corresponding group' };
        }
        data.groupMembers.forEach(async (gm) => {
            // if user does not already have access to the track, grant the user a new access
            if (!userWithAccessToTrack.includes(gm.userId)) {
                await db.insert(access).values({
                    accessListId: accessListForTrack.id,
                    userId: gm.userId,
                });
            }
        });
    });

    return { success: true, error: null };
}
